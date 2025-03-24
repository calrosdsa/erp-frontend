import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellText from "../../cells/table-cell-text";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const profileColumms = ({}): ColumnDef<
  components["schemas"]["ProfileDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["ProfileDto"]>[] = [];
  const { t, i18n } = useTranslation("common");
  const r = route;
  columns.push({
    id: "fullName",
    header: t("form.fullName"),
    cell: ({ ...props }) => {
      const row = props.row;
      const givenName = row.original.given_name;
      const familyName = row.original.family_name;
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
    accessorKey: "email",
    header: t("form.email"),
  });
  columns.push({
    accessorKey: "phone_number",
    header: t("form.phoneNumber"),
  });
  return columns;
};
