import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  createJournalEntrySchema,
  journalEntryLineSchema,
} from "~/util/data/schemas/accounting/journal-entry-schema";
import { route } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import { JournalEntryType, PartyType } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/typography";
import { DataTable } from "@/components/custom/table/CustomTable";
import { journalEntryLineColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import {
  JournalEntryLine,
  useJournalEntryLine,
} from "../home.accounting.journalEntry.$name/components/journal-entry-line";
import { GlobalState } from "~/types/app-types";
import { DEFAULT_CURRENCY } from "~/constant";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useRef } from "react";
import CreateLayout from "@/components/layout/create-layout";
import { party } from "~/util/party";

export default function NewJournalEntryClient() {
  const { t } = useTranslation("common");
  const r = route;
  const fetcher = useFetcher<typeof action>();
  const form = useForm<z.infer<typeof createJournalEntrySchema>>({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: {
      lines: [],
    },
  });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const journalEntryLine = useJournalEntryLine();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const entryTypes: SelectItem[] = [
    {
      name: t("journalEntry"),
      value: PartyType[PartyType.journalEntry],
    },
    {
      name: t("cashEntry"),
      value: JournalEntryType[JournalEntryType.cashEntry],
    },
    {
      name: t("bankEntry"),
      value: JournalEntryType[JournalEntryType.bankEntry],
    },
    {
      name: t("creditCardEntry"),
      value: JournalEntryType[JournalEntryType.creditCardEntry],
    },
  ];
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      journalEntryLine.openDialog({
        line: {
          debit: 0,
          credit: 0,
          currency: companyDefaults?.currency || DEFAULT_CURRENCY,
          accountName: "",
          accountID: 0,
        },
        allowEdit: true,
        onEditLine: (e) => {
          const lines = form.getValues().lines;
          const n = [...lines, e];
          // console.log("LINES",lines,addLineOrder.orderLine)
          form.setValue("lines", n);
          form.trigger("lines");
        },
      });
    },
    onDelete: (rowIndex) => {
      const lines: z.infer<typeof journalEntryLineSchema>[] =
        form.getValues().lines;
      const f = lines.filter((_, idx) => idx != rowIndex);
      form.setValue("lines", f);
      form.trigger("lines");
    },
    onEdit: (rowIndex) => {
      const orderLines: z.infer<typeof journalEntryLineSchema>[] =
        form.getValues().lines;
      const f = orderLines.find((_, idx) => idx == rowIndex);
      if (f) {
        journalEntryLine.openDialog({
          allowEdit: true,
          line: f,
          onEditLine: (e) => {
            const orderLines: z.infer<typeof journalEntryLineSchema>[] =
              form.getValues().lines;
            const n = orderLines.map((t, idx) => {
              if (idx == rowIndex) {
                t = e;
              }
              return t;
            });
            form.setValue("lines", n);
            form.trigger("lines");
          },
        });
      }
    },
  });

  const onSubmit = (e: z.infer<typeof createJournalEntrySchema>) => {
    fetcher.submit(
      {
        action: "create-journal-entry",
        createJournalEntry: e as any,
      },
      {
        encType: "application/json",
        method: "POST",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", { o: t(party.journalEntry) }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        navigate(
          r.toRoute({
            main: r.journalEntry,
            routePrefix: [r.accountingM],
            routeSufix: [fetcher.data?.journalEntry?.code || ""],
          })
        );
      },
    },
    [fetcher.data]
  );
  return (
    <CreateLayout>
      <FormLayout>
        {journalEntryLine.open && (
          <JournalEntryLine open={journalEntryLine.open} />
        )}
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="create-grid">
              {/* <Typography className=" col-span-full" variant="title2">
              {t("_payment.type")}
              </Typography> */}
              <CustomFormDate
                form={form}
                name="postingDate"
                label={t("form.date")}
              />
              <SelectForm
                form={form}
                data={entryTypes}
                label={t("form.entryTypes")}
                keyName={"name"}
                keyValue={"value"}
                name="entryType"
              />
              <Separator className=" col-span-full" />
              <div className="col-span-full">
                <Typography variant="subtitle2">{t("form.entries")}</Typography>
                <DataTable
                  data={form.getValues().lines}
                  columns={journalEntryLineColumns()}
                  metaOptions={{
                    meta: {
                      ...metaOptions,
                      enableTooltipMessage: false,
                    },
                  }}
                />
              </div>
            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </CreateLayout>
  );
}
