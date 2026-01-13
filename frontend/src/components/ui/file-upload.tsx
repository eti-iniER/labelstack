import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX, FiFile } from "react-icons/fi";

interface FileUploadProps {
  name?: string;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  value?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  name,
  accept,
  required,
  disabled,
  value,
  onChange,
  className,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onChange?.(acceptedFiles[0]);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...(accept && { accept: { [accept]: [] } }),
    maxFiles: 1,
    disabled,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group border-input relative flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        "hover:border-primary/50 hover:bg-accent/50",
        "focus-within:border-primary focus-within:ring-primary/20 focus-within:ring-2 focus-within:outline-none",
        isDragActive && "border-primary bg-accent/50 ring-primary/20 ring-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        {...getInputProps()}
        name={name}
        required={required}
        disabled={disabled}
      />

      {value ? (
        <div className="flex w-full items-center gap-3 p-4">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded">
            <FiFile className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-muted-foreground text-xs">
              {(value.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleClear}
            disabled={disabled}
          >
            <FiX className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
            <FiUpload className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Upload file</p>
            <p className="text-muted-foreground text-xs">
              Click or drag to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
