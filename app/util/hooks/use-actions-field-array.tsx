import {
  FieldArrayPath,
  FieldValues,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayProps,
} from "react-hook-form";

// Extend UseFieldArrayProps to create ActionsFieldArrayProps interface
interface ActionsFieldArrayProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
  TKeyName extends string
> extends UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName> {
  onChange?: () => void;
  hasAction?: boolean;
  addRow?: (append: UseFieldArrayAppend<TFieldValues, TFieldArrayName>) => void;
  onRemove?:(index: number | number[])=>void
  defaultValues?: Partial<TFieldValues[TFieldArrayName][number]>;
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
    addRow: () => {
      if (props.addRow) {
        props.addRow(append);
      } else {
        // console.log("DEFAULT VALUES",defaultValues)
        if (props.defaultValues) {
          append(props.defaultValues as TFieldValues[TFieldArrayName][number]);
        } else {
          append({} as TFieldValues[TFieldArrayName][number]);
        }
      }
    },
    removeRow: (index: number | number[]) => {
      if(props.onRemove){
        props.onRemove(index)
      }else{
        remove(index);
        props?.onChange?.();

      }
    },
    moveRow: (from: number, to: number) => {
      swap(from, to);
      props?.onChange?.();
    },
  };

  // Return both field array methods and meta options
  return [fieldArrayMethods, metaOptions] as const;
}
