import CustomFormDate from "@/components/custom/form/CustomFormDate";
import FormLayout from "@/components/custom/form/FormLayout";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfMonth, formatRFC3339, startOfMonth } from "date-fns";
import { useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { paths } from "~/sdk";
import { exportDataSchema } from "~/util/data/schemas/exporter/exporter-schema";
import { useExporter } from "~/util/hooks/ui/useExporter";
import type {
    PathsWithMethod,
  } from "openapi-typescript-helpers";


export const ExporterData = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t } = useTranslation("common");
  const { exportExcel } = useExporter();
  const exporterData = useExporterData()
  const form = useForm<z.infer<typeof exportDataSchema>>({
    resolver: zodResolver(exportDataSchema),
    defaultValues: {
      fromDate: startOfMonth(new Date()),
      toDate:endOfMonth(new Date()),
      path:exporterData.path
    },
  });

  const onSubmit = (values: z.infer<typeof exportDataSchema>) => {
    exportExcel({
        exportData:values,
    })
    onOpenChange(false)
  };
  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange} title="Export Data">
      <FormLayout>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <CustomFormDate
                label={t("form.fromDate")}
                form={form}
                name="fromDate"
              />
              <CustomFormDate
                label={t("form.toDate")}
                form={form}
                name="toDate"
              />
              <Button>{t("form.submit")}</Button>
            </div>
          </form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

interface ExporterDataStore {
  open: boolean;
  path?:PathsWithMethod<paths, "post">| undefined;
  onOpenChange: (e: boolean) => void;
  openExporter: (opts: {
    path:PathsWithMethod<paths, "post">
  }) => void;
}
export const useExporterData = create<ExporterDataStore>((set) => ({
  open: false,
  path:undefined,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
  openExporter: (opts) =>
    set((state) => ({
      open: true,
      path:opts.path
    })),
}));
