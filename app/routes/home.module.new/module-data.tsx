import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import AutocompleteI from "@/components/custom/select/autocomplete-select";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { moduleSectionColumns } from "@/components/custom/table/columns/core/module-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents } from "@remix-run/react";
import { ContactIcon, CreditCard } from "lucide-react";
import { MutableRefObject } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import icons from "~/data/icons";
import {
  moduleDataSchema,
  ModuleDataType,
  ModuleSectionDataType,
} from "~/util/data/schemas/core/module-schema";
import { useSearchEntity } from "~/util/hooks/fetchers/core/use-entity-search-fetcher";
import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";
import useTableRowActions from "~/util/hooks/useTableRowActions";

export default function ModuleData({
  fetcher,
  onSubmit,
  inputRef,
  form,
  allowEdit,
  allowCreate,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<ModuleDataType>;
  onSubmit: (e: ModuleDataType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  allowCreate?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: form.control,
    name: "sections",
  });
  const [entityFetcher, onEntityChange] = useSearchEntity({
    loadModules: false,
  });
  const { update } = arrayFields;

  const updateCell = (row: number, column: string, value: string) => {
    let section = formValues.sections[row] as any;
    if (section) {
      section[column as keyof any] = value;
      // form.setValue(`sections.${row}`,section)
      update(row, section);
    }
  };
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
            <CustomFormFieldInput
              control={form.control}
              name="label"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
              required={true}
            />
              <CustomFormFieldInput
              control={form.control}
              name="priority"
              label={"Prioridad"}
              inputType="input"
              allowEdit={allowEdit}
              description="Número de orden para los módulos en el sidebar"
              required={true}
            />

            <FormAutocomplete
              control={form.control}
              data={icons}
              nameK={"name"}
              name={"icon_name"}
              label="Icon"
              onSelect={(e) => {
                form.setValue("icon_code", e.value);
              }}
              allowEdit={allowEdit}
              onCustomDisplay={(e) => {
                return (
                  <div
                    key={e.value}
                    className=" flex space-x-3 items-center p-1"
                  >
                    <e.icon className=" h-5 w-5" />
                    <span>{e.name}</span>
                  </div>
                );
              }}
            />

            <CustomFormFieldInput
              control={form.control}
              name="has_direct_access"
              label={"Acceso directo"}
              inputType="check"
              allowEdit={allowEdit}
              required={true}
            />
            {formValues.has_direct_access ? (
              <div className="col-start-1">
                <FormAutocomplete
                  control={form.control}
                  data={entityFetcher.data?.searchEntities || []}
                  onValueChange={onEntityChange}
                  name={"href"}
                  label={"Acceso directo"}
                  allowEdit={allowEdit}
                  nameK={"name"}
                  description="La ruta a la que se redirecionara"
                  onSelect={(e) => {
                    form.setValue("href", e.href);
                  }}
                />
              </div>
            ) : (
              <div className="col-span-full">
                <DataTable
                  data={formValues.sections}
                  columns={moduleSectionColumns({})}
                  metaOptions={{
                    meta: {
                      ...metaOptions,
                      ...(allowEdit && {
                        updateCell: updateCell,
                      }),
                    },
                  }}
                />
              </div>
            )}
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
