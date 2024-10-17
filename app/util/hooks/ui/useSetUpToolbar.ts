import { DependencyList, useEffect } from "react"
import { SetupToolbarOpts, useToolbar } from "./useToolbar"


export const setUpToolbar = (opts:()=>SetupToolbarOpts,dependencyList:DependencyList =[]) =>{
    const toolbar = useToolbar()
    const setUpToolbar = () =>{
        toolbar.setToolbar(opts())
    }
    useEffect(()=>{
        setUpToolbar()
    },dependencyList)
}