import { LucideIcon } from "lucide-react"


export interface ButtonToolbar {
    label:string,
    onClick:()=>void,
    useSeparator?:boolean
    Icon?:LucideIcon
}

