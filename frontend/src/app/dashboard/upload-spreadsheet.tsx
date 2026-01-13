import { PageHeader } from "@/components/dashboard/page-header";
import FileUpload from "@/components/ui/file-upload";
import { TbFileUpload } from "react-icons/tb";

export const UploadSpreadsheet = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-2">
      <PageHeader
        icon={TbFileUpload}
        title="Upload spreadsheet"
        description="Create orders from a CSV upload"
      />
      <div className="flex h-full min-h-0 w-full flex-1">
        <FileUpload />
      </div>
    </div>
  );
};
