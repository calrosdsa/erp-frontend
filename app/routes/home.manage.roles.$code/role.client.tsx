import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { roleDefinitionColumns, roleEntitiesActionColumns } from "@/components/custom/table/columns/user/role-columns";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { EditRolePermission, useEditRolePermission } from "./components/edit-role-permission";
import useActionRow from "~/util/hooks/useActionRow";

export default function RoleClient() {
  const { role, actions, roleActions,entityActions } = useLoaderData<typeof loader>();
  const state = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const [permission] = usePermission({
    roleActions: state.roleActions,
    actions: actions,
  });
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
        <DisplayTextValue title={t("form.name")} value={role?.code} />
        <DisplayTextValue
          title={t("form.description")}
          value={role?.description}
        />

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
