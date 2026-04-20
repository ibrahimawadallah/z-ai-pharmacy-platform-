import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  SearchX, 
  FileX, 
  Heart, 
  Users, 
  AlertCircle, 
  Database,
  ChevronRight,
  ArrowRight
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  variant?: "default" | "search" | "patients" | "favorites" | "alerts" | "drugs"
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const variantConfig = {
  default: { icon: Package, gradient: "from-slate-500 to-slate-600" },
  search: { icon: SearchX, gradient: "from-amber-500 to-orange-600" },
  patients: { icon: Users, gradient: "from-blue-500 to-indigo-600" },
  favorites: { icon: Heart, gradient: "from-rose-500 to-pink-600" },
  alerts: { icon: AlertCircle, gradient: "from-violet-500 to-purple-600" },
  drugs: { icon: Database, gradient: "from-emerald-500 to-teal-600" }
}

export function EmptyState({ 
  variant = "default", 
  title, 
  description, 
  action,
  secondaryAction,
  className 
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className={cn(
        "w-20 h-20 rounded-3xl bg-gradient-to-br shadow-lg flex items-center justify-center mb-6",
        config.gradient
      )}>
        <Icon className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick} className="gap-2">
            {action.label}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

export function EmptyStateInline({ 
  children,
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-3 text-muted-foreground py-8", className)}>
      {children}
    </div>
  )
}