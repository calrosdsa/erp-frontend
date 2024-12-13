import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
import { eventBookingsColumns } from "@/components/custom/table/columns/regate/event-columns";
import { routes } from "~/util/route";
import { useCreateEvent } from "./components/use-create-event";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import PaginationLayout from "@/components/layout/pagination-layout";
import { GenericActionsDropdown } from "../home._regate.booking_/components/actions-dropdown";
import { State } from "~/gen/common";
import { components } from "~/sdk";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function EventsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const createEvent = useCreateEvent();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const { clear, selectedRowsData } = useTableSelectionStore();


  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
      onSuccessMessage:()=>{
        // setSelectedBookings([])
        clear()
      }
    },
    [fetcher.data]
  );


  setUpToolbar(() => {
    return {
      titleToolbar: "Eventos",
      ...(permission?.create && {
        addNew: () => {
          createEvent.onOpenChange(true);
        },
      }),
    };
  }, [permission]);
  return (
    <div>
      <PaginationLayout
        orderOptions={[
          { name: t("table.createdAt"), value: "created_at" },
          { name: t("form.status"), value: "status" },
        ]}
        filterOptions={() => {
          return (
            <div className="grid gap-2 sm:flex sm:space-x-2 sm:overflow-auto  ">
              <GenericActionsDropdown
                selectedItems={selectedRowsData}
                actions={[
                  {
                    label: "Eliminar",
                    onClick: () => {
                      const body: components["schemas"]["DeleteEventBatchRequestBody"] =
                        {
                          event_ids: selectedRowsData.map((t) => t.id),
                        };
                      fetcher.submit(
                        {
                          action: "delete-in-batch",
                          deleteInBatch: body,
                        },
                        {
                          encType: "application/json",
                          method: "POST",
                        }
                      );
                    },
                    isEnabled: (e) => e.every((t) => t.status === "CANCELLED"),
                  },
                ]}
              />
            </div>
          );
        }}
      >
        <DataTable
          data={paginationResult?.results || []}
          columns={eventBookingsColumns()}
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          enableRowSelection={true}
        />
      </PaginationLayout>
    </div>
  );
}
