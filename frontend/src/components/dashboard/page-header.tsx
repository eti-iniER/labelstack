import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

interface PageHeaderProps {
  icon: IconType;
  title: string;
  description?: string;
  className?: string;
}

export const PageHeader = ({
  icon: Icon,
  title,
  description,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex h-fit items-center gap-3", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amber-100">
        <Icon className="size-5 text-amber-600" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};
