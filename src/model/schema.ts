import {
  bigint,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const TransferRecords = pgTable(
  "transfer_records",
  {
    id: serial("id").primaryKey(),
    toAddress: text("to_address").notNull(),
    fromAddress: text("from_address").notNull(),
    chain: integer("chain").notNull(),
    amount: bigint("amount_wei", { mode: "bigint" }).notNull(),
    txId: text("tx_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    token: text("token").notNull(),
    status: text("status").notNull().default("pending"),
  },
  (users) => {
    return {
      transferRecordsIdx: index("transfer_records_idx").on(
        users.chain,
        users.token,
        users.fromAddress,
        users.createdAt
      ),
    };
  }
);
