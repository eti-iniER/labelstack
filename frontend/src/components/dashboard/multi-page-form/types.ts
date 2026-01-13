export interface MultiPageFormStep {
  id: string;
  component: React.ComponentType;
  onNext?: () => void | Promise<void>;
  onPrevious?: () => void | Promise<void>;
}
