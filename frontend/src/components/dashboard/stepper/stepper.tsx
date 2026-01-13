import { cn } from "@/lib/utils";
import { useMultiPageFormContext } from "@/components/dashboard/multi-page-form/use-multi-page-form";
import { FiCheck } from "react-icons/fi";

export interface StepperStep {
  id: string;
  icon: React.ElementType;
  text: string;
  description?: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep?: number;
  maxStepReached?: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep: controlledCurrentStep,
  maxStepReached: controlledMaxStepReached,
  onStepClick,
  className,
}: StepperProps) {
  const currentStep = controlledCurrentStep ?? 0;
  const maxStepReached = controlledMaxStepReached ?? currentStep;

  return (
    <div className={cn("w-full", className)}>
      <ol className="flex w-full items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index <= maxStepReached;
          const isLastStep = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn("flex items-center", !isLastStep && "flex-1")}
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "group flex shrink-0 items-center gap-2.5 transition-opacity",
                  isClickable && "cursor-pointer hover:opacity-80",
                  !isClickable && "cursor-default",
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary text-primary bg-primary/10 dark:bg-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted-foreground/30 text-muted-foreground bg-muted/50",
                  )}
                >
                  {isCompleted ? (
                    <FiCheck className="size-3.5" />
                  ) : (
                    <step.icon className="size-3.5" />
                  )}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-colors",
                      isCurrent && "text-foreground",
                      isCompleted && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground",
                    )}
                  >
                    {step.text}
                  </span>
                  {step.description && (
                    <span
                      className={cn(
                        "text-[11px] leading-tight whitespace-nowrap transition-colors",
                        isCurrent && "text-muted-foreground",
                        isCompleted && "text-muted-foreground",
                        !isCompleted &&
                          !isCurrent &&
                          "text-muted-foreground/70",
                      )}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </button>

              {!isLastStep && (
                <div
                  className={cn(
                    "mx-4 h-0.5 min-w-8 flex-1 transition-colors",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ConnectedStepper({
  steps,
  className,
}: Omit<StepperProps, "currentStep" | "maxStepReached" | "onStepClick">) {
  const { currentStep, maxStepReached, goToStep } = useMultiPageFormContext();

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      maxStepReached={maxStepReached}
      onStepClick={goToStep}
      className={className}
    />
  );
}
