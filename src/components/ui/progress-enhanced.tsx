import { cn } from "@/lib/utils"
import { Check, Circle, Loader2, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ProgressStepsProps {
  steps: { title: string; description?: string }[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export function ProgressSteps({ 
  steps, 
  currentStep, 
  onStepClick,
  className 
}: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep
        
        return (
          <div key={index} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                isCompleted && "text-primary",
                isCurrent && "bg-primary/10 text-primary",
                isPending && "text-muted-foreground cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary/20 text-primary border border-primary",
                isPending && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </button>
            
            {index < steps.length - 1 && (
              <ChevronRight className={cn(
                "w-4 h-4",
                isCompleted ? "text-primary" : "text-muted"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
  className?: string
}

export function LoadingOverlay({ message = "Loading...", className }: LoadingOverlayProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" }
  
  return (
    <Loader2 className={cn("animate-spin text-primary", sizes[size], className)} />
  )
}