import { Button } from "@/components/ui/button"
import { FolderIcon, FolderOpenIcon } from "lucide-react"
import { ReactNode } from "react"



export default function ButtonExpandRow({isExpananded,onClick}:{
    isExpananded:boolean
    onClick:()=>void
}){
    return (
        <Button className="" variant={"outline"} 
        {...{
            onClick:onClick
        }}
        >
            {isExpananded ? <FolderOpenIcon/> : <FolderIcon/>}
        </Button>
    )
}