import { ColumnDef } from "@tanstack/react-table"
import { components } from "~/sdk"

export const itemGroupColumns: ColumnDef<components["schemas"]["ItemGroup"]>[] = [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "CreatedAt",
    header: "Fecha de Creacion",
  },
]