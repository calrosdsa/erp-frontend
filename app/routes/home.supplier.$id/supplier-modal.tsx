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
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
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
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { DEFAULT_ID } from "~/constant";
import SupplierInfo from "./components/tab/supplier-info";
import { SerializeFrom } from "@remix-run/node";

export default function SupplierModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.supplier;
  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  const supplier = data?.supplier;
  const [open, setOpen] = useState(true);
  // const { supplier, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t, i18n } = useTranslation("common");
  const r = route;
  const supplierID = searchParams.get(route.supplier);
  const navigate = useNavigate();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });

  const initData = async() => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.supplier, supplierID));
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    initData();
  }, []);

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
        action: route.toRoute({
          main: route.supplier,
          routeSufix: [supplier?.id.toString() || ""],
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
      const state = stateFromJSON(supplier?.status);
      const isNew = DEFAULT_ID == supplierID;
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
        title: isNew ? "Nuevo proveedor" : supplier?.name,
        view: isNew ? [] : view,
        actions: isNew ? [] : actions,
        status: stateFromJSON(supplier?.status),
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
    searchParams.delete(route.supplier);
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
      {loading ? (
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
                children: <SupplierInfo appContext={appContext} data={data} />,
              },
            ]}
          />
        </>
      )}
    </ModalLayout>
    // <DetailLayout
    //   activities={activities}
    //   partyID={supplier?.id}
    //   navItems={navItems}
    // >
    //   {tab == "info" && <CustomerInfo />}
    //   {tab == "connections" && <CustomerConnections />}
    // </DetailLayout>
  );
}
