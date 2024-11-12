import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { companyColumns } from "../home.companies_/components/table/columns";
import { aCompanyColumns } from "@/components/custom/table/columns/admin/a-company-columns";
import { z } from "zod";
import DetailLayout from "@/components/layout/detail-layout";
import CustomForm from "@/components/custom/form/CustomForm";
import { useTranslation } from "react-i18next";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useState } from "react";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export const createCompanySchema = z.object({
  name: z.string(),
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
            }
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
      />
    </DrawerLayout>
  );
};
