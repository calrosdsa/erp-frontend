import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import {
  DataTable,
  useTableSelectionStore,
} from "@/components/custom/table/CustomTable";
import { eventBookingsColumns } from "@/components/custom/table/columns/regate/event-columns";
import { route } from "~/util/route";
import { useCreateEvent } from "./components/use-create-event";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import DataLayout from "@/components/layout/data-layout";
import { GenericActionsDropdown } from "../home._regate.booking/components/actions-dropdown";
import { State } from "~/gen/common";
import { components } from "~/sdk";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function EventsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const createEvent = useCreateEvent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const { clear, selectedRowsData } = useTableSelectionStore();

  const openModal = (key:string,value:string)=>{
    searchParams.set(key,value)
    setSearchParams(searchParams,{
      preventScrollReset:true
    })
  }

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
      title="Eventos"
      {...(permission.create && {
        onCreate: () => {
          createEvent.onOpenChange(true);
        },
      })}
    >
      <DataLayout
        orderOptions={[
          { name: t("table.createdAt"), value: "created_at" },
          { name: t("form.status"), value: "status" },
        ]}
        fixedFilters={() => {
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
          columns={eventBookingsColumns({
            openModal,
          })}
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          enableRowSelection={true}
        />
      </DataLayout>
    </ListLayout>
  );
}
