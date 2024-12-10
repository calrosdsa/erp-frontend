import { useCallback } from 'react'
import { useTaxAndCharges } from "../accounting/tax/use-tax-charges"
import { useLineItems } from "../item/use-line-items"
import { useDocumentStore } from "./use-document-store"

interface ResetDocumentResult {
  resetDocument: () => void
  resetItems:()=>void
}

export function useResetDocument(): ResetDocumentResult {
  const lineItems = useLineItems()
  const taxAndCharges = useTaxAndCharges()
  const documentStore = useDocumentStore()

  const resetDocument = useCallback(() => {
    try {
      lineItems.reset()
      taxAndCharges.reset()
      documentStore.reset()
    } catch (error) {
      console.error('Error resetting document:', error)
      // You might want to handle this error more gracefully,
      // such as displaying a user-friendly error message or logging it to a service
    }
  }, [lineItems, taxAndCharges, documentStore])

  return { 
    resetDocument,
    resetItems:lineItems.reset,
 }
}