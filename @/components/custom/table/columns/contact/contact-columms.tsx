import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellDate from "../../cells/table-cell-date";
import { fullName } from "~/util/convertor/convertor";
import TableCellIndex from "../../cells/table-cell-index";

export const contactColumns = (): ColumnDef<
  components["schemas"]["ContactDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "given_name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        const name = fullName(rowData.given_name, rowData.family_name);
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) => r.toContactDetail(name, rowData.uuid)}
          />
        );
      },
    },
    {
      accessorKey: "email",
      header: t("form.email"),
    },
    {
      accessorKey: "phone_number",
      header: t("form.phoneNumber"),
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
    },
  ];
};
