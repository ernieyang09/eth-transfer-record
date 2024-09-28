import cls from "classnames";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FormInputProps = {
  name: string;
  label?: string;
  error?: string;
};
const FormInput = ({ name, label, error }: FormInputProps) => {
  return (
    <div>
      {label && (
        <Label className="text-sm font-bold block mb-1" htmlFor={name}>
          {label}
        </Label>
      )}
      <Input type="text" id={name} />
      <div className={cls("text-sm text-[red] h-5")}>{error}</div>
    </div>
  );
};

export default FormInput;
