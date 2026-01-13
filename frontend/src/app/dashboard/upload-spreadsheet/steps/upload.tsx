import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { useUploadCSV } from "@/api/hooks/csv/use-upload-csv";
import { toast } from "sonner";

const uploadFormSchema = z.object({
  file: z
    .instanceof(File, { message: "Please select a file" })
    .refine((file) => file.type === "text/csv" || file.name.endsWith(".csv"), {
      message: "File must be a CSV",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export const Upload = () => {
  const { mutate: uploadCSV, isPending } = useUploadCSV();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
  });

  const onSubmit = (data: UploadFormValues) => {
    uploadCSV(
      { file: data.file },
      {
        onSuccess: () => {
          toast.success("CSV uploaded successfully");
          form.reset();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to upload CSV");
        },
      },
    );
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Upload CSV file
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload a CSV file containing your order data
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSV file</FormLabel>
                <FormControl>
                  <FileUpload
                    accept="text/csv,.csv"
                    value={field.value || null}
                    onChange={(file) => field.onChange(file)}
                    disabled={isPending}
                    className="min-h-50"
                  />
                </FormControl>
                <FormDescription>
                  Select a CSV file to upload (max 10MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Uploading..." : "Upload CSV"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
