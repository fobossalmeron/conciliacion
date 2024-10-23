import React from "react";

interface BotonAccionProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  onClick,
  children,
  className = "",
  disabled = false,
  variant = "primary",
}: BotonAccionProps) {
  const baseClasses =
    "w-full py-3 px-4 text-lg font-medium rounded-md focus:outline-none transition-colors duration-200";

  const variantClasses =
    variant === "primary"
      ? "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-700 disabled:bg-gray-300"
      : "text-blue-700 bg-blue-100 hover:bg-blue-200 active:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
