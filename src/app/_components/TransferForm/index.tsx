import { isAddress, parseEther } from "ethers";
import { useEffect } from "react";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import {
  useEstimateGas,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAccount, useBalance } from "wagmi";

import { Button } from "@/components/ui/button";
import { useCheckConnect } from "@/hooks/useCheckConnect";
import {
  useTransferRecordCreate,
  useTransferRecordPatch,
} from "@/hooks/useTransferRecord";

import { DecimalInput } from "../DecimalInput";

import FormInput from "./FormInput";

const RecipientInput = () => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    control,
    name: "recipient",
    rules: {
      required: "Recipient is required",
      validate: (value) => {
        return isAddress(value) || "Invalid address";
      },
    },
  });

  return (
    <FormInput
      name="recipient"
      onChange={field.onChange}
      onBlur={field.onBlur}
      label="Recipient"
      error={fieldState.error?.message}
    />
  );
};

const AmountInput = () => {
  const isCorrectConnected = useCheckConnect();
  const { control } = useFormContext();
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: {
      refetchInterval: 15 * 1000,
    },
  });

  const { field, fieldState } = useController({
    control,
    name: "amount",
    rules: {
      required: "Amount is required",
      validate: (value) => {
        const parsedValue = parseEther(value); // Convert input value to Wei

        // Validate that the amount is greater than 0
        if (parsedValue === 0n) {
          return "Amount must be greater than 0";
        }

        if (parsedValue > balanceData!.value) {
          return `Amount exceeds available balance of ${balanceData?.formatted} ETH`;
        }

        return true; // Valid
      },
    },
  });

  return (
    <FormInput
      name="amount"
      onChange={field.onChange}
      onBlur={field.onBlur}
      label="Amount"
      component={DecimalInput}
      value={field.value}
      error={fieldState.error?.message}
      disabled={!isCorrectConnected}
    />
  );
};

const TransferButton = () => {
  const isCorrectConnected = useCheckConnect();
  const { mutateAsync: createTransferRecord } = useTransferRecordCreate();
  const { mutateAsync: patchTransferRecord } = useTransferRecordPatch();

  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = useFormContext();

  const recipient = watch("recipient");
  const amount = watch("amount");

  const { data: estimateGas } = useEstimateGas({
    to: recipient,
    value: amount ? parseEther(amount) : undefined,
  });

  const { data: hash, isPending, sendTransactionAsync } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const hash = await sendTransactionAsync({
        gas: estimateGas,
        to: data.recipient,
        value: parseEther(data.amount),
      });

      await createTransferRecord({
        toAddress: data.recipient,
        amount: parseEther(data.amount).toString(),
        token: "ETH",
        txId: hash,
      });
    } catch (e) {
      // TODO handle error
      console.log(e);
    }
  };

  useEffect(() => {
    if (!hash) return;
    const check = async () => {
      if (isConfirmed) {
        toast.message("Transaction sent", {
          description: `hash id: ${hash}`,
        });
        await patchTransferRecord({
          hash: hash,
          status: "completed",
        });
      }
      if (isError) {
        toast.error("Transaction failed");
        await patchTransferRecord({
          hash: hash,
          status: "failed",
        });
      }
    };
    check();
  }, [hash, isConfirmed, isError, patchTransferRecord]);

  return (
    <Button
      disabled={
        !isCorrectConnected ||
        Object.keys(errors).length > 0 ||
        isPending ||
        isConfirming
      }
      onClick={handleSubmit(onSubmit)}
    >
      {isPending || isConfirming ? "Confirming..." : "Transfer"}
    </Button>
  );
};

const TransferForm = () => {
  const methods = useForm({
    defaultValues: {
      recipient: "",
      amount: "",
    },
    mode: "onBlur",
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-2">
        <RecipientInput />
        <AmountInput />
        <TransferButton />
      </div>
    </FormProvider>
  );
};

export default TransferForm;
