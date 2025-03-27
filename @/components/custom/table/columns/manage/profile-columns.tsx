import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellText from "../../cells/table-cell-text";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { openUserModal } from "~/routes/home.user.$id/route";
import { TableCellBase } from "../../cells/table-cell";

export const profileColumms = ({
  openModal,
}: {
  openModal: (key: string, value: string) => void;
}): ColumnDef<components["schemas"]["ProfileDto"]>[] => {
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
        <TableCellBase
          className="font-semibold underline cursor-pointer"
          name={name}
          onClick={() => openUserModal(row.original.id.toString(), openModal)}
          {...props}
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
