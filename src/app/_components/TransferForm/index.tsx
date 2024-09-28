import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";

const TransferForm = () => {
  console.log(1);

  return (
    <div className="flex flex-col gap-2">
      <FormInput name="recipient" label="Recipient" />
      <FormInput name="amount" label="Amount" error="aa" />
      <Button>Transfer</Button>
    </div>
  );
};

export default TransferForm;
