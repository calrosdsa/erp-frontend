import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import { party } from "~/util/party";
import { z } from "zod";
import {
  moduleDataSchema,
  moduleSectionDataSchema,
} from "~/util/data/schemas/core/module-schema";
import TableCellEditable from "../../cells/table-cell-editable";
import { useSearchEntity } from "~/util/hooks/fetchers/core/use-entity-search-fetcher";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Autocomplete } from "@/components/custom/select/autocomplete";
import {
  ModuleAutocomplete,
  useModuleFetcher,
} from "~/util/hooks/fetchers/core/use-module-fetcher";
import { ItemActionSchema, itemActionSchema } from "~/util/data/schemas";

export const moduleColumns = ({}: {}): ColumnDef<
  components["schemas"]["ModuleDto"]
>[] => {
  const r = route;
  const p = party;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "label",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.p.module,
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.uuid,
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
    {
      accessorKey: "priority",
      header: "Prioridad",
    },
  ];
};

export const moduleSelectionColumn = ({
  allowEdit,
}: {
  allowEdit: boolean;
}): ColumnDef<ItemActionSchema>[] => {
  return [
    {
      accessorKey: "name",
      header: "Modulo",
      size: 250,
      cell: ({ ...props }) => {
        const tableMeta: any = props.table.options.meta;
        const [fetcher, onChange] = useModuleFetcher();
        return (
          <>
            <Autocomplete
              defaultValue={props.row.original.name}
              onValueChange={onChange}
              data={fetcher.data?.results || []}
              // isLoading={fetcher.state == "submitting"}
              nameK={"label"}
              placeholder="Buscar o crear un nuevo módulo"
              // isLoading={fetcher.state == "submitting"}
              // className=" border-none h-8"
              // inputClassName=""
              onSelect={(e) => {
                // console.log("SELECTED",e)
                tableMeta?.updateCell(props.row.index, "id", e.id);
                tableMeta?.updateCell(props.row.index, "name", e.label);
                // navigate(r.to(e.href));
              }}
            />
          </>
        );
      },
    },
    {
      id: "actions",
      cell: DataTableRowActions,
      size: 35,
    },
  ];
};

export const moduleSectionColumns = ({}: {}): ColumnDef<
  z.infer<typeof moduleSectionDataSchema>
>[] => {
  return [
    {
      accessorKey: "name",
      header: "Entidad",
      size: 200,
      cell: ({ ...props }) => {
        const tableMeta: any = props.table.options.meta;
        const [entityFetcher, onChangeEntity] = useSearchEntity({
          loadModules: false,
        });
        return (
          <Autocomplete
            onValueChange={onChangeEntity}
            data={entityFetcher.data?.searchEntities || []}
            defaultValue={props.row.original.entity_name}
            // isLoading={fetcher.state == "submitting"}
            nameK={"name"}
            placeholder="Entidad"
            className=" border-none h-8"
            inputClassName=""
            onSelect={(e) => {
              // console.log("SELECTED",e)
              tableMeta?.updateCell(props.row.index, "entity_name", e.name);
              tableMeta?.updateCell(props.row.index, "entity_id", e.id);
              // navigate(r.to(e.href));
            }}
          />
        );
      },
    },
    {
      accessorKey: "section_name",
      header: "Nombre de la sección",
      cell: TableCellEditable,
    },

    {
      id: "actions",
      cell: DataTableRowActions,
      size: 35,
    },
  ];
};
