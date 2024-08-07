import { CSSProperties } from "react";


export default function Divider({style}:{
    style?:CSSProperties | undefined;
    
}){

    return(
        <div style={style} className="w-full h-[0.4px] bg-foreground"/>
    )
}