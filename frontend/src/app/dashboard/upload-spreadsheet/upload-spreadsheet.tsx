import { MultiPageForm } from "@/components/dashboard/multi-page-form";
import type { MultiPageFormStep } from "@/components/dashboard/multi-page-form/types";
import { PageHeader } from "@/components/dashboard/page-header";
import { TbEye, TbFileUpload, TbPackage } from "react-icons/tb";
import { Upload } from "./steps";
import type { StepperStep } from "@/components/dashboard/stepper";

export const UploadSpreadsheet = () => {
  const stepperSteps: StepperStep[] = [
    {
      id: "upload",
      icon: TbFileUpload,
      text: "Upload",
    },
    {
      id: "review",
      icon: TbEye,
      text: "Review",
    },
    {
      id: "select-shipping-provider",
      icon: TbPackage,
      text: "Select shipping provider",
    },
  ];

  const formSteps: MultiPageFormStep[] = [
    {
      id: "upload",
      component: Upload,
    },
  ];

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2">
      <PageHeader
        icon={TbFileUpload}
        title="Upload spreadsheet"
        description="Create orders from a CSV upload"
      />
      <div className="flex h-full min-h-0 w-full flex-1">
        <MultiPageForm steps={formSteps} stepperSteps={stepperSteps} />
      </div>
    </div>
  );
};
