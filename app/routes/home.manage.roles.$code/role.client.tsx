import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { roleEntitiesActionColumns } from "@/components/custom/table/columns/user/role-columns";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { EditRolePermission, useEditRolePermission } from "./components/edit-role-permission";
import useActionRow from "~/util/hooks/useActionRow";
import RoleInfo from "./role-info";
import { route } from "~/util/route";

export default function RoleClient() {
  const key  = route.role
  const { role, actions, roleActions,entityActions } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const [permission] = usePermission({
    roleActions: state.roleActions,
    actions: actions,
  });
  const allowEdit = permission.edit
  const editRolePermission = useEditRolePermission()
  const [meta,stateActions] = useActionRow({
    onEdit:indexRow=>{
        const eActions = entityActions?.entity.find((t,idx)=>idx == indexRow)
        editRolePermission.openDialog({roleActions:roleActions,entityActions:eActions,role:role})
    }
  })
  //   const {t:tBase} = useTranslation("base");

  return (
    <>
    {editRolePermission.open && 
    <EditRolePermission
    open={editRolePermission.open}
    onOpenChange={editRolePermission.onOpenChange}
    roleActions={editRolePermission.roleActions}
    entityActions={editRolePermission.entityActions}
    role={editRolePermission.role}
    />
    }
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        <div className=" col-span-full">
      <RoleInfo
      
      keyPayload={key}
      allowEdit={allowEdit}
      />
      </div> 

        <Typography fontSize={subtitle} className=" col-span-full">
          {t("_role.permissions")}
        </Typography>

        {/* {JSON.stringify(entityActions?.entity)} */}
        <div className=" col-span-full">
          <DataTable
           
            metaOptions={{
                meta:meta
            }}
            data={entityActions?.entity || []}
            columns={roleEntitiesActionColumns({
                roleActions:roleActions || []
            })}
          />
        </div>
      </div>
    </>
  );
}
