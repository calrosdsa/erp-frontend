import { LucideIcon } from "lucide-react"


export interface ActionToolbar {
    label:string,
    onClick:()=>void,
    useSeparator?:boolean
    Icon?:LucideIcon
}