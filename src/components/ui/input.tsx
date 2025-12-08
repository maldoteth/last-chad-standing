import * as React from "react"
import { Calendar } from "lucide-react" // example icon
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { withIcon?: boolean }
>(({ className, type, withIcon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background text-white px-3 py-2 text-base ring-offset-background placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />

      {type === "date" && (
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
      )}
    </div>
  )
})

Input.displayName = "Input"

export { Input }
