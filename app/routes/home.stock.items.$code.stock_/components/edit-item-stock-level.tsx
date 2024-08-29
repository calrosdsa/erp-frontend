// import { useFetcher } from "@remix-run/react";
// import { create } from "zustand";
// import { components } from "~/sdk";
// import { action } from "../route";
// import { useTranslation } from "react-i18next";
// import { useToast } from "@/components/ui/use-toast";
// import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";



// export const EditItemStockLevel = ({open,onOpenChange,stockLevel}:{
//     open:boolean
//     onOpenChange:(e:boolean)=>void
//     stockLevel?:components["schemas"]["StockLevel"] | undefined
// })=>{
//     const fetcher = useFetcher<typeof action>()
//     const {t} = useTranslation()
//     const {toast} = useToast()
//     return (
//         <DrawerLayout>
//             <Custo
//         </DrawerLayout>
//     )
// }


// interface EditItemStockLevelStore {
//   open: boolean;
//   onOpenChange: (e: boolean) => void;
//   stockLevel: components["schemas"]["StockLevel"] | undefined;
//   onOpenDialog: (e: components["schemas"]["StockLevel"]) => void;
// }

// export const editItemStockLevel = create<EditItemStockLevelStore>((set) => ({
//   open: false,
//   onOpenChange: (e) => set((state) => ({ open: e })),
//   stockLevel: undefined,
//   onOpenDialog: (e) => set((state) => ({ stockLevel: e })),
// }));
