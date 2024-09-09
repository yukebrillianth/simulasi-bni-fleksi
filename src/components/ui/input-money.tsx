import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
}

const formatMoney = (value: string) => {
  // check conditional if 0 first remove 0 on the first character
  // if (value.charAt(0) === "0") {
  //   value = value.slice(1);
  // }

  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const InputMoney = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onInput, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onInput={(e) => {
          // Call the formatMoney function
          e.currentTarget.value = formatMoney(e.currentTarget.value);
          // Call the onInput prop if it's provided
          if (onInput) {
            onInput(e);
          }
        }}
        {...props}
      />
    );
  }
);

InputMoney.displayName = "InputMoney";
export { InputMoney };
