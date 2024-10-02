import { UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { PaginatedResponse } from "@/types/api";
import type {
  Status,
  TransferRecord,
  TransferRecordCreate,
} from "@/types/transferRecord";

import { useCheckConnect } from "./useCheckConnect";

export type TransferRecordQueryParams = {
  chainId: number;
  address: string;
  offset?: number;
  limit?: number;
};

export const getQueryKey = (params: TransferRecordQueryParams) => [
  "TransferRecord",
  params,
];

export const useFetchTransferRecord = (
  params: {
    page: number;
    limit?: number;
  } = {
    page: 0,
    limit: 10,
  },
  options?: UseQueryOptions<PaginatedResponse<TransferRecord>>
) => {
  const isCorrectConnected = useCheckConnect();
  const { chainId, address } = useAccount();
  return useQuery<PaginatedResponse<TransferRecord>, Error>({
    queryKey: getQueryKey({
      chainId: chainId!,
      address: address!,
      ...params,
    }),
    queryFn: async () => {
      return await fetch(
        `/api/records/${address}?chain=${chainId}&page=${params.page}&limit=${params.limit}`
      ).then((res) => res.json());
    },
    enabled: isCorrectConnected,
    ...options,
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
