import { ReactNode } from "react"
import { useMediaQuery } from "usehooks-ts";
import { TreeDescendents } from "./TreeDescendents";
import { components } from "~/sdk";


export const TreeGroupLayout = ({children,data}:{
    data:components["schemas"]["GroupHierarchyDto"][]
    children:ReactNode
})=>{
  const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex items-center"}`}>
            <TreeDescendents
            data={data || []}
            />
            {children}
        </div>
    )
}