import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useRevalidator,
  useRouteLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";
import CustomerInfo from "./tab/customer-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CustomerConnections from "./tab/customer-connections";
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
  setUpModalPayload,
  useModalStore,
} from "@/components/ui/custom/modal-layout";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { DEFAULT_ID } from "~/constant";
import { SerializeFrom } from "@remix-run/node";

export default function CustomerModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.customer;
  const fetcherLoader = useFetcher<typeof loader>();
  // const data = useRouteLoaderData<typeof loader>("home.customer.$id");
  // const data = fetcherLoader.data;

  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  // const data = fetcherLoader.data;
  const customer = data?.customer;
  const [open, setOpen] = useState(true);
  // const { customer, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t, i18n } = useTranslation("common");
  const r = route;
  const customerID = searchParams.get(route.customer);
  const navigate = useNavigate();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });

  // const load = async() =>{
  //   fetcherLoader.load(route.toRouteDetail(route.customer,customerID))
  // }

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.customer, customerID));
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
        console.log("BODY", body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("LOAD MODAL....");
    load();
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

  setUpModalPayload(
    key,
    () => {
      console.log("RELOAD...");
      const state = stateFromJSON(customer?.status);
      const isNew = DEFAULT_ID == customerID;
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
      return {
        title: isNew ? "Nuevo cliente" : customer?.name,
        view: isNew ? [] : view,
        actions: isNew ? [] : actions,
        status: stateFromJSON(customer?.status),
        enableEdit: isNew,
        isNew: isNew,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data]
  );

  const closeModal = () => {
    searchParams.delete(route.customer);
    searchParams.delete("action");
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    if (!open) {
      closeModal();
    }
  }, [open]);

  return (
    <ModalLayout
      keyPayload={key}
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      {loading && !data ? (
        <LoadingSpinner />
      ) : (
        <>
          {data && (
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
                  children: (
                    <CustomerInfo
                      appContext={appContext}
                      data={data}
                      load={load}
                      closeModal={() => setOpen(false)}
                    />
                  ),
                },
              ]}
            />
          )}
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
