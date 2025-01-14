import { useState } from "react";
import { Control } from "react-hook-form";
import { AnyZodTuple } from "zod";

interface Props {
  onEdit?: (rowIndex: number) => void;
  onDelete?: (rowIndex: number) => void;
  onAddRow?: () => void;
}
export default function useTableRowActions({
  onEdit,
  onDelete,
  onAddRow,
}: Props) {
  const metaOptions = {
    onDelete: onDelete,
    onEdit: onEdit,
    addRow: onAddRow,
  };
  return [metaOptions] as const;
}

