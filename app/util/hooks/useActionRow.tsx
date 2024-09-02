import { useState } from "react"


interface Props  {
    addRow?:()=>void
    onEdit?:(rowIndex:number)=>void
}
export default function useActionRow({addRow,onEdit}:Props){
    const [openDialog,setOpenDialog] = useState(false)
    const [selectedRow,setSelecetedRow] = useState<number | undefined>(undefined)
    const options = {
        // addRow:()=>{
        //     if(addRow != undefined){
        //         addRow()
        //     }
        //     setOpenDialog(!openDialog)
        // },
        onEdit:(rowIndex:number)=>{
            if(onEdit != undefined){
                onEdit(rowIndex)
            }
            setOpenDialog(!openDialog)
            setSelecetedRow(rowIndex)
        }
    }
    return [options,{
        openDialog,setOpenDialog,selectedRow,setSelecetedRow
    }] as const
}