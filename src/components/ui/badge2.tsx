import * as React from "react"
import { cn } from "@/lib/utils"

type Badge2Color = "cyan" | "purple" | "pink" | "emerald" | "orange" | "amber" | "red"

const BADGE2_COLORS: Record<Badge2Color, string> = {
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
}

interface Badge2Props {
  children: React.ReactNode
  color?: Badge2Color
  className?: string
}

/**
 * Neon-style badge for DrugEye admin/dark pages
 * Provides glow effect with color variants
 */
function Badge2({ 
  children, 
  color = "cyan",
  className 
}: Badge2Props) {
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black tracking-widest border uppercase",
      BADGE2_COLORS[color],
      className
    )}>
      {children}
    </span>
  )
}

export { Badge2, BADGE2_COLORS }