import { create } from "zustand";
import { ActionToolbar } from "~/types/actions";

interface ToolbarStore {
    actions:ActionToolbar[]
    title?:string
    resetState:()=>void
    setToolbar:(opts:{
        actions?:ActionToolbar[],
        title?:string
    })=>void
}
export const useToolbar = create<ToolbarStore>((set)=>({
    actions:[],
    title:undefined,
    resetState:()=>set((state)=>({
        actions:[],
        title:undefined
    })),
    setToolbar:(opts)=>set((state)=>({
        actions:opts.actions || [],
        title:opts.title,
    })),

}))