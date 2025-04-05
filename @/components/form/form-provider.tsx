import type React from "react";
import { createContext, useContext, useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

interface FormContextProps<T extends FieldValues> {
  form: UseFormReturn<T> | null;
  isEditing: boolean;
  hasChanged: boolean;
  setIsEditing: (e: boolean) => void;
  //   setIsEditing: (value: boolean) => void
}

const FormContext = createContext<FormContextProps<any> | undefined>(undefined);

export function useFormContext<T extends FieldValues>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as FormContextProps<T>;
}

export function FormProvider<T extends FieldValues>({
  children,
  form,
  defaultEditMode = false,
  hasChanged = false,
  setIsEditing,
}: {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  defaultEditMode?: boolean;
  hasChanged: boolean;
  setIsEditing: (e: boolean) => void;
}) {
  //   const [isEditing, setIsEditing] = useState(defaultEditMode)

  return (
    <FormContext.Provider
      value={{
        form,
        isEditing: defaultEditMode,
        hasChanged: hasChanged,
        setIsEditing,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
