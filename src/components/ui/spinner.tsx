import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "black" | "primary" | "gray";
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
};

const colorMap = {
  white: "border-white border-t-transparent",
  black: "border-black border-t-transparent",
  primary: "border-blue-500 border-t-transparent",
  gray: "border-gray-400 border-t-transparent",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
  fullScreen = false,
}) => {
  const spinner = (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeMap[size],
        colorMap[color],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

Spinner.displayName = "Spinner";
