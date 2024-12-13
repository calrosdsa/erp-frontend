import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
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

export default function EventsClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t } = useTranslation("common");
  const createEvent = useCreateEvent();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const { clear, selectedRowsData } = useTableSelectionStore();
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
                actions={ [
                    {
                      label: "Eliminar",
                      onClick: () => {},
                      isEnabled: (e) => e.every(
                        t => t.status === "CANCELLED"
                      ),
                    },
                  ]}
              />
            </div>
          );
        }}
      >
        {JSON.stringify(selectedRowsData)}
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
