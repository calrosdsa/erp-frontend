import CustomForm from "@/components/custom/form/CustomForm";
import { roleActionColumns, roleEntitiesActionColumns } from "@/components/custom/table/columns/user/role-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { create } from "zustand";
import { components } from "index";

export const EditRolePermission = ({
  open,
  onOpenChange,
  roleActions,
  entityActions,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  roleActions?: components["schemas"]["RoleActions"][];
  entityActions?: components["schemas"]["EntityActions"];
}) => {
  const { t } = useTranslation("common");

  return (
    <DrawerLayout
      title={t("f.edit", { o: t("_role.base") })}
      open={open}
      onOpenChange={onOpenChange}
    >
        <div className="grid gap-y-4">
        <DataTable
        data={entityActions?.actions || []}
        columns={roleActionColumns({roleActions:roleActions || []})}
        />
        <Button>
            {t("form.submit")}
        </Button>
        </div>

    </DrawerLayout>
  );
};

interface EditRolePermissionStore {
  entityActions?: components["schemas"]["EntityActions"] | undefined;
  roleActions: components["schemas"]["RoleActions"][];
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts:{
    roleActions: components["schemas"]["RoleActions"][],
    entityActions?: components["schemas"]["EntityActions"]
  }) => void;
}
export const useEditRolePermission = create<EditRolePermissionStore>((set) => ({
  entityActions: undefined,
  roleActions: [],
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog:(opts)=>set((state)=>({open:true,roleActions:opts.roleActions,entityActions:opts.entityActions}))
}));
