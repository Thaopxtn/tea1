import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = cva("button", {
  variants: {
    intent: {
      primary: "button-primary",
      secondary: "button-secondary",
      quiet: "button-quiet",
      danger: "button-danger",
    },
    size: {
      sm: "button-sm",
      md: "button-md",
      lg: "button-lg",
    },
  },
  defaultVariants: { intent: "primary", size: "md" },
});

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, intent, size, ...props }: Props) {
  return (
    <button
      className={clsx(buttonVariants({ intent, size }), className)}
      {...props}
    />
  );
}
