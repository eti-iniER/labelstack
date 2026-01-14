import { MultiPageForm } from "@/components/dashboard/multi-page-form";
import type { MultiPageFormStep } from "@/components/dashboard/multi-page-form/types";
import { useMultiPageForm } from "@/components/dashboard/multi-page-form/use-multi-page-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { TbEye, TbFileUpload, TbPackage, TbShoppingCart } from "react-icons/tb";
import {
  Upload,
  ReviewAndEdit,
  SelectShippingProvider,
  Purchase,
} from "./steps";
import type { StepperStep } from "@/components/dashboard/stepper";
import type { UploadSpreadsheetData } from "@/app/dashboard/upload-spreadsheet/types";

export const UploadSpreadsheet = () => {
  const stepperSteps: StepperStep[] = [
    {
      id: "upload",
      icon: TbFileUpload,
      text: "Upload",
    },
    {
      id: "review-and-edit",
      icon: TbEye,
      text: "Review",
    },
    {
      id: "select-shipping-provider",
      icon: TbPackage,
      text: "Select shipping provider",
    },
    {
      id: "purchase",
      icon: TbShoppingCart,
      text: "Purchase",
    },
  ];

  const formSteps: MultiPageFormStep[] = [
    {
      id: "upload",
      component: Upload,
    },
    {
      id: "review-and-edit",
      component: ReviewAndEdit,
    },
    {
      id: "select-shipping-provider",
      component: SelectShippingProvider,
    },
    {
      id: "purchase",
      component: Purchase,
    },
  ];

  const multiPageForm = useMultiPageForm<UploadSpreadsheetData>({
    steps: formSteps,
    onComplete: async (data) => {
      console.log("Form completed with data:", data);
    },
  });

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2">
      <PageHeader
        icon={TbFileUpload}
        title="Upload spreadsheet"
        description="Create orders from a CSV upload"
      />
      <div className="flex h-full min-h-0 w-full flex-1">
        <MultiPageForm form={multiPageForm} stepperSteps={stepperSteps} />
      </div>
    </div>
  );
};
