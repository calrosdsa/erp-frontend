import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout"
import { create } from "zustand"

export default function ChartSetting({
    open,onOpenChange
}:{
    open:boolean
    onOpenChange:(e:boolean)=>void
}){
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}
        >
            sELECT CHART
        </DrawerLayout>
    )
}

interface ChartSettingStore {
    open:boolean
    onOpenChange:(e:boolean)=>void
}

export const useChartSetting = create<ChartSettingStore>((set)=>({
    open:false,
    onOpenChange:(e)=>set({
        open:e
    })
}))