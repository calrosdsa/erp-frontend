import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import i18n from "~/i18n";
import TableCellNavigate from "../../cells/table-cell-navigate";
import { routes } from "~/util/route";
import TableCellEntityActions from "../../cells/table-cell-entity-actions";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { z } from "zod";
import { roleActionSelected } from "~/util/data/schemas/manage/role-schema";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const roleEntitiesActionColumns = ({
  roleActions,
}: {
  roleActions: components["schemas"]["RoleActionDto"][];
}): ColumnDef<components["schemas"]["EntityActionsDto"]>[] => {
  let roleActionsIds = roleActions.map((item) => item.action_id);
  let columns: ColumnDef<components["schemas"]["EntityActionsDto"]>[] = [];
  const r = routes;
  const { t } = useTranslation("common");
  columns.push({
    accessorKey: "entity.name",
    header: t("entity"),
    id: "entityName",
  });
  columns.push({
    accessorKey: "actions",
    header: t("action"),
    cell: ({ ...props }) => (
      <TableCellEntityActions {...props} roleActions={roleActionsIds} />
    ),
  });
  columns.push({
    id: "actions-row",
    cell: DataTableRowActions,
  });
  return [...columns];
};

export const roleActionColumns = ({
  selected,
  setSelected,
}: {
  selected: z.infer<typeof roleActionSelected>[];
  setSelected: (e: z.infer<typeof roleActionSelected>[]) => void;
}): ColumnDef<components["schemas"]["ActionDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["ActionDto"]>[] = [];

  const r = routes;
  const { t } = useTranslation("common");

  columns.push({
    accessorKey: "name",
    header: t("action"),
  });
  columns.push({
    id: "select",
    cell: ({ row }) => {
      const rowData = row.original
      return (
        <Checkbox
          checked={selected.find((t) => t.actionId == rowData.id)?.selected}
          onCheckedChange={(value) => {
            const n = selected.map((t) => {
              if (t.actionId == rowData.id) {
                if (typeof value == "boolean") {
                  t.selected = value;
                }
              }
              return t;
            });
            setSelected(n);
          }}
          aria-label="Select row"
        />
      );
    },
  });
  return [...columns];
};

export const roleDefinitionColumns = ({}): ColumnDef<
  components["schemas"]["RoleActionDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["RoleActionDto"]>[] = [];
  const r = routes;
  const { t } = useTranslation("common");
  columns.push({
    accessorKey: "Action.Entity.Name",
    header: t("entity"),
    id: "entityName",
  });

  columns.push({
    accessorKey: "Action.Name",
    header: t("action"),
    id: "actionName",
  });
  return [...columns];
};

export const roleColumns = ({}): ColumnDef<
  components["schemas"]["RoleDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["RoleDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "code",
    header: t("_role.base"),
    cell: ({ ...props }) => {
        const original = props.row.original
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) => r.toRoleDetail(name, original.uuid)}
        />
      );
    },
  });

  columns.push({
    accessorKey: "description",
  });
  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
  });
  return [...columns];
};
