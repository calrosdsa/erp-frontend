import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { groupColumns } from "@/components/custom/table/columns/group/group-columns";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType } from "~/types/enums";
import { useCreateGroup } from "../home.groups.$party_/components/create-group";

export default function SupplierGroupsClient() {
  const globalState = useOutletContext<GlobalState>();
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const createGroup = useCreateGroup();
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={groupColumns({party:PartyType.PARTY_ITEM_GROUP})}
        metaActions={{
          meta: {
            ...(permission?.create && {
              addNew: () => {
                createGroup.openDialog({
                  partyType: PartyType.PARTY_ITEM_GROUP,
                });
              },
            }),
          },
        }}
      />
    </div>
  );
}
