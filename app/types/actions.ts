import { LucideIcon } from "lucide-react"


export interface ActionToolbar {
    label:string,
    onClick:()=>void,
    useSeparator?:boolean
    Icon?:LucideIcon
}

export interface ButtonToolbar {
    label:string,
    onClick:()=>void,
    Icon?:LucideIcon
}