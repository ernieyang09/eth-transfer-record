import { formatEther } from "ethers";
import { useAccount } from "wagmi";

import chainConfig from "@/config/chain";
import { useFetchTransferRecord } from "@/hooks/useTransferRecord";
import type { TransferRecord } from "@/types/transferRecord";

const TransferItem = (props: TransferRecord) => {
  const { chainId } = useAccount();
  const { toAddress, amount, txId, status } = props;
  return (
    <div className="text-sm">
      <div>
        Recipient: <span>{toAddress}</span>
      </div>
      <div>
        Amount: <span>{formatEther(amount)}</span>
      </div>
      <div>
        Transaction Hash:
        <a
          href={
            chainId && chainConfig[chainId]?.txViewer
              ? chainConfig[chainId].txViewer(txId)
              : ""
          }
          className="text-xs font-normal leading-snug text-muted-foreground underline ml-2"
        >
          {txId}
        </a>
      </div>
      <div>
        Status: <span>{status}</span>
      </div>
    </div>
  );
};

const TransferList = () => {
  const { data } = useFetchTransferRecord();

  const { data: records, totalPages, page } = data || {};

  return !data ? (
    "loading"
  ) : (
    <div className="flex flex-col gap-3">
      {(records || []).map((record) => (
        <TransferItem key={record.id} {...record} />
      ))}
    </div>
  );
};

export default TransferList;
