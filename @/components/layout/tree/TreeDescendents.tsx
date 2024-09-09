import { useEffect } from "react"
import { components } from "~/sdk"
import TreeNode from "./TreeNode"


type HierarchyItem = {
    name:string
    isGroup:boolean
    uuid:string
    depth:number
    children:HierarchyItem[]
}

interface Item {
    uuid: string;
    parent_uuid: string | null;
    name: string;
    is_group: boolean;
    depth: number;
}

export interface GroupedItem extends Item {
    children?: GroupedItem[];
}
export const TreeDescendents = ({data}:{
    data:components["schemas"]["GroupHierarchyDto"][]   
}) =>{

    const transformDataToTree = (items: Item[]): GroupedItem[] => {
        const itemMap = new Map<string, GroupedItem>();
        const rootItems: GroupedItem[] = [];
    
        // Create a map of all items
        items.forEach(item => {
            itemMap.set(item.uuid, { ...item, children: [] });
        });
    
        // Build the hierarchy
        items.forEach(item => {
            if (item.parent_uuid === null) {
                rootItems.push(itemMap.get(item.uuid) as GroupedItem);
            } else {
                const parent = itemMap.get(item.parent_uuid);
                if (parent) {
                    (parent.children as GroupedItem[]).push(itemMap.get(item.uuid) as GroupedItem);
                }
            }
        });
    
        return rootItems;
    };
    return (
        <div className="pr-10">
            {/* {JSON.stringify(transformDataToTree(data))} */}
           {transformDataToTree(data).map(node => (
        <TreeNode
          key={node.uuid}
          uuid={node.uuid}
          name={node.name}
          is_group={node.is_group}
          depth={node.depth}
          children={node.children}
          parent_uuid={node.parent_uuid}
        />
      ))}
        </div>
    )
}