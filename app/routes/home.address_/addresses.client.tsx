import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { addressColumns } from "@/components/custom/table/columns/address/address-columms";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { useTranslation } from "react-i18next";
import { party } from "~/util/party";
import { DEFAULT_ID } from "~/constant";

export default function AddressesClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions: globalState.roleActions,
    actions: actions,
  });
  const r = route;
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const openModal = (key: string, value: any) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return (
    <ListLayout
      title={t(party.address)}
      {...(permission?.create && {
        addNew: () => {
          openModal(route.address, DEFAULT_ID);
        },
      })}
    >
      <DataTable
        data={paginationResult || []}
        columns={addressColumns({
          openModal: openModal,
        })}
        enableSizeSelection={true}
      />
    </ListLayout>
  );
}
