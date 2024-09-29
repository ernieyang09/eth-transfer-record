export type Status = "pending" | "completed" | "failed";
export type TransferRecord = {
  id: number;
  fromAddress: string;
  toAddress: string;
  amount: string;
  chain: number;
  txId: string;
  createdAt: Date; // ISO string or Date based on your DB schema
  status: Status;
  token: string;
};

export type TransferRecordCreate = Omit<
  TransferRecord,
  "id" | "status" | "fromAddress" | "createdAt"
>;
