/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "motion/react";
import { MultiPageFormProvider } from "./provider";
import type { MultiPageFormContextValue } from "./context";
import { ConnectedStepper, type StepperStep } from "../stepper";
import { cn } from "@/lib/utils";

interface MultiPageFormProps<TData = any> {
  form: MultiPageFormContextValue<TData>;
  stepperSteps?: StepperStep[];
  className?: string;
}

export function MultiPageForm<TData = any>({
  form,
  stepperSteps,
  className,
}: MultiPageFormProps<TData>) {
  const CurrentStepComponent = form.steps[form.currentStep]?.component;

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
    <MultiPageFormProvider value={form}>
      <div className={cn("flex min-h-0 flex-1 flex-col p-4", className)}>
        {stepperSteps && (
          <div className="mb-4 max-w-4xl self-center">
            <ConnectedStepper steps={stepperSteps} />
          </div>
        )}
        <AnimatePresence mode="wait" custom={form.direction}>
          <motion.div
            key={form.currentStep}
            custom={form.direction}
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
