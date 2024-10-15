import { useEffect } from "react"
import { SetupToolbarOpts, useToolbar } from "./useToolbar"


export const setUpToolbar = (opts:SetupToolbarOpts) =>{
    const toolbar = useToolbar()
    const setUpToolbar = () =>{
        toolbar.setToolbar(opts)
    }
    useEffect(()=>{
        setUpToolbar()
    },[])
}