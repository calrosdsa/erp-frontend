import CustomFormField from "@/components/custom/form/CustomFormField";
import FormLayout from "@/components/custom/form/FormLayout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import DetailLayout from "@/components/layout/detail-layout";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { components } from "~/sdk";
import { journalEntryLineSchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import { useAccountLedgerFetcher } from "~/util/hooks/fetchers/use-account-ledger-fethcer";

export const JournalEntryLine = ({ open }: { open: boolean }) => {
  const journalEntryLine = useJournalEntryLine();
  const { line, allowEdit, onEditLine } = journalEntryLine.payload || {};
  const fetcher = useFetcher();
  const { t } = useTranslation("common");
  const form = useForm<z.infer<typeof journalEntryLineSchema>>({
    resolver: zodResolver(journalEntryLineSchema),
    defaultValues: {
      ...line,
    },
  });
  const [ledgerFetcher, onLedgerChange] = useAccountLedgerFetcher({
    isGroup: false,
  });
  const onSubmit = (values: z.infer<typeof journalEntryLineSchema>) => {
    if (onEditLine) {
      onEditLine(values);
      journalEntryLine.onOpenChange(false);
    } else {
    }
  };
  return (
    <DrawerLayout open={open} onOpenChange={journalEntryLine.onOpenChange}>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-2 pb-2"
          >
            <div className="flex flex-col ">
              {allowEdit && (
                <div className=" flex flex-wrap gap-x-3 ">
                  <Button size={"xs"}>
                    <TrashIcon size={15} />
                  </Button>
                  <Button
                    type="submit"
                    size={"xs"}
                    loading={fetcher.state == "submitting"}
                  >
                    {t("form.save")}
                  </Button>
                </div>
              )}
            </div>
            <div className="drawer-grid pt-3">
              <CustomFormField
                required={true}
                name="debit"
                label={t("form.debit")}
                form={form}
                children={(field) => {
                  return <Input {...field} type="number" />;
                }}
              />
              <CustomFormField
                required={true}
                name="credit"
                label={t("form.credit")}
                form={form}
                children={(field) => {
                  return <Input {...field} type="number" />;
                }}
              />
              <FormAutocomplete
                data={ledgerFetcher.data?.results || []}
                nameK={"name"}
                label={t("ledger")}
                name="accountName"
                form={form}
                onValueChange={onLedgerChange}
                onSelect={(e) => {
                  form.setValue("accountID", e.id);
                }}
              />
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

interface Payload {
  line: z.infer<typeof journalEntryLineSchema>;
  allowEdit: boolean;
  onEditLine?: (e: z.infer<typeof journalEntryLineSchema>) => void;
}

interface JournalEntryLineStore {
  onOpenChange: (e: boolean) => void;
  openDialog: (e: Payload) => void;
  open: boolean;
  payload?: Payload;
}

export const useJournalEntryLine = create<JournalEntryLineStore>((set) => ({
  open: false,
  openDialog: (opts) =>
    set((state) => ({
      payload: opts,
      open: true,
    })),
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
