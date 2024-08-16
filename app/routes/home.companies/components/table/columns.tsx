import ButtonExpandRow from "@/components/custom/button/ButtonExpandRow";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import { components } from "~/sdk";

export const columns = (): ColumnDef<components["schemas"]["Company"]>[] => {
  return [
    {
      header: "Name",
      accessorKey: "Name",
      cell: ({ row, getValue }) => (
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
              <CornerDownRight size={18} className="mx-3" strokeWidth={"1.2"} />
            )}
          </div>
          <div>{getValue<boolean>()}</div>
        </div>
      ),
    },
    {
      accessorKey: "CreatedAt",
      header: "Fecha de Creacion",
    },
  ];
};
