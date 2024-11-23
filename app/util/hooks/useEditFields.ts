import { aCompanyUserColumns } from "@/components/custom/table/columns/admin/a-company-columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { z } from "zod";

// Props type that takes a generic schema and default values
interface Props<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues: any;
}

export default function useEditFields<T extends FieldValues>({ schema, defaultValues }: Props<T>) {
  // Use zodResolver with schema and ensure the defaultValues match the inferred type
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues, // Ensure defaultValues is of type T
  });

  const [hasChanged, setHasChanged] = useState(false);
  
  // Use a ref to keep track of previous values for comparison
  const previousValuesRef = useRef<T>(defaultValues);

  const validateIfDataHasChanged = () => {
    // Compare current form values with previous values to check if there are any changes
    const currentValues = form.getValues();
    const isEqual = JSON.stringify(currentValues) === JSON.stringify(previousValuesRef.current);
    console.log("VALIDATING",isEqual)
    setHasChanged(!isEqual);
    // previousValuesRef.current = currentValues
  };

  const updateRef = (e:T)=>{
    previousValuesRef.current = e
  }

  useEffect(() => {
    // Validate if data has changed when form values change
    validateIfDataHasChanged();
  }, [form.getValues()]); // Re-run when form values change

  return { form, hasChanged,updateRef,previousValuesRef };
}