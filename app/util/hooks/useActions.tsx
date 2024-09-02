import { useEffect, useState } from "react";
import { components } from "index";


interface Permission {
    create:boolean
    edit:boolean
    view:boolean
}
export function useActions({actions,roleActions}:{
    actions?:components["schemas"]["Action"][]
    roleActions?:components["schemas"]["RoleActions"][]
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
                [item.Name]:roleActions?.map(t=>t.ActionID).includes(item.ID)
            }
        })
        setPermissions(p)
    }

    useEffect(()=>{
        checkPermission()
    },[roleActions,actions])

    return [permission]
}