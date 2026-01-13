import type { MultiPageFormStep } from "@/components/dashboard/multi-page-form/types";
import { createContext } from "react";

export interface MultiPageFormContextValue {
  currentStep: number;
  totalSteps: number;
  steps: MultiPageFormStep[];
  isFirstStep: boolean;
  isLastStep: boolean;
  next: () => Promise<void>;
  previous: () => void;
  goToStep: (stepIndex: number) => void;
  direction: 1 | -1;
}

export const MultiPageFormContext = createContext<
  MultiPageFormContextValue | undefined
>(undefined);
