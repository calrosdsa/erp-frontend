import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellText from "../../cells/table-cell-text";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const profileColumms = ({}): ColumnDef<
  components["schemas"]["ProfileL"]
>[] => {
  let columns: ColumnDef<components["schemas"]["ProfileL"]>[] = [];
  const { t, i18n } = useTranslation("common");
  const r = route;
  columns.push({
    id: "fullName",
    header: t("form.fullName"),
    cell: ({ ...props }) => {
      const row = props.row;
      const givenName = row.original.givenName;
      const familyName = row.original.familyName;
      const name = fullName(givenName, familyName);
      const uuid = row.original.uuid;
      return (
        <TableCellNameNavigation
          {...props}
          name={name}
          navigate={() => r.toUserProfileDetail(name, uuid)}
        />
      );
    },
  });
  columns.push({
    accessorKey: "givenName",
    id: "givenName",
    header: t("form.givenName"),
  });
  columns.push({
    accessorKey: "familyName",
    id: "familyName",
    header: t("form.familyName"),
  });

  columns.push({
    accessorKey: "partyName",
    header: t("form.type"),
  });
  columns.push({
    accessorKey: "emailAddress",
    header: t("form.email"),
    id: "email",
  });
  return columns;
};
