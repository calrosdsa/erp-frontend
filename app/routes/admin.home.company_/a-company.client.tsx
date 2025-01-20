import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { aCompanyColumns } from "@/components/custom/table/columns/admin/a-company-columns";
import { z } from "zod";
import CustomForm from "@/components/custom/form/CustomForm";
import { useTranslation } from "react-i18next";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useState } from "react";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { modules } from "~/data/modules";
import { MultiSelect } from "@/components/custom/select/MultiSelect";


export const module = z.object({
  label:z.string(),
  name:z.string(),
  icon_name:z.string(),
  icon_code:z.string(),
  priority:z.number(),
})

export const createCompanySchema = z.object({
  name: z.string(),
  modules:z.array(module)
});

export default function ACompanyClient() {
  const { paginationResult } = useLoaderData<typeof loader>();
  const [openDialog, setOpenDialog] = useState(false);
  setUpToolbar(() => {
    return {
      addNew: () => {
        setOpenDialog(true);
      },
    };
  }, []);
  return (
    <>
      {openDialog && (
        <CreateCompany
          open={openDialog}
          onOpenChange={(e) => setOpenDialog(e)}
        />
      )}
      <DataTable
        data={paginationResult?.results || []}
        columns={aCompanyColumns()}
        enableSizeSelection={true}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
      />
    </>
  );
}

const CreateCompany = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onShowMessage: () => {
        onOpenChange(false);
      },
    },
    [fetcher.data]
  );
  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange}
    className=" max-w-sm">
      <CustomForm
        onSubmit={(e) => {
          fetcher.submit(
            {
              action: "create-company",
              createCompany: e,
            },
            {
              method: "POST",
              encType: "application/json",
            },

          );
        }}
        formItemsData={[
          {
            name: "name",
            label: t("form.name"),
            typeForm: "input",
          },
        ]}
        schema={createCompanySchema}
        fetcher={fetcher}
        renderCustomInputs={(form)=>{
          return (
            <>
            <MultiSelect
                data={modules} 
                keyValue={"name"} 
                keyName={"label"} 
                name={""} 
                label="Modulos"
                form={form} 
                onSelect={(e)=>{
                  console.log("MODULES",e)
                  form.setValue("modules",e)
                }}/>
            </>
          )
        }}
      />
    </DrawerLayout>
  );
};
