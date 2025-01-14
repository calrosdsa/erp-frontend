import { FieldArrayPath, FieldValues, useFieldArray, UseFieldArrayProps } from "react-hook-form";


export function useActionsFieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id"
>(props: UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName>) {
      const fieldArrayMethods = useFieldArray(props);
      const { fields, append, update, remove, swap } = fieldArrayMethods;
      const metaOptions = {
        addRow: (defaultValues = {}) => {
          append(defaultValues as TFieldValues[TFieldArrayName][number]);
        },
        removeRow: (index: number | number[]) => {
          remove(index);
        },
        moveRow: (from: number, to: number) => {
          swap(from, to);
        },
      };

    return [fieldArrayMethods,metaOptions] as const;
}