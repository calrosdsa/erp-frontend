import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import { parties } from "~/util/party";
import { z } from "zod";
import { moduleSectionDataSchema } from "~/util/data/schemas/core/module-schema";
import TableCellEditable from "../../cells/table-cell-editable";
import Autocomplete from "@/components/custom/select/Autocomplete";
import { useSearchEntity } from "~/util/hooks/fetchers/core/use-entity-search-fetcher";

export const moduleColumns = ({}: {}): ColumnDef<
  components["schemas"]["ModuleDto"]
>[] => {
  const r = routes;
  const p = parties;
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
  ];
};

export const moduleSectionColumns = ({}: {}): ColumnDef<
  z.infer<typeof moduleSectionDataSchema>
>[] => {
  const r = routes;
  const p = parties;
  const { t, i18n } = useTranslation("common");
 
  return [
    {
      accessorKey: "name",
      header: "Entidad",
      cell: ({ ...props }) => {
        const tableMeta: any = props.table.options.meta;
        const [entityFetcher, onChangeEntity] = useSearchEntity({
          loadModules: false,
        });
        return (
          <Autocomplete
            onValueChange={onChangeEntity}
            data={entityFetcher.data?.searchEntities || []}
            // isLoading={fetcher.state == "submitting"}
            nameK={"name"}
            placeholder="Entidad"
            className=" border-none h-8"
            inputClassName=""
            onSelect={(e) => {
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
  ];
};
