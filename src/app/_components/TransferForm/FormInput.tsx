import cls from "classnames";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

export type FormInputProps = {
  name: string;
  label?: string;
  error?: string;
  component?: React.ElementType; // Allow passing a custom component
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, error, component: Component = Input, ...rest }, ref) => {
    return (
      <div>
        {label && (
          <Label className="text-sm font-bold block mb-1" htmlFor={name}>
            {label}
          </Label>
        )}
        <Component id={name} name={name} ref={ref} {...rest} />
        <div className={cls("text-sm text-[red] h-5")}>{error}</div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput"; // Required for forwardRef components

export default FormInput;
