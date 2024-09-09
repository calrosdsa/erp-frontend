import { useEffect, useState } from "react";
import { components } from "~/sdk";
import { Permission } from "~/types/permission";



export function usePermission({actions,roleActions}:{
    actions?:components["schemas"]["Action"][]
    roleActions?:components["schemas"]["RoleActionDto"][]
}){
    const [permission,setPermissions] = useState<Permission>({
        create:false,
        view:false,
        edit:false
    })

    const checkPermission = ()=>{
        let p = permission
        actions?.map((item)=>{
            p = {
                ...p,
                [item.name]:roleActions?.map(t=>t.action_id).includes(item.id)
            }
        })
        setPermissions(p)
    }

    useEffect(()=>{
        checkPermission()
    },[roleActions,actions])

    return [permission]
}