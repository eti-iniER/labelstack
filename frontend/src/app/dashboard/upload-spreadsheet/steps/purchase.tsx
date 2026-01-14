import { useState } from "react";
import { useJob } from "@/api/hooks/jobs/use-job";
import { type UploadSpreadsheetData } from "@/app/dashboard/upload-spreadsheet/types";
import { useMultiPageFormContext } from "@/components/dashboard/multi-page-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  TbArrowLeft,
  TbFileText,
  TbPrinter,
  TbShoppingCart,
} from "react-icons/tb";

type LabelSize = "letter-a4" | "4x6";

export const Purchase = () => {
  const multiPageForm = useMultiPageFormContext<UploadSpreadsheetData>();
  const jobId = multiPageForm.data.job;
  const { data: job } = useJob(jobId);
  const [labelSize, setLabelSize] = useState<LabelSize>("letter-a4");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const orderCount = job?.orders.length ?? 0;
  const totalCost = Number(job?.totalCost ?? 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-4 p-4">
      <div className="min-h-0 max-w-2xl flex-1 self-center overflow-y-auto px-2">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TbPrinter className="size-5" />
                Label format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={labelSize}
                onValueChange={(value) => setLabelSize(value as LabelSize)}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="letter-a4" id="letter-a4" />
                  <Label htmlFor="letter-a4" className="cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">Letter / A4</span>
                      <span className="text-muted-foreground text-sm">
                        Standard paper size (8.5×11 in or A4)
                      </span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="4x6" id="4x6" />
                  <Label htmlFor="4x6" className="cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium">4×6 inch</span>
                      <span className="text-muted-foreground text-sm">
                        Thermal label format
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TbFileText className="size-5" />
                Order summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Labels to create</span>
                <span className="font-medium">{orderCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Label format</span>
                <span className="font-medium">
                  {labelSize === "letter-a4" ? "Letter / A4" : "4×6 inch"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Grand total</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
              I agree to the terms of service and understand that label
              purchases are non-refundable once generated.
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-2 pt-4">
        <Button variant="outline" onClick={multiPageForm.previous}>
          <TbArrowLeft className="size-4" />
          Previous step
        </Button>
        <Button disabled={!termsAccepted} onClick={multiPageForm.next}>
          <TbShoppingCart className="size-4" />
          Purchase labels
        </Button>
      </div>
    </div>
  );
};
