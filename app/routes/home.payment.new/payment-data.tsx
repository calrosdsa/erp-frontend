import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import {
  FetcherWithComponents,
  useFetcher,
  useOutletContext,
} from "@remix-run/react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  paymentDataSchema,
  paymentReferceSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { MutableRefObject, useEffect } from "react";
import { GlobalState } from "~/types/app";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { PaymentType } from "~/gen/common";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";
import SelectForm from "@/components/custom/select/SelectForm";

import { Separator } from "@/components/ui/separator";
import AccordationLayout from "@/components/layout/accordation-layout";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { formatAmount } from "~/util/format/formatCurrency";
import { DataTable } from "@/components/custom/table/CustomTable";
import { paymentReferencesColumns } from "@/components/custom/table/columns/accounting/payment-columns";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import { DEFAULT_CURRENCY } from "~/constant";
import { Form } from "@/components/ui/form";
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { components, operations } from "~/sdk";
import { action as actionAccount } from "../home.accounting.account.$name/route";
import { useFetcherWithPromise } from "../../util/hooks/use-fetcher-with-promise";
import { usePaymentData } from "./use-payment-data";

type PaymentDataType = z.infer<typeof paymentDataSchema>;
export default function PaymentData({
  form,
  onSubmit,
  fetcher,
  inputRef,
  allowEdit,
  allowCreate,
}: {
  form: UseFormReturn<PaymentDataType, any, undefined>;
  onSubmit: (e: PaymentDataType) => void;
  fetcher: FetcherWithComponents<any>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  allowCreate?: boolean;
}) {
  const { t, i18n } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const paymentTypes = [
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
  const taxLinesStore = useTaxAndCharges();
  const {
    // append: appendPaymentReference,
    remove: removePaymentReference,
    move: movePaymentReference,
  } = useFieldArray({
    control: form.control,
    name: "paymentReferences",
  });
  const [rowActions] = useTableRowActions({
    onDelete(index) {
      removePaymentReference(index);
    },
  });
  const formValues = form.getValues();
  const fetcherAccountBalance = useFetcherWithPromise<typeof actionAccount>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const r = route;
  const { accountBalanceService } = usePaymentData({
    form: form,
    i18n: i18n,
  });

  const updateAmountFromReferences = () => {
    if(formValues.paymentReferences.length == 0) return
    const totalAllocated = formValues.paymentReferences.reduce(
      (prev, curr) => prev + Number(curr.allocated),
      0
    );
    form.setValue("amount", totalAllocated);
    console.log("TOTAL ALLOCATED", typeof totalAllocated);
    form.trigger("amount");
  };

  useEffect(() => {
    updateAmountFromReferences();
  }, [formValues.paymentReferences]);

  useEffect(() => {}, [fetcherAccountBalance.data]);

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
  }, [formValues.taxLines]);

  //   useEffect(() => {
  //     onPartyTypeChange(formValues);
  //   }, [formValues.partyType, paymentAccounts]);

  useEffect(() => {
    taxLinesStore.reset();
    // setUpToolbar();
  }, []);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("", "gap-y-3 grid p-3")}
        >
          <div className="create-grid">
            <Typography className=" col-span-full" variant="subtitle2">
              {t("_payment.type")}
            </Typography>
            {!allowEdit && (
              <CustomFormDate
                control={form.control}
                name="postingDate"
                label={t("form.date")}
                allowEdit={allowEdit}
              />
            )}
            <SelectForm
              control={form.control}
              data={paymentTypes}
              label={t("form.paymentType")}
              keyName={"name"}
              keyValue={"value"}
              allowEdit={allowEdit}
              onValueChange={() => {
                form.trigger("partyType");
              }}
              name="paymentType"
            />
            <Separator className=" col-span-full" />

            <Typography className=" col-span-full" variant="subtitle2">
              {t("_payment.paymentFromTo")}
            </Typography>

            <SelectForm
              form={form}
              data={r.p.paymentOptions}
              allowEdit={allowEdit}
              label={t("form.partyType")}
              keyName={"name"}
              onValueChange={() => {
                form.trigger("partyType");
              }}
              keyValue={"value"}
              name="partyType"
            />

            {formValues.partyType && (
              <div>
                <PartyAutocompleteField
                  control={form.control}
                  partyType={formValues.partyType}
                  allowEdit={allowEdit}
                  roleActions={roleActions}
                />
              </div>
            )}
            <Separator className=" col-span-full" />
            <Typography className=" col-span-full" variant="subtitle2">
              {t("form.amount")}
            </Typography>

            <CustomFormFieldInput
              allowEdit={allowEdit}
              label={t("form.paidAmount", { o: "BOB" })}
              control={form.control}
              name="amount"
              inputType="input"
            />

            <Separator className=" col-span-full" />
            <AccordationLayout
              open={true}
              title={t("accounts")}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <LedgerAutocompleteFormField
                control={form.control}
                label={t("_ledger.paidFrom")}
                name="accountPaidFrom"
                description={accountBalanceService.formatAmountBalance(
                  formValues?.accountPaidFromBalance,
                  formValues?.accountPaidFromCurrency
                )}
                allowEdit={allowEdit}
                onSelect={async (e) => {
                  const openingData =
                    await accountBalanceService.getAccountBalance(e.name, e.id);
                  accountBalanceService.setAccountValue({
                    accountPaidFromBalance: openingData?.opening_balance,
                    accountPaidFromCurrency: e.currency,
                  });
                }}
              />
              <LedgerAutocompleteFormField
                control={form.control}
                label={t("_ledger.paidTo")}
                name="accountPaidTo"
                description={accountBalanceService.formatAmountBalance(
                  formValues?.accountPaidToBalance,
                  formValues?.accountPaidToCurrency
                )}
                allowEdit={allowEdit}
                onSelect={async (e) => {
                  const openingData =
                    await accountBalanceService.getAccountBalance(e.name, e.id);
                  accountBalanceService.setAccountValue({
                    accountPaidToBalance: openingData?.opening_balance,
                    accountPaidToCurrency: e.currency,
                  });
                }}
              />
            </AccordationLayout>
            {formValues.partyType && formValues.party?.id && (
              <>
                <Separator className=" col-span-full" />
                <Typography className=" col-span-full" variant="subtitle2">
                  {t("table.reference")}
                </Typography>
                {allowEdit && (
                  <InvoiceAutocompleteForm
                    label="Facturas"
                    partyType={r.p.paymentParties[formValues.partyType] || ""}
                    partyID={formValues.party.id}
                    allowEdit={allowEdit}
                    onSelect={(e) => {
                      const n: z.infer<typeof paymentReferceSchema> = {
                        partyID: e.id,
                        currency: e.currency,
                        partyType:
                          r.p.paymentParties[formValues.partyType] || "",
                        partyName: e.code,
                        grandTotal: formatAmount(e.total_amount),
                        outstanding: formatAmount(
                          e.total_amount - e.paid_amount
                        ),
                        allocated: formatAmount(e.total_amount - e.paid_amount),
                      };
                      const nl = [...formValues.paymentReferences, n];
                      form.setValue("paymentReferences", nl);
                      form.trigger("paymentReferences");
                    }}
                  />
                )}
                <div className=" col-span-full">
                  <DataTable
                    data={formValues.paymentReferences}
                    columns={paymentReferencesColumns({ t, i18n })}
                    fullHeight={false}
                    metaOptions={{
                      meta: {
                        updateCell: (
                          row: number,
                          column: string,
                          value: string
                        ) => {
                          form.setValue(
                            `paymentReferences.${row}.${column}` as any,
                            value
                          );
                          form.trigger(`paymentReferences`);
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
              allowCreate={allowCreate}
              allowEdit={allowEdit}
            />

            <AccountingDimensionForm form={form} allowEdit={allowEdit} />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
