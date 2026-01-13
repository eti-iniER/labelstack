import { AnimatePresence, motion } from "motion/react";
import { MultiPageFormProvider } from "./provider";
import {
  useMultiPageForm,
  type UseMultiPageFormOptions,
} from "./use-multi-page-form";
import { ConnectedStepper, type StepperStep } from "../stepper";
import { cn } from "@/lib/utils";

interface MultiPageFormProps extends UseMultiPageFormOptions {
  stepperSteps?: StepperStep[];
  className?: string;
}

export function MultiPageForm({
  steps,
  stepperSteps,
  onComplete,
  className,
}: MultiPageFormProps) {
  const formContext = useMultiPageForm({ steps, onComplete });
  const CurrentStepComponent = steps[formContext.currentStep]?.component;

  if (!CurrentStepComponent) {
    return null;
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <MultiPageFormProvider value={formContext}>
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        {stepperSteps && (
          <div className="mb-4">
            <ConnectedStepper steps={stepperSteps} />
          </div>
        )}
        <AnimatePresence mode="wait" custom={formContext.direction}>
          <motion.div
            key={formContext.currentStep}
            custom={formContext.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </MultiPageFormProvider>
  );
}
