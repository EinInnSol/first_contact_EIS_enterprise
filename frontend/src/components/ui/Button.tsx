"use client"

import { forwardRef, ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-indigo-600",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-500 focus-visible:ring-slate-500",
        danger: "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-red-600",
        success: "bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-green-600",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
        layer8: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-cyan-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-5 py-2.5",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
