import { useEffect, useMemo, useState } from "react";
import { components } from "~/sdk";
import { Permission } from "~/types/permission";


type ActionDto = components["schemas"]["ActionDto"]
type RoleActionDto = components["schemas"]["RoleActionDto"]
type Actions =  {
  [key: string]: components["schemas"]["ActionDto"][] | undefined;
}
interface UsePermissionProps {
    actions?: ActionDto[]
    roleActions?: RoleActionDto[]
  }
  
  export function usePermission({ actions, roleActions }: UsePermissionProps): [Permission] {
    const permission = useMemo(() => {
      if (!actions || !roleActions) {
        return {
          create: false,
          view: false,
          edit: false,
          delete: false,
        }
      }
  
      const roleActionIds = new Set(roleActions.map(ra => ra.action_id))
  
      return actions.reduce((acc, action) => {
        if (action.name) {
          acc[action.name as keyof Permission] = roleActionIds.has(action.id)
        }
        return acc
      }, {} as Permission)
    }, [actions, roleActions])
  
    // useEffect(() => {
    //   if (!actions || !roleActions) {
    //     console.warn('usePermission: actions or roleActions is undefined')
    //   }
    // }, [actions, roleActions])
  
    return [permission]
  }