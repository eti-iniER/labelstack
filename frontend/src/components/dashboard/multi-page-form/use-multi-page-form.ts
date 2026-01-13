import { useState, useCallback, useMemo, useContext } from "react";
import type { MultiPageFormContextValue } from "./context";
import type { MultiPageFormStep } from "./types";
import { MultiPageFormContext } from "./context";

export interface UseMultiPageFormOptions {
  steps: MultiPageFormStep[];
  onComplete?: () => void | Promise<void>;
}

export function useMultiPageForm({
  steps,
  onComplete,
}: UseMultiPageFormOptions): MultiPageFormContextValue {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setDirection(stepIndex > currentStep ? 1 : -1);
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps, currentStep],
  );

  const next = useCallback(async () => {
    const currentStepConfig = steps[currentStep];

    if (currentStepConfig.onNext) {
      await currentStepConfig.onNext();
    }

    if (isLastStep) {
      if (onComplete) {
        await onComplete();
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [currentStep, steps, isLastStep, onComplete, totalSteps]);

  const previous = useCallback(() => {
    const currentStepConfig = steps[currentStep];

    if (currentStepConfig.onPrevious) {
      currentStepConfig.onPrevious();
    }

    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [currentStep, steps]);

  return useMemo(
    () => ({
      currentStep,
      totalSteps,
      steps,
      isFirstStep,
      isLastStep,
      next,
      previous,
      goToStep,
      direction,
    }),
    [
      currentStep,
      totalSteps,
      steps,
      isFirstStep,
      isLastStep,
      next,
      previous,
      goToStep,
      direction,
    ],
  );
}

export function useMultiPageFormContext(): MultiPageFormContextValue {
  const context = useContext(MultiPageFormContext);

  if (!context) {
    throw new Error(
      "useMultiPageFormContext must be used within a MultiPageFormProvider",
    );
  }

  return context;
}
