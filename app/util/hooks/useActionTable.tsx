import { useState } from "react"


interface Props  {
    addRow?:()=>void
}
export default function useActionTable({addRow}:Props){
    const [addRowDialog,setAddRowDialog] = useState(false)
    const options = {
        addRow:()=>{
            if(addRow != undefined){
                addRow()
            }
            setAddRowDialog(!addRowDialog)
        }
    }
    return [options,{
        addRowDialog,setAddRowDialog
    }] as const
}