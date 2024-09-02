import ButtonExpandRow from "@/components/custom/button/ButtonExpandRow";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { components } from "index";

export const columns = (): ColumnDef<components["schemas"]["Company"]>[] => {
  const { t } = useTranslation("common");
  return [
   
    {
      header: "Name",
      accessorKey: "Name",
      cell: ({ row, getValue }) => {
        const code = row.getValue("code") as string;

        return (
          <div className="flex space-x-2 items-center ">
            <div>
              {row.getCanExpand() ? (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? (
                    <FolderOpenIcon size={18} strokeWidth={"1.2"} />
                  ) : (
                    <FolderIcon size={18} strokeWidth={"1.2"} />
                  )}
                </Button>
              ) : (
                <CornerDownRight
                  size={18}
                  className="mx-3"
                  strokeWidth={"1.2"}
                />
              )}
            </div>
            <div>
              <Link
                to={`./${encodeURIComponent(code)}`}
                className="underline font-semibold"
              >
                {getValue<boolean>()}
              </Link>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "Code",
      id:"code",
      header:t("table.code"),
    },
    {
      accessorKey: "CreatedAt",
      header: "Fecha de Creacion",
    },
  ];
};
