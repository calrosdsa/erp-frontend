import { ColumnDef } from "@tanstack/react-table"
import { components } from "~/sdk"

export const columns: ColumnDef<components["schemas"]["Company"]>[] = [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "CreatedAt",
    header: "Fecha de Creacion",
  },
]