import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef, useCallback } from "react";
import { useForm, FieldValues, UseFormReturn, DefaultValues, Path } from "react-hook-form";
import { z } from "zod";
import { isEqual } from 'lodash';

// Improved Props type with better type inference
interface UseEditFieldsProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues:DefaultValues<T>;
}

// Return type for better type inference
interface UseEditFieldsReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  hasChanged: boolean;
  updateRef: (values: DefaultValues<T>) => void;
  previousValues: DefaultValues<T>;
}

export function useEditFields<T extends FieldValues>({ 
  schema, 
  defaultValues 
}: UseEditFieldsProps<T>): UseEditFieldsReturn<T> {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues:defaultValues,
  });

  const [hasChanged, setHasChanged] = useState(false);
  const previousValuesRef = useRef<DefaultValues<T>>(defaultValues);
  const validateIfDataHasChanged = useCallback((currentValues:any) => {
    // const currentValues = form.getValues();
    // const equal = isEqual(currentValues, previousValuesRef.current);
    const equal = JSON.stringify(currentValues) == JSON.stringify(previousValuesRef.current);
    setHasChanged(!equal);
  }, []);

  const updateRef = useCallback((newValues: DefaultValues<T>) => {
    previousValuesRef.current = newValues;
    validateIfDataHasChanged(newValues);
  }, [validateIfDataHasChanged]);

  // useEffect(() => {
  //   Object.entries(defaultValues).forEach(([key, value]) => {
  //     form.setValue(key as keyof T as Path<T>, value as T[keyof T],)
  //   })
  // }, [])

  // useEffect(() => {
  //   // const subscription = form.watch(() => {
  //     validateIfDataHasChanged();
  //   // });

  // }, [allWatchedFormValues, validateIfDataHasChanged]);
  useEffect(()=>{
    validateIfDataHasChanged(form.getValues())
  },[form.getValues()])

  return { 
    form, 
    hasChanged, 
    updateRef,
    previousValues: previousValuesRef.current 
  };
}