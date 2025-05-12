import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { bookingColumns } from "@/components/custom/table/columns/regate/booking-columns";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DataLayout from "@/components/layout/data-layout";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { useEventDebounceFetcher } from "~/util/hooks/fetchers/regate/useEventDebounceFetcher";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/use-court-debounce-fetcher";
import { components } from "~/sdk";
import { Button } from "@/components/ui/button";
import { State, stateToJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GenericActionsDropdown } from "./components/actions-dropdown";
import CustomSelect from "@/components/custom/select/custom-select";
import { ButtonToolbar } from "~/types/actions";
import { party } from "~/util/party";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function BookingsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const [customerFetcher, onCustomerNameChange] = useCustomerDebounceFetcher();
  const [eventoFetcher, onEventNameChange] = useEventDebounceFetcher();
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { clear, selectedRowsData } = useTableSelectionStore();
  // const [selectedBookings, setSelectedBookings] = useState<
  //   components["schemas"]["BookingDto"][]
  // >([]);
  const r = route;
  const p = party;
  const [searchParams, setSearchParams] = useSearchParams();
  const setParams = (params: Record<string, any>) => {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value); // Update or add the parameter
      } else {
        searchParams.delete(key); // Remove the parameter if the value is empty
      }
    });
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  const onActions = (state: State) => {
    const body: components["schemas"]["UpdateBookingBatchRequestBody"] = {
      booking_ids: selectedRowsData.map((t) => t.id),
      target_state: stateToJSON(state),
    };
    fetcher.submit(
      {
        action: "update-bookings-batch",
        updateBookingsBatch: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
      onSuccessMessage: () => {
        // setSelectedBookings([])
        clear();
      },
    },
    [fetcher.data]
  );

  return (
    <ListLayout
      orderOptions={[
        { name: t("table.createdAt"), value: "created_at" },
        { name: t("form.status"), value: "status" },
      ]}
      title={t("regate._booking.base")}
      {...(permission.create && {
        onCreate: () => {
          navigate(r.toRouteDetail(r.booking, "new"));
        },
      })}
      actions={[
        {
          label: "Calendario",
          onClick: () => {
            navigate(
              r.toRoute({
                main: p.booking,
                routeSufix: ["schedule"],
              })
            );
          },
        },
      ]}
    >
      <DataLayout
        views={[
          {
            label: "Lista",
            view: "list",
            onClick: () => {},
          },
          {
            label: "Calendario",
            view: "schedule",
            onClick: () => {},
          },
        ]}
        fixedFilters={() => {
          return (
            <div className="grid gap-2 sm:flex sm:space-x-2 sm:overflow-auto  ">
              <GenericActionsDropdown
                selectedItems={selectedRowsData}
                actions={[
                  {
                    label: "Completar",
                    onClick: () => onActions(State.COMPLETED),
                    isEnabled: (bookings) =>
                      bookings.every(
                        (booking) =>
                          booking.status === "UNPAID" ||
                          booking.status === "PARTIALLY_PAID"
                      ),
                  },
                  {
                    label: "Cancelar",
                    onClick: () => onActions(State.CANCELLED),
                    isEnabled: (bookings) =>
                      bookings.some((booking) =>
                        ["UNPAID", "PARTIALLY_PAID", "COMPLETED"].includes(
                          booking.status
                        )
                      ),
                  },
                  {
                    label: "Eliminar",
                    onClick: () => onActions(State.DELETED),
                    isEnabled: (bookings) =>
                      bookings.every(
                        (booking) => booking.status === "CANCELLED"
                      ),
                  },
                ]}
              />

              <AutocompleteSearch
                data={customerFetcher.data?.customers || []}
                nameK={"name"}
                valueK={"id"}
                onValueChange={onCustomerNameChange}
                placeholder="Cliente"
                queryName="partyName"
                queryValue="party_id"
              />

              <AutocompleteSearch
                data={eventoFetcher.data?.events || []}
                nameK={"name"}
                valueK={"id"}
                queryName="eventName"
                queryValue="event_id"
                onValueChange={onEventNameChange}
                placeholder="Evento"
              />
              <AutocompleteSearch
                data={courtFetcher.data?.courts || []}
                nameK={"name"}
                valueK={"id"}
                onValueChange={onCourtNameChange}
                placeholder="Cancha"
                queryName="courtName"
                queryValue="court_id"
              />

              <AutocompleteSearch
                data={
                  [
                    { name: "Completado", value: "COMPLETED" },
                    { name: "Cancelado", value: "CANCELLED" },
                    { name: "Pagado Parcialmente", value: "PARTIALLY_PAID" },
                    { name: "No pagado", value: "UNPAID" },
                  ] as SelectItem[]
                }
                nameK={"name"}
                valueK={"value"}
                onValueChange={() => {}}
                placeholder="Estado"
                queryName="status_name"
                queryValue="status"
              />
            </div>
          );
        }}
      >
        <Outlet />
      </DataLayout>
    </ListLayout>
  );
}
