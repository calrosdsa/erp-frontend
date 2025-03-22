import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { accountColumns } from "@/components/custom/table/columns/accounting/account-columns";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { TreeView } from "@/components/layout/tree/tree-view";
import { useNewAccount } from "../home.account.new/use-new-account";
import { useAccounLedgerStore } from "../home.account.new/account-ledger-store";

export default function AccountsTreeViewClient() {
  const globalState = useOutletContext<GlobalState>();
  const { data, actions } = useLoaderData<typeof loader>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const r = route;
  const navigate = useNavigate();
  const accountLedgerStore = useAccounLedgerStore()
  setUpToolbar(() => {
    return {
      ...(permission?.create && {
        addNew: () => {
          navigate(
            r.toRoute({
              main: r.accountM,
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <div>
      <TreeView
        data={data || []}
        onAddChild={(e) => {
          accountLedgerStore.setPayload({
            parent:{
              name:e.name,
              id:e.id,
              uuid:e.uuid,
            },
          });
          navigate(
            r.toRoute({
              main: r.accountM,
              routeSufix: ["new"],
            })
          );
        }}
        onEdit={(e) => {
          navigate(
            r.toRoute({
              main: r.accountM,
              routeSufix: [e.name],
              q: {
                tab: "info",
                id: e.uuid,
              },
            })
          );
        }}
      />
    </div>
  );
}
