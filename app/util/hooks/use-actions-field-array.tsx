import {
  FieldArrayPath,
  FieldValues,
  useFieldArray,
  UseFieldArrayProps,
} from "react-hook-form";

// Extend UseFieldArrayProps to create ActionsFieldArrayProps interface
interface ActionsFieldArrayProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TKeyName extends string
> extends UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName> {
  onChange?: () => void;
}

// Custom hook for field array actions
export function useActionsFieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id"
>(props: ActionsFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName>) {
  // Retrieve field array methods
  const fieldArrayMethods = useFieldArray<
    TFieldValues,
    TFieldArrayName,
    TKeyName
  >(props);

  const { fields, append, update, remove, swap } = fieldArrayMethods;

  // Define additional utility methods
  const metaOptions = {
    addRow: (
      defaultValues: Partial<TFieldValues[TFieldArrayName][number]> = {}
    ) => {
      append(defaultValues as TFieldValues[TFieldArrayName][number]);
    },
    removeRow: (index: number | number[]) => {
      remove(index);
      props?.onChange?.();
    },
    moveRow: (from: number, to: number) => {
      swap(from, to);
      props?.onChange?.();
    },
  };

  // Return both field array methods and meta options
  return [fieldArrayMethods, metaOptions] as const;
}
