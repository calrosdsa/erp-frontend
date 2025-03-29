"use client"

import { useEffect, useState } from "react"

import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Pencil, Save, X } from "lucide-react"
import { FormProvider } from "./form-provider"
import { cn } from "@/lib/utils"
import isEqual from 'lodash/isEqual';
interface SmartFormProps<T extends z.ZodType> {
  schema: T
  defaultValues: z.infer<T>
  onSubmit: (values: z.infer<T>) => void | Promise<void>
  children: React.ReactNode
  defaultEditMode?: boolean
  className?: string
  title?:string
}

export function SmartForm<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  children,
  defaultEditMode = false,
  className,
  title,
}: SmartFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(defaultEditMode)

  const [isChanged, setIsChanged] = useState(false);

  const watchedValues = useWatch({ control:form.control });
  useEffect(() => {
    setIsChanged(!isEqual(watchedValues, defaultValues));
  }, [watchedValues, defaultValues]);


  const handleSubmit = async (values: z.infer<T>) => {
    try {
      setIsSubmitting(true)
      await onSubmit(values)
      setIsEditing(false)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <FormProvider form={form} defaultEditMode={isEditing} hasChanged={isChanged}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={cn(className,"card")}>
          <div className="flex justify-between items-center ">
            <span className="font-medium">{title}</span>
            <div>
            {!isEditing ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
                <>
                <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting}>
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
          </div>

          <div
          className="py-2"
          >{children}</div>

        </form>
      </Form>
    </FormProvider>
  )
}

