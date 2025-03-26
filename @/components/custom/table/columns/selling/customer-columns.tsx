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
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { TableCellBase } from "../../cells/table-cell";
import { openCustomerModal } from "~/routes/home.customer.$id/route";

export const customerColumns = ({
  openModal,
}: {
  openModal: (key: string, value: string) => void;
}): ColumnDef<
  components["schemas"]["CustomerDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellBase
            className="font-semibold underline cursor-pointer"
            {...props}
            onClick={() =>
                openCustomerModal(rowData.id.toString(), openModal)
            }
          />
        )
      },
    },
    {
      accessorKey: "customer_type",
      header: t("form.type"),
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => {
        return <TableCellDate {...props} i18n={i18n} />;
      },
    },
  ];
};
