import CustomForm from "@/components/custom/form/CustomForm";
import {
  roleActionColumns,
  roleEntitiesActionColumns,
} from "@/components/custom/table/columns/user/role-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import { useEffect, useState } from "react";
import {
  roleActionSelected,
  updateRoleActionsSchema,
} from "~/util/data/schemas/manage/role-schema";
import { z } from "zod";
import { components } from "~/sdk";
import { useFetcher } from "@remix-run/react";
import { useToast } from "@/components/ui/use-toast";
import { action } from "../route";

export const EditRolePermission = ({
  open,
  onOpenChange,
  roleActions,
  entityActions,
  role,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  roleActions?: components["schemas"]["RoleActions"][];
  entityActions?: components["schemas"]["EntityActions"];
  role?: components["schemas"]["Role"];
}) => {
  const { t } = useTranslation("common");
  const [selected, setSelected] = useState<
    z.infer<typeof roleActionSelected>[]
  >(
    entityActions?.actions.map((item) => {
      return {
        actionId: item.ID,
        actionName:item.Name,
        selected:
          roleActions?.map((t) => t.ActionID).includes(item.ID) || false,
      };
    }) || []
  );
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();

  const onSubmit = () => {
    if (!role) return;
    if (!entityActions) return;
    const body: z.infer<typeof updateRoleActionsSchema> = {
      actionSelecteds: selected,
      roleId: role.ID,
      entityName:entityActions.entity.Name,
    };
    console.log(body)
    fetcher.submit({
      action:"update-role-actions",
      updateRoleActions:body
    },{
      method:"POST",
      encType:"application/json"
    })
  };

  useEffect(()=>{
    if(fetcher.data?.error){
      toast({
        title:fetcher.data.error
      })
    }
    if(fetcher.data?.message){
      toast({
        title:fetcher.data.message
      })
      onOpenChange(false)
    }
  },[fetcher.data])

  return (
    <DrawerLayout
      title={t("f.edit", { o: t("_role.base") })}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="grid gap-y-4">
        <DataTable
          data={entityActions?.actions || []}
          columns={roleActionColumns({
            selected: selected,
            setSelected: (e) => setSelected(e),
          })}
        />
        <Button
        onClick={()=>onSubmit()}
        loading={fetcher.state == "submitting"}
        >{t("form.submit")}</Button>
      </div>
    </DrawerLayout>
  );
};

interface EditRolePermissionStore {
  entityActions?: components["schemas"]["EntityActions"] | undefined;
  roleActions: components["schemas"]["RoleActions"][];
  role: components["schemas"]["Role"] | undefined;
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {
    roleActions: components["schemas"]["RoleActions"][];
    entityActions?: components["schemas"]["EntityActions"];
    role: components["schemas"]["Role"] | undefined;
  }) => void;
}
export const useEditRolePermission = create<EditRolePermissionStore>((set) => ({
  entityActions: undefined,
  role: undefined,
  roleActions: [],
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog: (opts) =>
    set((state) => ({
      open: true,
      roleActions: opts.roleActions,
      entityActions: opts.entityActions,
      role: opts.role,
    })),
}));
