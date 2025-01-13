import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { moduleSectionColumns } from "@/components/custom/table/columns/core/module-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents } from "@remix-run/react";
import { MutableRefObject } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  moduleDataSchema,
  ModuleDataType,
  ModuleSectionDataType,
} from "~/util/data/schemas/core/module-schema";
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
  const {fields,append,update} = useFieldArray({
    control:form.control,
    name:"sections"
  })
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
        append({
            name:"",
            entity_id:0,
            entity_name:"",
            module_id:formValues.id || 0,
        })
    },
  });

  const updateCell= (row:number,column:string,value:string) =>{
    console.log("UPDATE ROW",column,value)
    let section = formValues.sections[row] as any
    console.log("Section",section)
    if(section){
        section[column as keyof any] = value
        update(row,section)
    }
    
  }
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          {JSON.stringify(fields)}

          <div className="create-grid">
            <CustomFormFieldInput
              control={form.control}
              name="label"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
            />
            <div className="col-span-full">
              <DataTable
                data={fields}
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
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
