import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { formatAmount, formatCurrency } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import {
  PartyType,
  partyTypeToJSON,
  PaymentType,
  State,
  stateFromJSON,
} from "~/gen/common";
import { action, loader } from "../route";
import { Typography } from "@/components/typography";
import { z } from "zod";
import {
  editPayment,
  mapToPaymentReferenceSchema,
  paymentReferceSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import { useEffect, useRef, useState } from "react";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import { PartyAutocompleteForm } from "~/util/hooks/fetchers/usePartyDebounceFetcher";
import CustomFormField from "@/components/custom/form/CustomFormField";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import AccordationLayout from "@/components/layout/accordation-layout";
import { LedgerAutocompleteForm } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { Form } from "@/components/ui/form";
import { DataTable } from "@/components/custom/table/CustomTable";
import { paymentReferencesColumns } from "@/components/custom/table/columns/accounting/payment-columns";

type EditType = z.infer<typeof editPayment>;
export default function PaymentInfoTab() {
  const { t } = useTranslation("common");
  const r = routes;
  const { payment, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const [paymentTypes, setPaymentTypes] = useState<SelectItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editPayment,
    defaultValues: {
      id: payment?.id,
      postingDate: new Date(payment?.posting_date || new Date()),
      amount: formatAmount(payment?.amount),
      partyType: payment?.party_type,
      paymentType: payment?.payment_type,
      party: payment?.party_name,
      partyID: payment?.party_id,
      accountPaidFromID: payment?.paid_from_id,
      accountPaidFromName: payment?.paid_from_name,
      accountPaidToID: payment?.paid_to_id,
      accountPaidToName: payment?.paid_to_name,
    },
  });
  const formValues = form.getValues();
  const allowEdit =
    permission?.edit || stateFromJSON(payment?.status) == State.DRAFT;

  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e as any,
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
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );
  useEffect(() => {
    setUpPaymentTypes();
  }, []);

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <Typography className=" col-span-full" variant="title2">
              {t("_payment.type")}
            </Typography>
            <CustomFormDate
              control={form.control}
              name="postingDate"
              allowEdit={allowEdit}
              label={t("form.date")}
            />
            <SelectForm
              control={form.control}
              data={paymentTypes}
              allowEdit={allowEdit}
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
              allowEdit={allowEdit}
              data={
                [
                  {
                    name: t("customer"),
                    value: r.customerM,
                  },
                  {
                    name: t("supplier"),
                    value: r.supplier,
                  },
                ] as SelectItem[]
              }
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
                <PartyAutocompleteForm
                  control={form.control}
                  label={t("form.party")}
                  allowEdit={allowEdit}
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

            <CustomFormFieldInput
              control={form.control}
              label={t("form.paidAmount", { o: "BOB" })}
              name="amount"
              inputType="input"
              allowEdit={allowEdit}
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
                allowEdit={allowEdit}
                onSelect={(e) => {
                  form.setValue("accountPaidFromID", e.id);
                }}
              />
              <LedgerAutocompleteForm
                control={form.control}
                label={t("_ledger.paidTo")}
                name="accountPaidToName"
                allowEdit={allowEdit}
                onSelect={(e) => {
                  form.setValue("accountPaidToID", e.id);
                }}
              />
            </AccordationLayout>

            {payment?.payment_references && (
              <>
                <Typography className=" col-span-full" variant="title2">
                  {t("table.reference")}
                </Typography>
                <div className=" col-span-full">
                  <DataTable
                    columns={paymentReferencesColumns()}
                    data={payment.payment_references.map((t) =>
                      mapToPaymentReferenceSchema(t)
                    )}
                  />
                </div>
              </>
            )}

            {/* {formValues.partyReferences.length > 0 && (
                <>
                  <Separator className=" col-span-full" />
                  <Typography className=" col-span-full" variant="title2">
                    {t("table.reference")}
                  </Typography>
                  <div className=" col-span-full">
                    <DataTable
                      data={form.getValues().partyReferences}
                      columns={paymentReferencesColumns()}
                    />
                  </div>
                </>
              )} */}

            {/* <TaxAndChargesLines
                onChange={(e) => {
                  form.setValue("taxLines", e);
                  form.trigger("taxLines");
                }}
                currency={companyDefaults?.currency || DEFAULT_CURRENCY}
                showTotal={false}
              /> */}
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
