import { cn } from "@/lib/utils";
import { ReactNode } from "react"

export default function Typography({
    children,fontSize=sm,textAlign,textColor,className,fontWeight=500
}:{
    children:ReactNode
    fontSize?:number
    fontWeight?:number
    textAlign?:"center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    textColor?:string
    className?:string
}){
    return (
        <div className={cn("",className)}
        style={{
            fontSize:fontSize,
            fontWeight:fontWeight,
            textAlign:textAlign,
            color:textColor,
        }}
        >{children}</div>
    )
}


export const xs = 12
export const sm = 14
export const labelF = 16
export const subtitle = 18
export const title = 20
export const headline = 28
