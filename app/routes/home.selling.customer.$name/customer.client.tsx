import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";
import CustomerInfo from "./components/tab/customer-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CustomerConnections from "./components/tab/customer-connections";
import { ButtonToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { EventState, PartyType, partyTypeToJSON, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function CustomerClient() {
  const { customer, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>()
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { t, i18n } = useTranslation("common");
  const r = route;
  const navigate = useNavigate();
  const { roleActions } =  useOutletContext<GlobalState>()
  const [permission] = usePermission({
    roleActions,actions,
  })
  
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.customerM,
      routePrefix: [r.sellingM],
      routeSufix: [customer?.name || ""],
      q: {
        tab: tab,
        id: customer?.uuid || "",
      },
    });
  };
  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    // {
    //   title: t("connections"),
    //   href: toRoute("connections"),
    // },
  ];

  const onChangeState = (e: EventState) => {
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: customer?.status || "",
      party_id: customer?.uuid || "",
      events: [e],
    };
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
 },[fetcher.data])

  setUpToolbar(() => {
    const state = stateFromJSON(customer?.status);

    let view: ButtonToolbar[] = [];
    let actions:ButtonToolbar[] = []
    if (permission.edit && state == State.ENABLED) {
      actions.push({
        label: "Deshabilitar",
        onClick: () => {
          onChangeState(EventState.DISABLED_EVENT);
        },
      });
    }
    if (permission.edit && state == State.DISABLED) {
      actions.push({
        label: "Habilitar Evento",
        onClick: () => {
          onChangeState(EventState.ENABLED_EVENT);
        },
      });
    }
    view.push({
      label: t("accountingLedger"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.generalLedger,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              partyName: customer?.name,
              party: customer?.id.toString(),
              partyType: partyTypeToJSON(PartyType.supplier),
            },
          })
        );
      },
    });
    view.push({
      label: t("accountReceivable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountReceivable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              party: customer?.id.toString(),
              partyName: customer?.name,
            },
          })
        );
      },
    });
    return {
      view: view,
      triggerTabs:true,
      actions:actions,
      status: stateFromJSON(customer?.status),
    };
  }, [customer,permission]);

  return (
    <DetailLayout
      activities={activities}
      partyID={customer?.id}
      navItems={navItems}
    >
      {tab == "info" && <CustomerInfo />}
      {tab == "connections" && <CustomerConnections />}
    </DetailLayout>
  );
}
