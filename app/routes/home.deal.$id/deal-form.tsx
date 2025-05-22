import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import { DealData } from "~/util/data/schemas/crm/deal-schema";
import { CurrencySmartAutocomplete } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { dealTypes } from "~/data";
import { StageSmartAutocomplete } from "~/util/hooks/fetchers/crm/use-stage.fetcher";
import { Entity } from "~/types/enums";
import { PartyContacts } from "../home.party/components/party-contacts";
import Participants from "./components/observers";
import { components } from "~/sdk";
import { ProfileSmartField } from "~/util/hooks/fetchers/profile/profile-fetcher";
import { SmartField } from "@/components/form/smart-field";
import { useFormContext } from "@/components/form/form-provider";
import { CustomerSmartAutocomplete } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";

export default function DealForm({
  contacts,
  allowEdit,
  observers,
  keyPayload,
}: {
  contacts: components["schemas"]["ContactDto"][];
  observers: components["schemas"]["ProfileDto"][];
  allowEdit: boolean;
  keyPayload: string;
}) {
  const { t } = useTranslation("common");
  const { form } = useFormContext();
  const formValues = form?.getValues() as DealData;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SmartField name="name" label={t("form.name")} required />
        <SmartField name="amount" label={t("form.amount")} required />

        <SmartField
          type="date"
          name="start_date"
          label={t("form.startDate")}
          required
        />
        <SmartField type="date" name="end_data" label={t("form.endDate")} />

        <StageSmartAutocomplete entityID={Entity.DEAL} required={true} />
        <CurrencySmartAutocomplete
          required={true}
        />

        <Typography variant="subtitle2" className=" col-span-full">
          Mas
        </Typography>

        <CustomerSmartAutocomplete />

        <SmartField
          name="deal_type"
          label="Tipo de acuerdo"
          type="select"
          options={dealTypes}
        />

        <SmartField name="source" label={"Fuente"} />
        <SmartField
          name="source_information"
          label={"Información de fuente"}
          type="textarea"
          className=" col-span-full"
        />
        <ProfileSmartField
          name="responsible"
          label="Responsable"
          required={true}
        />

        {form && (
          <PartyContacts
            className=" col-span-full"
            partyID={formValues.id}
            contacts={contacts}
            // perm={permissions[Entity.CONTACT]}
          />
        )}

        <Participants
          className=" col-span-full"
          allowEdit={allowEdit}
          observers={observers}
        />
      </div>

      {/* <FormLayout>
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit((e) => {
              onSubmit(e);
              setEnableEdit(false);
            })}
            className={" grid p-2 gap-3"}
          >
            <div className=" border rounded-lg p-2 grid gap-2">
              <div className="flex justify-between items-center">
                <Typography variant="subtitle2" className=" col-span-full">
                  Acerca del acuerdo
                </Typography>
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
              </div>
              <Separator />

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

                  <ProfileAutoCompleteFormField
                    control={form.control}
                    name="responsible"
                    label="Responsable"
                    allowEdit={enableEdit}
                  />
                </div>
              </div>
            </div>

            <PartyContacts
              fieldArray={fieldArray as any}
              form={form}
              partyID={formValues.id}
              contacts={contacts}
              enableEdit={enableEdit}
              setEnableEdit={setEnableEdit}
              allowEdit={allowEdit}
              // perm={permissions[Entity.CONTACT]}
            />

            <Participants
              form={form}
              allowEdit={allowEdit}
              enableEdit={enableEdit}
              setEnableEdit={setEnableEdit}
              observers={observers}
            />

            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout> */}
    </>
  );
}
