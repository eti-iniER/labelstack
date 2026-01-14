/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo, useContext } from "react";
import type { MultiPageFormContextValue } from "./context";
import type { MultiPageFormStep } from "./types";
import { MultiPageFormContext } from "./context";

export interface UseMultiPageFormOptions<TData = any> {
  steps: MultiPageFormStep[];
  initialData?: TData;
  onComplete?: (data: TData) => void | Promise<void>;
}

export function useMultiPageForm<TData = any>({
  steps,
  initialData,
  onComplete,
}: UseMultiPageFormOptions<TData>): MultiPageFormContextValue<TData> {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setDataState] = useState<TData>((initialData || {}) as TData);
  const [maxStepReached, setMaxStepReached] = useState(0);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const setData = useCallback(
    (update: Partial<TData> | ((prev: TData) => TData)) => {
      setDataState((prev) => {
        if (typeof update === "function") {
          return update(prev);
        }
        return { ...prev, ...update };
      });
    },
    [],
  );

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (
        stepIndex >= 0 &&
        stepIndex < totalSteps &&
        stepIndex <= maxStepReached
      ) {
        setDirection(stepIndex > currentStep ? 1 : -1);
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps, currentStep, maxStepReached],
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    setDirection(1);
    setDataState((initialData || {}) as TData);
    setMaxStepReached(0);
  }, [initialData]);

  const next = useCallback(async () => {
    if (isLastStep) {
      if (onComplete) {
        await onComplete(data);
      }
      reset();
    } else {
      setDirection(1);
      setCurrentStep((prev) => {
        const nextStep = Math.min(prev + 1, totalSteps - 1);
        setMaxStepReached((max) => Math.max(max, nextStep));
        return nextStep;
      });
    }
  }, [isLastStep, onComplete, data, totalSteps, reset]);

  const previous = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

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
      data,
      setData,
      maxStepReached,
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
      data,
      setData,
      maxStepReached,
    ],
  );
}

export function useMultiPageFormContext<
  TData = any,
>(): MultiPageFormContextValue<TData> {
  const context = useContext(MultiPageFormContext);

  if (!context) {
    throw new Error(
      "useMultiPageFormContext must be used within a MultiPageFormProvider",
    );
  }

  return context as MultiPageFormContextValue<TData>;
}
