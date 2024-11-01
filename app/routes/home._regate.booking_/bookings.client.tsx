import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { bookingColumns } from "@/components/custom/table/columns/regate/booking-columns";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import PaginationLayout from "@/components/layout/pagination-layout";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { useEventDebounceFetcher } from "~/util/hooks/fetchers/regate/useEventDebounceFetcher";
import { useCourtDebounceFetcher } from "~/util/hooks/fetchers/regate/useCourtDebounceFetcher";

export default function BookingsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [customerFetcher, onCustomerNameChange] = useCustomerDebounceFetcher();
  const [eventoFetcher, onEventNameChange] = useEventDebounceFetcher();
  const [courtFetcher, onCourtNameChange] = useCourtDebounceFetcher();
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;

  setUpToolbar(() => {
    return {
      title: t("regate._booking.base"),
      ...(permission?.create && {
        addNew: () => {
          navigate(r.toCreateBooking());
        },
      }),
    };
  }, [permission]);

  return (
    <PaginationLayout
    orderOptions={[
        {name:t("table.createdAt"),value:"created_at"},
        {name:t("form.status"),value:"status"},
    ]}
    filterOptions={()=>{
        return (
      <div className="grid gap-2 sm:flex sm:space-x-2 sm:overflow-auto  ">
        <AutocompleteSearch
          data={customerFetcher.data?.customers || []}
          nameK={"name"}
          valueK={"id"}
          onValueChange={onCustomerNameChange}
          placelholder="Cliente"
          queryName="partyName"
          queryValue="party"
        />

        <AutocompleteSearch
          data={eventoFetcher.data?.events || []}
          nameK={"name"}
          valueK={"id"}
          queryName="eventName"
          queryValue="event"
          onValueChange={onEventNameChange}
          placelholder="Evento"
        />
        <AutocompleteSearch
          data={courtFetcher.data?.courts || []}
          nameK={"name"}
          valueK={"id"}
          onValueChange={onCourtNameChange}
          placelholder="Cancha"
           queryName="courtName"
          queryValue="court"
        />
      </div>
        )
    }}>
      <DataTable
        data={paginationResult?.results || []}
        columns={bookingColumns()}
        hiddenColumns={{
          created_at: false,
        }}
        paginationOptions={{
            rowCount:paginationResult?.total
        }}
      />
    </PaginationLayout>
  );
}
