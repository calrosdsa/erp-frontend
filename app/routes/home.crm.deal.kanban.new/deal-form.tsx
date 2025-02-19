import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents, useOutletContext } from "@remix-run/react";
import { MutableRefObject, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { DEFAULT_CURRENCY } from "~/constant";
import { DealData } from "~/util/data/schemas/crm/deal.schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { dealTypes } from "~/data";
import { StageFormField } from "~/util/hooks/fetchers/crm/use-stage.fetcher";
import { Entity } from "~/types/enums";


export default function DealForm({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<DealData>;
  onSubmit: (e: DealData) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid "}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          <div className="grid grid-cols-2">
            {/* <CustomFormDate
              control={form.control}
              name="posting_date"
              label={t("form.postingDate")}
              allowEdit={allowEdit}
            />

            <Typography variant="subtitle2" className=" col-span-full">
              Detalles de la entidad
            </Typography> */}
            <div className="grid gap-2">
            <div className=" border p-3 rounded-lg grid gap-2">
              <Typography variant="subtitle2" className=" col-span-full">
                Acerca del acuerdo
              </Typography>
              <CustomFormFieldInput
                control={form.control}
                name="name"
                required
                label={t("form.name")}
                inputType="input"
                allowEdit={allowEdit}
              />

              <StageFormField
              control={form.control}
              allowEdit={allowEdit}
              label="Etapa"
              required
              entityID={Entity.DEAL}
              />

              <CustomFormFieldInput
                control={form.control}
                name="amount"
                required
                onBlur={() => {
                  form.trigger("amount");
                }}
                label={"Monto"}
                inputType="input"
                allowEdit={allowEdit}
                />

                <CurrencyAutocompleteForm
                control={form.control}
                label={t("form.currency")}
                allowEdit={allowEdit}
                />
              <CustomFormDate
                control={form.control}
                name="start_date"
                label={t("form.startDate")}
                allowEdit={allowEdit}
              />
              <CustomFormDate
                control={form.control}
                name="end_date"
                label={t("form.endDate")}
                allowEdit={allowEdit}
              />
            </div>

            <div className=" col-start-1 border p-3 rounded-lg grid gap-2">
              <Typography variant="subtitle2" className=" col-span-full">
                Mas 
              </Typography>

              <SelectForm
                control={form.control}
                data={dealTypes}
                keyName="name"
                keyValue="value"
                label="Tipo de acuerdo"
                name={"deal_type"}
              />
              <CustomFormFieldInput
                control={form.control}
                name="source"
                required
                label={"Fuente"}
                inputType="input"
                allowEdit={allowEdit}
              />

              <CustomFormFieldInput
                control={form.control}
                name="source_information"
                required
                label={"Información de fuente"}
                inputType="textarea"
                allowEdit={allowEdit}
                />
            </div>

            </div>


            

            {/* <div className="col-span-full" />
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
            /> */}
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
