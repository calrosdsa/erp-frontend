import { create } from "zustand";
import { EventState, State } from "~/gen/common";
import { ActionToolbar } from "~/types/actions";

interface ToolbarStore {
    actions:ActionToolbar[]
    title?:string
    loading?:boolean
    status?:State
    onChangeState?:(event:EventState)=>void
    onSave?:()=>void
    resetState:()=>void
    setLoading:(loading:boolean)=>void
    setToolbar:(opts:{
        actions?:ActionToolbar[],
        status?:State
        title?:string
        onChangeState?:(event:EventState)=>void
        onSave?:()=>void
    })=>void
}
export const useToolbar = create<ToolbarStore>((set)=>({
    actions:[],
    title:undefined,
    status:undefined,
    loading:false,
    setLoading:(e)=>set((state)=>({loading:e})),
    resetState:()=>set((state)=>({
        actions:[],
        title:undefined,
        status:undefined,
    })),
    setToolbar:(opts)=>set((state)=>({
        actions:opts.actions || [],
        title:opts.title,
        status:opts.status,
        onSave:opts.onSave,
        onChangeState:opts.onChangeState,
    })),

}))