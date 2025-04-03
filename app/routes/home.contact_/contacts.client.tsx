import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { DataTable } from "@/components/custom/table/CustomTable";
import { contactColumns } from "@/components/custom/table/columns/contact/contact-columms";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { useTranslation } from "react-i18next";
import { party } from "~/util/party";

export default function ContactsClient() {
  const { results, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const r = route;
  const navigate = useNavigate();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { t } = useTranslation("common");
 
  return (
    <ListLayout
      title={t(party.contact)}
      {...(permission?.create && {
        onCreate: () => {
          navigate(r.toRouteDetail(r.contact,"new"));
        },
      })}
    >
      <DataTable
        data={results || []}
        columns={contactColumns()}
        enableSizeSelection={true}
      />
    </ListLayout>
  );
}
