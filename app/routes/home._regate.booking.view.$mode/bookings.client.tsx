import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
import {
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { bookingColumns } from "@/components/custom/table/columns/regate/booking-columns";
import { route } from "~/util/route";
import { components } from "~/sdk";
import { State, stateToJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { party } from "~/util/party";

export default function BookingsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();  
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
  
        <DataTable
          data={paginationResult?.results || []}
          columns={bookingColumns({
            setParams,
          })}
          hiddenColumns={{
            created_at: false,
          }}
          enableRowSelection={true}
          enableSizeSelection={true}
        />
      
  );
}
