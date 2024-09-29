"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, forwardRef, HTMLProps, useCallback } from "react";

interface InputProps
  extends Omit<HTMLProps<HTMLInputElement>, "onChange" | "as" | "value"> {
  value: string;
  onChange: (input: string) => void;
  placeholder?: string;
}

interface EnforcedInputProps extends InputProps {
  // Validates nextUserInput; returns stringified value, or null if invalid
  enforcer: (nextUserInput: string) => string | null;
  pattern: string;
}

const NumericInput = forwardRef<HTMLInputElement, EnforcedInputProps>(
  function NumericInput(
    { value, onChange, enforcer, pattern, ...props }: EnforcedInputProps,
    ref
  ) {
    const validateChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const nextInput = enforcer(
          event.target.value.replace(/,/g, ".")
        )?.replace(/^0+$/, "0");
        if (nextInput !== undefined) {
          onChange(nextInput);
        }
      },
      [enforcer, onChange]
    );

    return (
      <Input
        value={value}
        onChange={validateChange}
        // universal input options
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern={pattern}
        placeholder={props.placeholder || "0"}
        minLength={1}
        maxLength={79}
        spellCheck="false"
        ref={ref as any}
        {...props}
      />
    );
  }
);

const decimalRegexp = /^\d*(?:[.])?\d*$/;
const decimalEnforcer = (nextUserInput: string) => {
  if (nextUserInput === "") {
    return "";
  } else if (nextUserInput === ".") {
    return "0.";
  } else if (decimalRegexp.test(nextUserInput)) {
    return nextUserInput;
  }
  return null;
};

export const DecimalInput = forwardRef(function DecimalInput(
  props: InputProps,
  ref
) {
  return (
    <NumericInput
      pattern="^[0-9]*[.,]?[0-9]*$"
      enforcer={decimalEnforcer}
      ref={ref as any}
      {...props}
    />
  );
});
