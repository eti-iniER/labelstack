/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MultiPageFormStep } from "@/components/dashboard/multi-page-form/types";
import { createContext } from "react";

export interface MultiPageFormContextValue<TData = any> {
  currentStep: number;
  totalSteps: number;
  steps: MultiPageFormStep[];
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => Promise<void>;
  previous: () => void;
  goToStep: (stepIndex: number) => void;
  direction: 1 | -1;
  data: TData;
  setData: (data: Partial<TData> | ((prev: TData) => TData)) => void;
  maxStepReached: number;
}

export const MultiPageFormContext = createContext<
  MultiPageFormContextValue<any> | undefined
>(undefined);
