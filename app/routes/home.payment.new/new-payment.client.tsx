import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createPaymentSchema,
  paymentReferceSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import SelectForm from "@/components/custom/select/SelectForm";
import { PartyType, partyTypeToJSON, PaymentType } from "~/gen/common";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { Separator } from "@/components/ui/separator";
import {
  PartyAutocompleteForm,
  usePartyDebounceFetcher,
} from "~/util/hooks/fetchers/usePartyDebounceFetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import {
  LedgerAutocompleteForm,
  useAccountLedgerDebounceFetcher,
} from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { routes } from "~/util/route";
import { action, loader } from "./route";
import { useCreatePayment } from "./use-create-payment";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { Typography } from "@/components/typography";
import { DataTable } from "@/components/custom/table/CustomTable";
import { paymentReferencesColumns } from "@/components/custom/table/columns/accounting/payment-columns";
import AccordationLayout from "@/components/layout/accordation-layout";
import { Card } from "@/components/ui/card";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import { DEFAULT_CURRENCY } from "~/constant";
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/useInvoiceDebounceFetcher";
import { parties } from "~/util/party";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { removeFromList } from "../home.pricing.new/util/formula";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function PaymentCreateClient() {
  const { associatedActions, paymentAccounts } = useLoaderData<typeof loader>();
  const fetcherPaymentPartiesType = useFetcher<typeof action>();
  const fetcher = useFetcher<typeof action>();
  const { t, i18n } = useTranslation("common");
  const { toast } = useToast();
  const [paymentTypes, setPaymentTypes] = useState<SelectItem[]>([]);
  const createPayment = useCreatePayment();
  const taxLinesStore = useTaxAndCharges();
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount: formatAmount(createPayment.payload?.amount),
      paymentType: createPayment.payload?.paymentType,
      party: createPayment.payload?.partyName,
      partyID: createPayment.payload?.partyID,
      partyType: createPayment.payload?.partyType,
      partyReference: createPayment.payload?.partyReference,
      partyReferences: createPayment.payload?.partyReferences || [],
      postingDate: new Date(),
      taxLines: [],
    },
  });
  const [rowActions] = useTableRowActions({
    onDelete(index) {
      const res = removeFromList(form.getValues().partyReferences, index);
      form.setValue("partyReferences", res);
      form.trigger("partyReferences");
    },
  });
  const formValues = form.getValues();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toolbar = useToolbar();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const navigate = useNavigate();
  const r = routes;
  const p = parties;

  const onPartyTypeChange = (d: z.infer<typeof createPaymentSchema>) => {
    switch (d.partyType) {
      case partyTypeToJSON(PartyType.customer):
        form.setValue("accountPaidFromID", paymentAccounts?.receivable_acct_id);
        form.setValue("accountPaidFromName", paymentAccounts?.receivable_acct);
        form.setValue("accountPaidToID", paymentAccounts?.cash_acct_id);
        form.setValue("accountPaidToName", paymentAccounts?.cash_acct);
        break;
      case partyTypeToJSON(PartyType.supplier):
        form.setValue("accountPaidToID", paymentAccounts?.payable_acct_id);
        form.setValue("accountPaidToName", paymentAccounts?.payable_acct);
        form.setValue("accountPaidFromID", paymentAccounts?.cash_acct_id);
        form.setValue("accountPaidFromName", paymentAccounts?.cash_acct);
        break;
    }
    form.trigger("accountPaidFromID");
    form.trigger("accountPaidToID");
  };

  const fetchInitialData = () => {
    fetcherPaymentPartiesType.submit(
      {
        action: "payment-parties",
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  const onSubmit = (values: z.infer<typeof createPaymentSchema>) => {
    fetcher.submit(
      {
        action: "create-payment",
        createPayment: values as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  const setUpPaymentTypes = () => {
    const n: SelectItem[] = [
      {
        name: t(PaymentType[PaymentType.PAY]),
        value: PaymentType[PaymentType.PAY],
      },
      {
        name: t(PaymentType[PaymentType.RECEIVE]),
        value: PaymentType[PaymentType.RECEIVE],
      },
      {
        name: t(PaymentType[PaymentType.INTERNAL_TRANSFER]),
        value: PaymentType[PaymentType.INTERNAL_TRANSFER],
      },
    ];
    setPaymentTypes(n);
  };

  const setUpToolbar = () => {
    toolbar.setToolbar({
      onSave: () => {
        inputRef.current?.click();
      },
    });
  };

  const updateAmountFromReferences = () => {
    const totalAllocated = formValues.partyReferences.reduce(
      (prev, curr) => prev + Number(curr.allocated),
      0
    );
    form.setValue("amount", totalAllocated);
    console.log("TOTAL ALLOCATED", typeof totalAllocated);
    form.trigger("amount");
  };

  useEffect(()=>{
    updateAmountFromReferences()
  },[formValues.partyReferences])

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
  }, [formValues.taxLines]);

  useEffect(() => {
    onPartyTypeChange(formValues);
  }, [formValues.partyType, paymentAccounts]);

  useEffect(() => {
    taxLinesStore.reset();
    setUpPaymentTypes();
    fetchInitialData();
    setUpToolbar();
  }, []);


  useDisplayMessage({
    success:fetcher.data?.message,
    error:fetcher.data?.error,
    onSuccessMessage:()=>{
      navigate(
        r.toRoute({
          main: partyTypeToJSON(PartyType.payment),
          routeSufix: [fetcher.data?.payment?.code || ""],
          q: {
            tab: "info",
          },
        })
      );
    }
  },[fetcher.data])


  return (
    <Card>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("", "gap-y-3 grid p-3")}
          >
            <div className="create-grid">
              <Typography className=" col-span-full" variant="title2">
                {t("_payment.type")}
              </Typography>
              <CustomFormDate
                control={form.control}
                name="postingDate"
                label={t("form.date")}
              />
              <SelectForm
                control={form.control}
                data={paymentTypes}
                label={t("form.paymentType")}
                keyName={"name"}
                keyValue={"value"}
                name="paymentType"
              />
              <Separator className=" col-span-full" />

              <Typography className=" col-span-full" variant="title2">
                {t("_payment.paymentFromTo")}
              </Typography>

              <SelectForm
                form={form}
                data={fetcherPaymentPartiesType.data?.partiesType || []}
                label={t("form.partyType")}
                keyName={"name"}
                onValueChange={() => {
                  form.trigger("partyType");
                }}
                keyValue={"code"}
                name="partyType"
              />

              {formValues.partyType && (
                <div>
                  <PartyAutocompleteForm
                    control={form.control}
                    label={t("form.party")}
                    partyType={formValues.partyType}
                    onSelect={(e) => {
                      form.setValue("partyID", e.id);
                    }}
                  />
                </div>
              )}
              <Separator className=" col-span-full" />
              <Typography className=" col-span-full" variant="title2">
                {t("form.amount")}
              </Typography>

              <CustomFormField
                form={form}
                label={t("form.paidAmount", { o: "BOB" })}
                name="amount"
                children={(field) => {
                  return (
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  );
                }}
              />

              <Separator className=" col-span-full" />
              <AccordationLayout
                open={
                  !formValues.accountPaidFromID || !formValues.accountPaidToID
                }
                title={t("accounts")}
                containerClassName=" col-span-full"
                className="create-grid"
              >
                <LedgerAutocompleteForm
                  control={form.control}
                  label={t("_ledger.paidFrom")}
                  name="accountPaidFromName"
                  onSelect={(e) => {
                    form.setValue("accountPaidFromID", e.id);
                  }}
                />
                <LedgerAutocompleteForm
                  control={form.control}
                  label={t("_ledger.paidTo")}
                  name="accountPaidToName"
                  onSelect={(e) => {
                    form.setValue("accountPaidToID", e.id);
                  }}
                />
              </AccordationLayout>
              {(formValues.partyType && formValues.partyID) && (
                <>
                  <Separator className=" col-span-full" />
                  <Typography className=" col-span-full" variant="title2">
                    {t("table.reference")}
                  </Typography>

                  <InvoiceAutocompleteForm
                    label="Facturas"
                    partyType={p.paymentParties[formValues.partyType] || ""}
                    partyID={formValues.partyID}
                    onSelect={(e) => {
                      const n: z.infer<typeof paymentReferceSchema> = {
                        partyID: e.id,
                        partyType: p.paymentParties[formValues.partyType] || "",
                        partyName: e.code,
                        grandTotal: formatAmount(e.total_amount),
                        outstanding: formatAmount(
                          e.total_amount - e.paid_amount
                        ),
                        allocated: formatAmount(
                          e.total_amount - e.paid_amount
                        ),
                      };
                      const nl = [...formValues.partyReferences, n];
                      form.setValue("partyReferences", nl);
                      form.trigger("partyReferences");
                    }}
                  />
                  {/* {JSON.stringify(formValues)} */}
                  <div className=" col-span-full">
                    <DataTable
                      data={formValues.partyReferences}
                      columns={paymentReferencesColumns({ t, i18n })}
                      metaOptions={{
                        meta: {
                          updateCell: (
                            row: number,
                            column: string,
                            value: string
                          ) => {
                            form.setValue(
                              `partyReferences.${row}.${column}` as any,
                              value
                            );
                            form.trigger(`partyReferences`);
                            updateAmountFromReferences();
                          },
                          ...rowActions,
                        },
                      }}
                    />
                  </div>
                </>
              )}

              <TaxAndChargesLines
                onChange={(e) => {
                  form.setValue("taxLines", e);
                  form.trigger("taxLines");
                }}
                currency={companyDefaults?.currency || DEFAULT_CURRENCY}
                showTotal={false}
              />
            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
  );
}
