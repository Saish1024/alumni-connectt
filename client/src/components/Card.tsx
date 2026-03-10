import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl text-slate-900 dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none p-6 transition-all duration-300",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

export { Card }
