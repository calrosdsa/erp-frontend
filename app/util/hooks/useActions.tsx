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




  
interface UseEntityPermissionProps {
  entities?: {
    [key: string]: {
      entity_id: number;
      id: number;
      name: string;
    }[] | undefined;
  };
  roleActions?: {
    action_id: number;
  }[];
}

export function useEntityPermission({ entities, roleActions }: UseEntityPermissionProps): { [entityId: number]: Permission } {
  return useMemo(() => {
    if (!entities || !roleActions) return {};

    // Flatten all entities from all categories
    const allEntities = Object.values(entities)
      .flatMap(entityArray => entityArray ?? []);

    // Create a map of entity_id to its associated actions
    const entityMap = allEntities.reduce((acc, entity) => {
      const key = entity.entity_id;
      if (!acc.has(key)) acc.set(key, []);
      acc.get(key)!.push(entity);
      return acc;
    }, new Map<number, typeof allEntities[0][]>());

    // Get all allowed action IDs
    const allowedActionIds = new Set(roleActions.map(ra => ra.action_id));

    // Convert entity map to permission object
    const permissions: { [entityId: number]: Permission } = {};

    entityMap.forEach((actions, entityId) => {
      // Initialize default permissions
      const perm: Permission = {
        create: false,
        view: false,
        edit: false,
        delete: false,
      };

      // Group action IDs by permission type
      const actionGroups = actions.reduce((acc, action) => {
        const actionName = action.name as keyof Permission;
        if (Object.hasOwnProperty.call(perm, actionName)) {
          acc[actionName] = acc[actionName] || [];
          acc[actionName].push(action.id);
        }
        return acc;
      }, {} as Record<keyof Permission, number[]>);

      // Determine final permissions
      (Object.keys(perm) as (keyof Permission)[]).forEach((permission) => {
        perm[permission] = (actionGroups[permission] || [])
          .some(id => allowedActionIds.has(id));
      });

      permissions[entityId] = perm;
    });

    return permissions;
  }, [entities, roleActions]);
}