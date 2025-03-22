import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import SupplierInfo from "./tab/supplier-info";
import { NavItem } from "~/types";
import { EventState, PartyType, partyTypeToJSON, State, stateFromJSON } from "~/gen/common";
import { ButtonToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { GlobalState } from "~/types/app-types";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { usePermission } from "~/util/hooks/useActions";

export default function SupplierClient() {
  const { supplier, actions, activities} =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const fetcher = useFetcher<typeof action>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({roleActions,actions})
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.supplier,
      routePrefix: [r.buyingM],
      routeSufix: [supplier?.name || ""],
      q: {
        tab: tab,
        id: supplier?.uuid || "",
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
      current_state: supplier?.status || "",
      party_id: supplier?.uuid || "",
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

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  setUpToolbar(() => {
    const state = stateFromJSON(supplier?.status);
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
              partyName: supplier?.name,
              party: supplier?.id.toString(),
              partyType: partyTypeToJSON(PartyType.supplier),
            },
          })
        );
      },
    });
    view.push({
      label: t("accountPayable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountPayable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              party: supplier?.id.toString(),
              partyName: supplier?.name,
            },
          })
        );
      },
    });
    return {
      view: view,
      actions:actions,
      status: stateFromJSON(supplier?.status),
    };
  }, [supplier,permission]);
  return (
    <DetailLayout navItems={navItems} partyID={supplier?.id} 
    activities={activities}>
      {tab == "info" && <SupplierInfo />}
    </DetailLayout>
  );
}
