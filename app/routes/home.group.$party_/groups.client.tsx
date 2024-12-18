import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { DataTable } from "@/components/custom/table/CustomTable";
import { groupColumns } from "@/components/custom/table/columns/group/group-columns";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType } from "~/types/enums";
import { useCreateGroup } from "./components/create-group";
import { loader } from "./route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { partyTypeFromJSON, } from "~/gen/common";

export default function GroupsClient() {
  const globalState = useOutletContext<GlobalState>();
  const params = useParams();
  const { t } = useTranslation("common");
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const createGroup = useCreateGroup();
  setUpToolbar(() => {
    return {
        titleToolbar:t(params.party || ""),
        ...(permission?.create && {
            addNew: () => {
              if (params.party) {
                createGroup.openDialog({ partyType:params.party});
              }
            },
          }),
    };
  }, [permission]);
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={groupColumns({ party: params.party || "" })}
        enableSizeSelection={true}       
      />
    </div>
  );
}
