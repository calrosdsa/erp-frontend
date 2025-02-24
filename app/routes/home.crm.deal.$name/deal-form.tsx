import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents, useOutletContext } from "@remix-run/react";
import { MutableRefObject, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { DEFAULT_CURRENCY } from "~/constant";
import { DealData } from "~/util/data/schemas/crm/deal.schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { dealTypes } from "~/data";
import { StageFormField } from "~/util/hooks/fetchers/crm/use-stage.fetcher";
import { Entity } from "~/types/enums";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { PartyContacts } from "../home.party/components/party-contacts";

export default function DealForm({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit,
  enableEdit,
  setEnableEdit,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<DealData>;
  onSubmit: (e: DealData) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  enableEdit?: boolean;
  setEnableEdit: (e: boolean) => void;
}) {
  const { t } = useTranslation("common");
  const fieldArray = useFieldArray({
    control: form.control,
    name: "contacts",
  });
  const formValues = form.getValues();
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit((e) => {
            onSubmit(e);
            setEnableEdit(false);
          })}
          className={" grid border rounded-lg p-2"}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          {/* {JSON.stringify(formValues)} */}
          <div className="">

              <div className=" grid gap-2">
                <div className="flex justify-between items-center">
                  <Typography variant="subtitle2" className=" col-span-full">
                    Acerca del acuerdo
                  </Typography>
                  {/* {enableEdit ? (
                    <div className="flex space-x-1">
                      <Button variant="outline" type="submit" size="xs">
                        <span>Guardar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                          setEnableEdit(false);
                        }}
                      >
                        <span>Cancelar</span>
                      </Button>
                    </div>
                  ) : ( */}
                  {allowEdit && (
                    <Button
                      variant="ghost"
                      type="button"
                      size="xs"
                      onClick={() => setEnableEdit(true)}
                    >
                      <PencilIcon />
                      <span>Editar</span>
                    </Button>
                  )}
                  {/* )} */}
                </div>
                <Separator />

                {/* {enableEdit &&
                  <>
                  </>
                } */}
                
                <div className="">
                <div className="grid sm:grid-cols-2 gap-3">
                  <CustomFormFieldInput
                    control={form.control}
                    name="name"
                    required
                    label={t("form.name")}
                    inputType="input"
                    allowEdit={enableEdit}
                  />

                  <StageFormField
                    modal={true}
                    control={form.control}
                    allowEdit={enableEdit}
                    label="Etapa"
                    required
                    entityID={Entity.DEAL}
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="amount"
                    required
                    label={"Monto"}
                    inputType="input"
                    allowEdit={enableEdit}
                  />

                  <CurrencyAutocompleteForm
                    control={form.control}
                    modal={true}
                    label={t("form.currency")}
                    allowEdit={enableEdit}
                  />
                  <CustomFormDate
                    control={form.control}
                    name="start_date"
                    label={t("form.startDate")}
                    allowEdit={enableEdit}
                  />
                  <CustomFormDate
                    control={form.control}
                    name="end_date"
                    label={t("form.endDate")}
                    allowEdit={enableEdit}
                  />
                </div>

                <div className=" col-start-1 py-3 grid gap-2">
                  <Typography variant="subtitle2" className=" col-span-full">
                    Mas
                  </Typography>

                  <SelectForm
                    control={form.control}
                    data={dealTypes}
                    keyName="name"
                    keyValue="value"
                    allowEdit={enableEdit}
                    label="Tipo de acuerdo"
                    name={"deal_type"}
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="source"
                    label={"Fuente"}
                    inputType="input"
                    allowEdit={enableEdit}
                  />

                  <CustomFormFieldInput
                    control={form.control}
                    name="source_information"
                    label={"Información de fuente"}
                    inputType="textarea"
                    allowEdit={enableEdit}
                  />
                </div>
                </div>



            </div>

            <PartyContacts
              fieldArray={fieldArray as any}
              form={form}
              partyID={formValues.id}
              contacts={formValues.contacts}
              enableEdit={enableEdit}
              setEnableEdit={setEnableEdit}
              // perm={permissions[Entity.CONTACT]}
            />

            {/* <div className="col-span-full" />
            <Typography variant="subtitle2" className=" col-span-full">
              Datos de la Factura
            </Typography>

            <CustomFormFieldInput
              control={form.control}
              name="invoice_no"
              label={"No de factura"}
              inputType="input"
              allowEdit={enableEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="nit"
              label={"NIT"}
              inputType="input"
              allowEdit={enableEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="auth_code"
              label={"Código de autorización"}
              inputType="input"
              allowEdit={enableEdit}
            />

            <CustomFormFieldInput
              control={form.control}
              name="ctrl_code"
              label={"Código de Control"}
              inputType="input"
              allowEdit={enableEdit}
            />
            <CustomFormDate
              control={form.control}
              name="emision_date"
              label={"Fecha de emisión"}
              allowEdit={enableEdit}
            /> */}
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
