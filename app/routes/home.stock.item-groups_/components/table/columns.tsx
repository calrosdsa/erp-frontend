// import { ColumnDef } from "@tanstack/react-table"
// import { components } from "~/sdk"

// export const itemGroupColumns: ColumnDef<components["schemas"]["ItemGroup"]>[] = [

//   {
//     accessorKey: "Name",
//     header: "Name",
//   },
//   {
//     accessorKey: "CreatedAt",
//     header: "Fecha de Creacion",
//   },
// ]


import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "index";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";

export const itemGroupColumns = (): ColumnDef<components["schemas"]["ItemGroup"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route
  return [
    {
      accessorKey: "Code",
      header: t("form.code"),
      cell:({row})=>{
        const code = row.getValue("Code") as string;
        return (
          <div className=" uppercase">
            <Link to={r.toItemGroupDetail(code)}>
            <Typography className=" text-primary underline cursor-pointer">
            {code}
            </Typography>
            </Link>
          </div>
        )
      }
    },
    {
    accessorKey: "Name",
    header: t("form.name"),
  },
  {
      accessorKey: "CreatedAt",
      header: t("table.createdAt"),
      cell: ({ row }) => {
        const date = row.getValue("CreatedAt");
        const longDate = formatLongDate(date as string,i18n.language)
        return (
          <div className="">
            {longDate}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "Code",
    //   header: t("table.Code"),
    //   cell:({row})=>{
    //     const code = row.getValue("Code") as string;
    //     return (
    //       <div className=" uppercase">
    //         <Link to={`/home/purchases/orders/${encodeURIComponent(code)}`}>
    //         <Typography className=" text-primary underline cursor-pointer">
    //         {code}
    //         </Typography>
    //         </Link>
    //       </div>
    //     )
    //   }
    // },
    // {
    //   accessorKey: "OrderType",
    //   header: t("table.type"),
    // },
    // {
    //   accessorKey: "CreatedAt",
    //   header: t("table.createdAt"),
    //   cell: ({ row }) => {
    //     const date = row.getValue("CreatedAt");
    //     const longDate = formatLongDate(date as string,i18n.language)
    //     return (
    //       <div className="">
    //         {longDate}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "DeliveryDate",
    //   header: t("table.deliverdDate"),
    //   cell: ({ row }) => {
    //     const date = row.getValue("DeliveryDate");
    //     const longDate = formatLongDate(date as string,i18n.language)
    //     return (
    //       <div className="">
    //         {longDate}
    //       </div>
    //     );
    //   },
    // },
  ];
};
