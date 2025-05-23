import { create } from "zustand";
import { components } from "~/sdk";



interface SupplierStore {
    reset:()=>void
    newSupplier?:components["schemas"]["SupplierDto"]
    onCreateSupplier:(e?:components["schemas"]["SupplierDto"])=>void
}

export const useSupplierStore = create<SupplierStore>((set)=>({
    reset:()=>set({
        newSupplier:undefined,
    }),
    newSupplier:undefined,
    onCreateSupplier:(e)=>set({
        newSupplier:e
    })
}))