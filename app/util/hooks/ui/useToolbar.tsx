import { create } from "zustand";
import { State } from "~/gen/common";
import { ActionToolbar } from "~/types/actions";

interface ToolbarStore {
    actions:ActionToolbar[]
    title?:string
    state?:State
    onSubmit?:()=>void
    onSave?:()=>void
    resetState:()=>void
    setToolbar:(opts:{
        actions?:ActionToolbar[],
        state?:State
        title?:string
        onSubmit?:()=>void
        onSave?:()=>void
    })=>void
}
export const useToolbar = create<ToolbarStore>((set)=>({
    actions:[],
    title:undefined,
    state:undefined,
    resetState:()=>set((state)=>({
        actions:[],
        title:undefined
    })),
    setToolbar:(opts)=>set((state)=>({
        actions:opts.actions || [],
        title:opts.title,
        state:opts.state,
        onSave:opts.onSave,
        onSubmit:opts.onSubmit,
    })),

}))