import dayjs from "dayjs";
import { formatEther } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import chainConfig from "@/config/chain";
import { useFetchTransferRecord } from "@/hooks/useTransferRecord";
import type { TransferRecord } from "@/types/transferRecord";

const TransferItem = (props: TransferRecord) => {
  const { chainId } = useAccount();
  const { toAddress, amount, txId, status, createdAt } = props;
  return (
    <div className="text-sm flex flex-col gap-1">
      <div>
        Recipient:{" "}
        <span className="text-xs overflow-hidden break-all">{toAddress}</span>
      </div>
      <div>
        Amount: <span className="text-xs">{formatEther(amount)}</span>
      </div>
      <div>
        Transaction Hash:
        <a
          href={
            chainId && chainConfig[chainId]?.txViewer
              ? chainConfig[chainId].txViewer(txId)
              : ""
          }
          className="text-xs font-normal leading-snug text-muted-foreground underline ml-2 overflow-hidden break-all"
        >
          {txId}
        </a>
      </div>
      <div>
        Time:{" "}
        <span className="text-xs overflow-hidden break-all">
          {dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </div>
      <div>
        Status: <Badge variant="outline">{status}</Badge>
      </div>
    </div>
  );
};

const TransferPagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) => {
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
};

const TransferList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);

  const { data, isFetching } = useFetchTransferRecord({
    page: currentPage,
    limit: 5,
  });

  const { data: records, totalPages } = data || {};

  useEffect(() => {
    if (totalPages !== undefined) {
      setTotal(totalPages);
    }
  }, [totalPages]);

  return isFetching ? (
    <div className="flex items-center p-4 justify-center">
      <Loader />
    </div>
  ) : (
    <>
      <div className="flex flex-col gap-3">
        {(records || []).length > 0 ? (
          (records || []).map((record) => (
            <TransferItem key={record.id} {...record} />
          ))
        ) : (
          <div className="text-lg text-center py-8">No data</div>
        )}
      </div>
      <TransferPagination
        totalPages={total}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default TransferList;
