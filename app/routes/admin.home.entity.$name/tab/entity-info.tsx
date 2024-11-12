import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/custom/table/CustomTable";
import { actionColumns } from "@/components/custom/table/columns/admin/entity-columns";
import { z } from "zod";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import CustomForm from "@/components/custom/form/CustomForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const addEntityActionSchema = z.object({
  name: z.string(),
  entityID: z.number(),
});

export default function EntityInfo() {
  const { entity, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {openDialog && entity != undefined && (
        <AddEntityAction
          open={openDialog}
          onOpenChange={(e) => setOpenDialog(e)}
          entityID={entity.id}
        />
      )}
      <div className=" info-grid">
        <DisplayTextValue title={t("form.name")} value={entity?.name} />

        <div className=" col-span-full">
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Add
          </Button>
          <DataTable data={actions || []} columns={actionColumns()} />
        </div>
      </div>
    </>
  );
}

const AddEntityAction = ({
  open,
  onOpenChange,
  entityID,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  entityID: number;
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
    <DrawerLayout open={open} onOpenChange={onOpenChange} className=" max-w-sm">
      <CustomForm
        defaultValues={{
          entityID: entityID,
        }}
        onSubmit={(e: z.infer<typeof addEntityActionSchema>) => {
          fetcher.submit(
            {
              action: "add-entity-action",
              addEntityAction: e,
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
        schema={addEntityActionSchema}
        fetcher={fetcher}
      />
    </DrawerLayout>
  );
};
