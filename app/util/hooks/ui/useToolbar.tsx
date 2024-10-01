import { create } from "zustand";
import { EventState, State } from "~/gen/common";
import { ActionToolbar } from "~/types/actions";

interface ToolbarStore {
    actions:ActionToolbar[]
    title?:string
    loading?:boolean
    state?:State
    onChangeState?:(event:EventState)=>void
    onSave?:()=>void
    resetState:()=>void
    setLoading:(loading:boolean)=>void
    setToolbar:(opts:{
        actions?:ActionToolbar[],
        state?:State
        title?:string
        onChangeState?:(event:EventState)=>void
        onSave?:()=>void
    })=>void
}
export const useToolbar = create<ToolbarStore>((set)=>({
    actions:[],
    title:undefined,
    state:undefined,
    loading:false,
    setLoading:(e)=>set((state)=>({loading:e})),
    resetState:()=>set((state)=>({
        actions:[],
        title:undefined
    })),
    setToolbar:(opts)=>set((state)=>({
        actions:opts.actions || [],
        title:opts.title,
        state:opts.state,
        onSave:opts.onSave,
        onChangeState:opts.onChangeState,
    })),

}))