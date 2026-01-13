import { MultiPageFormContext } from "./context";
import type { MultiPageFormContextValue } from "./context";

interface MultiPageFormProviderProps {
  value: MultiPageFormContextValue;
  children: React.ReactNode;
}

export function MultiPageFormProvider({
  value,
  children,
}: MultiPageFormProviderProps) {
  return (
    <MultiPageFormContext.Provider value={value}>
      {children}
    </MultiPageFormContext.Provider>
  );
}
