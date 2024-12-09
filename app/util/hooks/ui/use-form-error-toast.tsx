import { useEffect, useRef } from 'react'
import { FieldErrors } from 'react-hook-form'
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from 'react-i18next'

export function useFormErrorToast<T extends Record<string, any>>(errors: FieldErrors<T>) {
  const { toast } = useToast()
  const {t} = useTranslation("common")
  const previousErrorsRef = useRef<FieldErrors<T>>({})

  useEffect(() => {
    const hasNewErrors = JSON.stringify(errors) !== JSON.stringify(previousErrorsRef.current)

    if (Object.keys(errors).length > 0 && hasNewErrors) {
      const errorMessages = Object.entries(errors).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.map(err => err?.message || 'Invalid entry').join(', ')}`
        }
        if (typeof value === 'object' && value !== null) {
          return `${t(`form.${key}`)}: ${value.message || 'Invalid entry'}`
        }
        return `${key}: Invalid entry`
      })

      toast({
        title: "Errores de validación del formulario",
        description: (
          <ul className="list-disc pl-4 max-h-[200px] overflow-y-auto">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
        duration: 5000,
      })

      previousErrorsRef.current = errors
    }
  }, [errors, toast])
}