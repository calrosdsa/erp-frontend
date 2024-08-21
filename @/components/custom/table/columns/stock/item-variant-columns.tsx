import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";

export const itemVariantColumns = (): ColumnDef<
  components["schemas"]["ItemVariant"]
>[] => {
  const { t } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("form.code"),
      accessorKey: "Item.Code",
      cell: ({ row }) => {
        const code = row.getValue("Code") as string;
        return (
          <Link to={r.toItemDetail(code)} className="underline">
            {code}
          </Link>
        );
      },
    },
    {
      header: t("form.name"),
      accessorKey: "Item.Name",
    },
  ];
};
