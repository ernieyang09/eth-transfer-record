import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { TransferRecords } from "@/model/schema";
import type { Status, TransferRecordCreate } from "@/types/transferRecord";

type Params = {
  address: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

export async function GET(request: Request, context: { params: Params }) {
  try {
    const address = context.params.address;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const chain = searchParams.get("chain") || "";

    const offset = (page - 1) * limit;

    const conditions = chain
      ? and(
          eq(TransferRecords.fromAddress, address),
          eq(TransferRecords.chain, parseInt(chain))
        )
      : eq(TransferRecords.fromAddress, address);

    // Total records count
    const [{ count: totalRecords }] = await db
      .select({ count: count() })
      .from(TransferRecords)
      .where(conditions);

    const total: number = Number(totalRecords);

    // Fetching paginated records
    const paginatedRecords = await db
      .select()
      .from(TransferRecords)
      .where(conditions)
      .orderBy(desc(TransferRecords.createdAt))
      .limit(limit)
      .offset(offset);

    // Return paginated response
    return new Response(
      JSON.stringify({
        data: paginatedRecords,
        total: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching records:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

type TransferRecordInsertResponse = {
  id: number;
};

export async function POST(request: Request, context: { params: Params }) {
  try {
    const fromAddress = context.params.address;
    const body: TransferRecordCreate = await request.json();

    const { toAddress, amount, chain, token, txId } = body;

    // TODO validate the request body
    if (!fromAddress || !toAddress || !amount || !chain || !token || !txId) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
        }),
        {
          status: 422,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const res: TransferRecordInsertResponse[] = await db
      .insert(TransferRecords)
      .values({
        fromAddress,
        toAddress,
        token,
        amount: BigInt(amount),
        chain: chain,
        txId,
      })
      .returning({ id: TransferRecords.id });

    return new Response(
      JSON.stringify({
        id: res[0].id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function PATCH(request: Request, context: { params: Params }) {
  try {
    const fromAddress = context.params.address;
    const body: { hash: string; status: Status } = await request.json();

    const { hash, status } = body;

    // Check if the record exists
    const existingRecord = await db.query.TransferRecords.findFirst({
      where: and(
        eq(TransferRecords.fromAddress, fromAddress),
        eq(TransferRecords.txId, hash)
      ),
    });

    if (!existingRecord) {
      return new Response(
        JSON.stringify({
          error: "Record not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Perform update
    const updatedRecords = await db
      .update(TransferRecords)
      .set({
        status,
      })
      .where(
        and(
          eq(TransferRecords.fromAddress, fromAddress),
          eq(TransferRecords.txId, hash)
        )
      )
      .returning();

    return new Response(JSON.stringify(updatedRecords[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
