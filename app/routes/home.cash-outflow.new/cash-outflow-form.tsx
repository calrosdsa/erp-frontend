import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents, useOutletContext } from "@remix-run/react";
import { MutableRefObject, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { GlobalState } from "~/types/app-types";
import { CashOutflowDataType } from "~/util/data/schemas/accounting/cash-outflow.schema";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { party } from "~/util/party";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import { DEFAULT_CURRENCY } from "~/constant";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { LineItemType } from "~/util/data/schemas/stock/line-item-schema";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { cn } from "@/lib/utils";
import { useModalNav } from "~/util/hooks/app/use-open-modal";

const cashOutflosTypes = [
  "Compras al contado",
  "Inventario/Mercaderías",
  "Insumos/Materias primas",
  "Gastos menores/Caja chica",
  "Servicios",
];
export default function CashOutflowForm({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
  isNew,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<CashOutflowDataType>;
  onSubmit: (e: CashOutflowDataType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  isNew?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const currency = companyDefaults?.currency || DEFAULT_CURRENCY;
  const { onLines, lines } = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { openModal } = useModalNav();

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
    taxLinesStore.updateFromItems(lines);
  }, [formValues.taxLines, lines]);

  useEffect(() => {
    if (formValues.amount) {
      onLines([
        {
          rate: formValues.amount,
          quantity: 1,
        } as LineItemType,
      ]);
    }
  }, [formValues.amount]);
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="create-grid"
          // className={cn(isNew ? "create-grid" : "detail-grid")}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          {!allowEdit && (
            <>
              <CustomFormDate
                control={form.control}
                name="posting_date"
                label={t("form.postingDate")}
                allowEdit={allowEdit}
              />
              <CustomFormTime
                control={form.control}
                name="posting_time"
                label={t("form.postingTime")}
                allowEdit={allowEdit}
                description={formValues.tz}
              />
            </>
          )}
          <Typography variant="subtitle2" className=" col-span-full">
            Detalles de la entidad
          </Typography>
          <SelectForm
            form={form}
            data={party.cashOutflowOptions}
            allowEdit={allowEdit}
            label={t("form.partyType")}
            keyName={"name"}
            required={true}
            keyValue={"value"}
            name="party_type"
          />

          {formValues.party_type && (
            <div>
              <PartyAutocompleteField
                form={form}
                partyType={formValues.party_type}
                allowEdit={allowEdit}
                roleActions={roleActions}
                openModal={openModal}
              />
            </div>
          )}
          <Typography variant="subtitle2" className=" col-span-full">
            Detalle
          </Typography>
          <CustomFormFieldInput
            control={form.control}
            name="amount"
            required={true}
            onBlur={() => {
              form.trigger("amount");
            }}
            label={"Monto"}
            inputType="input"
            allowEdit={allowEdit}
          />
          <CustomFormFieldInput
            control={form.control}
            name="concept"
            label={"Concepto"}
            inputType="input"
            allowEdit={allowEdit}
          />

          <SelectForm
            control={form.control}
            allowEdit={allowEdit}
            data={cashOutflosTypes.map(
              (t) =>
                ({
                  value: t,
                  name: t,
                } as SelectItem)
            )}
            keyName="name"
            keyValue="value"
            label="Tipo de egreso de caja"
            name={"cash_outflow_type"}
          />

          <TaxAndChargesLines
            onChange={(e) => {
              form.setValue("taxLines", e);
              form.trigger("taxLines");
            }}
            allowEdit={allowEdit}
            form={form}
            currency={currency}
            showTotal={true}
          />

          <GrandTotal currency={currency} />

          <div className="col-span-full" />
          <Typography variant="subtitle2" className=" col-span-full">
            Datos de la Factura
          </Typography>

          <CustomFormFieldInput
            control={form.control}
            name="invoice_no"
            label={"No de factura"}
            inputType="input"
            allowEdit={allowEdit}
          />
          <CustomFormFieldInput
            control={form.control}
            name="nit"
            label={"NIT"}
            inputType="input"
            allowEdit={allowEdit}
          />
          <CustomFormFieldInput
            control={form.control}
            name="auth_code"
            label={"Código de autorización"}
            inputType="input"
            allowEdit={allowEdit}
          />

          <CustomFormFieldInput
            control={form.control}
            name="ctrl_code"
            label={"Código de Control"}
            inputType="input"
            allowEdit={allowEdit}
          />
          <CustomFormDate
            control={form.control}
            name="emision_date"
            label={"Fecha de emisión"}
            allowEdit={allowEdit}
          />
          <AccountingDimensionForm
            form={form}
            allowEdit={allowEdit}
            openModal={openModal}
          />

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
