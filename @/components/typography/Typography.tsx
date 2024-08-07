import { ReactNode } from "react"

export default function Typography({
    children,fontSize,textAlign,textColor
}:{
    children:ReactNode
    fontSize:number
    textAlign?:"center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    textColor?:string
}){
    return (
        <div className="font-semibold"
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
export const title = 20
export const headline = 22
