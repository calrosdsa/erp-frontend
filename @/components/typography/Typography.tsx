import { cn } from "@/lib/utils";
import { ReactNode } from "react"

export default function Typography({
    children,fontSize,textAlign,textColor,className
}:{
    children:ReactNode
    fontSize:number
    textAlign?:"center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    textColor?:string
    className?:string
}){
    return (
        <div className={cn("font-semibold",className)}
        style={{
            fontSize:fontSize,
            textAlign:textAlign,
            color:textColor,
        }}
        >{children}</div>
    )
}

export const xs = 12
export const sm = 14
export const label = 16
export const subtitle = 18
export const title = 24
export const headline = 28
