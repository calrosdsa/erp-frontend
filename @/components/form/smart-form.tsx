"use client";

import { useEffect, useState } from "react";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Pencil, Save, X } from "lucide-react";
import { FormProvider } from "./form-provider";
import { cn } from "@/lib/utils";
import isEqual from "lodash/isEqual";
import { useModalStore } from "../ui/custom/modal-layout";
interface SmartFormProps<T extends z.ZodType> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => void | Promise<void>;
  children: React.ReactNode;
  keyPayload:string
  className?: string;
  title?: string;
  isNew?: boolean;
}

export function SmartForm<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  children,
  keyPayload,
  className,
  title,
  isNew,
}: SmartFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });
  const {editPayload} =  useModalStore()
  const payload = useModalStore((state)=>state.payload[keyPayload])

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isEditing, setIsEditing] = useState(defaultEditMode);

  const [isChanged, setIsChanged] = useState(false);

  const watchedValues = useWatch({ control: form.control });
  useEffect(() => {
    setIsChanged(!isEqual(watchedValues, defaultValues));
  }, [watchedValues, defaultValues]);

  const setIsEditing = (e:boolean)=>{
    editPayload(keyPayload,{
      enableEdit:e
    });
  }

  const handleSubmit = async (values: z.infer<T>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      setIsEditing(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <FormProvider
      form={form}
      defaultEditMode={payload?.enableEdit}
      hasChanged={isChanged}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn(className, "card")}
        >
          <div className="flex justify-between items-center ">
            <span className="font-medium">{title}</span>
            {!isNew && (
              <div>
                {!payload?.enableEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    {/* <Button type="submit" variant={"ghost"} size="sm" disabled={isSubmitting || !form.formState.isDirty}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                  </Button> */}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="py-2">{children}</div>
        </form>
      </Form>
    </FormProvider>
  );
}
