import CustomForm from "@/components/custom/form/CustomForm";
import {
  roleActionColumns,
  roleEntitiesActionColumns,
} from "@/components/custom/table/columns/user/role-columns";
import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
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
  roleActions?: components["schemas"]["RoleActionDto"][];
  entityActions?: components["schemas"]["EntityActionsDto"];
  role?: components["schemas"]["RoleDto"];
}) => {
  const { t } = useTranslation("common");
  const [selected, setSelected] = useState<
    z.infer<typeof roleActionSelected>[]
  >(
    entityActions?.actions.map((item) => {
      return {
        actionId: item.id,
        actionName: item.name,
        selected:
          roleActions?.map((t) => t.action_id).includes(item.id) || false,
      };
    }) || []
  );
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const { setAll } = useTableSelectionStore();

  const onSubmit = () => {
    if (!role) return;
    if (!entityActions) return;
    const actions = selected.map((t) => t.actionId);
    const n = entityActions.actions.filter((t) => !actions.includes(t.id));
    const body: components["schemas"]["EditRolePermissionActionsBody"] = {
      actionSelecteds: selected,
      role_uuid: role.uuid,
      entityName: entityActions.entity.name,
      entity_actions: {
        actions: n,
        entity: entityActions.entity,
      },
    };
    // console.log(body)
    fetcher.submit(
      {
        action: "update-role-actions",
        updateRoleActions: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    let selecteds: string[] = [];
    entityActions?.actions.map((item, idx) => {
      const selected =
        roleActions?.map((t) => t.action_id).includes(item.id) || false;
      if (selected) {
        selecteds.push(idx.toString());
      }
    });
    setAll(selecteds);
  }, []);

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      onOpenChange(false);
    }
  }, [fetcher.data]);

  return (
    <DrawerLayout
      title={t("f.edit", { o: t("_role.base") })}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="grid gap-y-4">
        <DataTable
          data={entityActions?.actions || []}
          enableRowSelection={true}
          onSelectionChange={(e) => {
            const n = e.map((t) => {
              const d: z.infer<typeof roleActionSelected> = {
                selected: true,
                actionId: t.id,
                actionName: t.name,
              };
              return d;
            });
            setSelected(n);
          }}
          columns={roleActionColumns({
            // selected: selected,
            // setSelected: (e) => setSelected(e),
          })}
        />
        <Button
          onClick={() => onSubmit()}
          loading={fetcher.state == "submitting"}
        >
          {t("form.submit")}
        </Button>
      </div>
    </DrawerLayout>
  );
};

interface EditRolePermissionStore {
  entityActions?: components["schemas"]["EntityActionsDto"] | undefined;
  roleActions: components["schemas"]["RoleActionDto"][];
  role: components["schemas"]["RoleDto"] | undefined;
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {
    roleActions: components["schemas"]["RoleActionDto"][];
    entityActions?: components["schemas"]["EntityActionsDto"];
    role: components["schemas"]["RoleDto"] | undefined;
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
