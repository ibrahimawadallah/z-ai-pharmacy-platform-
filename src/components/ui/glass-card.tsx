import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
}

/**
 * Glass-effect card component for DrugEye admin/dark pages
 * Provides frosted glass aesthetic with gradient overlay
 */
function GlassCard({ 
  children, 
  className, 
  delay = 0,
  ...props 
}: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl p-8 shadow-2xl",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export { GlassCard }