import { PageHeader } from "@/components/dashboard/page-header";
import { TbDashboard } from "react-icons/tb";

export const Dashboard = () => {
  return (
    <div className="flex h-full w-full flex-1">
      <PageHeader
        icon={TbDashboard}
        title="Dashboard"
        description="Overview of your account and recent activity"
      />
    </div>
  );
};
