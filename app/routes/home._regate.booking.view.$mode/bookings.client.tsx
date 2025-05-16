import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
import {
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { bookingColumns } from "@/components/custom/table/columns/regate/booking-columns";
import { route } from "~/util/route";
import { components } from "~/sdk";
import { State, stateToJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";
import FieldReservation from "./components/field-reservation";

export default function BookingsClient() {
  const { paginationResult, actions, bookingSlots, courtRates } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { clear, selectedRowsData } = useTableSelectionStore();
  const params = useParams();

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

  return (
    <>
      {params.mode == "list" && (
        <DataTable
          data={paginationResult?.results || []}
          columns={bookingColumns({
            setParams,
            i18n,
            t,
          })}
          hiddenColumns={{
            created_at: false,
          }}
          enableRowSelection={true}
          enableSizeSelection={true}
        />
      )}
      {params.mode == "schedule" && (
        <FieldReservation schedules={courtRates} reservations={bookingSlots} />
      )}
    </>
  );
}
