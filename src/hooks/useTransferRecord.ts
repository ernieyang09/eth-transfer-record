import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { PaginatedResponse } from "@/types/api";
import type {
  Status,
  TransferRecord,
  TransferRecordCreate,
} from "@/types/transferRecord";

import { useCheckConnect } from "./useCheckConnect";

export const getQueryKey = (chainId: number, address: string) => [
  "TransferRecord",
  chainId,
  address,
];

export const useFetchTransferRecord = () => {
  const isCorrectConnected = useCheckConnect();
  const { chainId, address } = useAccount();
  return useQuery<PaginatedResponse<TransferRecord>, Error>({
    queryKey: getQueryKey(chainId!, address!),
    queryFn: async () => {
      return await fetch(`/api/records/${address}?chain=${chainId}`).then(
        (res) => res.json()
      );
    },
    enabled: isCorrectConnected,
  });
};

export const useTransferRecordCreate = () => {
  const { chainId, address } = useAccount();

  return useMutation<
    { id: string },
    Error,
    Omit<TransferRecordCreate, "chain" | "fromAddress">
  >({
    mutationFn: async (
      data: Omit<TransferRecordCreate, "chain" | "fromAddress">
    ) => {
      return await fetch(`/api/records/${address}`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          chain: chainId,
          fromAddress: address,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
  });
};

export const useTransferRecordPatch = () => {
  const { address } = useAccount();

  return useMutation<TransferRecord, Error, { hash: string; status: Status }>({
    mutationFn: async (data: { hash: string; status: Status }) => {
      console.log(data, 123);
      return await fetch(`/api/records/${address}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    },
  });
};
