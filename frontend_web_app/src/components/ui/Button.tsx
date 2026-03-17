import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

/**
 * PUBLIC_INTERFACE
 * Button is a shared UI primitive that applies consistent Soft Gray styling.
 */
export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base = "ui-button ui-focus-ring";
  const variantClass = variant === "primary" ? "ui-button-primary" : "";
  const merged = [base, variantClass, className].filter(Boolean).join(" ");

  return <button {...props} className={merged} />;
}
