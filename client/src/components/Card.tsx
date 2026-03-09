import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-3xl border border-gray-800 bg-secondary/40 backdrop-blur-md text-white shadow-xl p-6 transition-all hover:bg-secondary/60",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

export { Card }
