import { formatEther } from "ethers";
import React from "react";
import { useAccount, useBalance } from "wagmi";
import { scrollSepolia } from "wagmi/chains";

import { Card } from "@/components/ui/card";

import TransferForm from "../TransferForm";
import TransferList from "../TransferList";

const ETH = () => {
  const { chainId, address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  return (
    <div>
      <div className="py-4">
        Balance:{" "}
        <span>
          {balanceData?.value ? formatEther(balanceData.value) : null}
        </span>
        {chainId === scrollSepolia.id && (
          <a
            className="ml-3 underlink text-sm text-orange-400"
            href="https://faucet.quicknode.com/scroll/sepolia"
            target="_blank"
          >
            faucet
          </a>
        )}
      </div>
      <div className="mb-5">
        <div className="text-lg font-bold mb-2">Transform Form</div>
        <Card className="p-2">
          <TransferForm />
        </Card>
      </div>

      <div>
        <div className="text-lg font-bold mb-2">Transform Record</div>
        <Card className="px-2 py-4">
          <TransferList />
        </Card>
      </div>
    </div>
  );
};

export default ETH;
