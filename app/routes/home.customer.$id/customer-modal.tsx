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
import {
  EventState,
  PartyType,
  partyTypeToJSON,
  State,
  stateFromJSON,
} from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ModalLayout, {
  useModalStore,
} from "@/components/ui/custom/modal-layout";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";

export default function CustomerModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const fetcherLoader = useFetcher<typeof loader>({ key: "customer" });
  const data = fetcherLoader.data;
  const customer = fetcherLoader.data?.customer;
  const [open, setOpen] = useState(true);
  // const { customer, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t, i18n } = useTranslation("common");
  const r = route;
  const customerID = searchParams.get(route.customer);
  const navigate = useNavigate();
  const { setToolbar } = useToolbar();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });

  const initData = () => {
    fetcherLoader.submit(
      {},
      {
        action: route.toRoute({
          main: route.customer,
          routeSufix: [customerID || ""],
        }),
      }
    );
  };
  useEffect(() => {
    initData();
  }, []);

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
        action: route.toRoute({
          main: route.customer,
          routeSufix: [customer?.id.toString() || ""],
        }),
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

  useEffect(() => {
    const state = stateFromJSON(customer?.status);

    let view: ButtonToolbar[] = [];
    let actions: ButtonToolbar[] = [];
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

    console.log("SET TOOLBAR")
    setToolbar({
      view: view,
      actions: actions,
      status: stateFromJSON(customer?.status),
    });
  }, [fetcherLoader.data]);

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.customer);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      title={customer?.name || ""}
    >
      {fetcherLoader.state == "loading" && !fetcherLoader.data ? (
        <LoadingSpinner />
      ) : (
        <>
          <TabNavigation
            defaultValue={tab}
            onValueChange={(value) => {
              searchParams.set("tab", value);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }}
            items={[
              {
                label: "Info",
                value: "info",
                children: <CustomerInfo appContext={appContext} />,
              },
            ]}
          />
        </>
      )}
    </ModalLayout>
    // <DetailLayout
    //   activities={activities}
    //   partyID={customer?.id}
    //   navItems={navItems}
    // >
    //   {tab == "info" && <CustomerInfo />}
    //   {tab == "connections" && <CustomerConnections />}
    // </DetailLayout>
  );
}
