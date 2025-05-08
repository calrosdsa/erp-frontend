import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { route } from "~/util/route";
import { action, loader } from "./route";
import { BookingInfo } from "./components/tabs/booking-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import {
  EventState,
  RegatePartyType,
  regatePartyTypeToJSON,
  State,
  stateFromJSON,
  stateToJSON,
} from "~/gen/common";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { ButtonToolbar } from "~/types/actions";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  EditPaidAmount,
  useEditPaidAmount,
} from "./components/edit-paid-amount";
import {
  RescheduleBooking,
  useRescheduleBooking,
} from "./components/reschedule-booking";
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { toast } from "sonner";
import { LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const BookingModal = ({ appContext }: { appContext: GlobalState }) => {
  const key = route.booking;
  const fetcher = useFetcher<typeof action>();
  const fetcherLoader = useFetcher<typeof loader>({ key: "booking" });
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const bookingID = searchParams.get("booking") || "";
  const r = route;
  const data = fetcherLoader.data;
  const booking = data?.booking;
  const { t } = useTranslation("common");
  const params = useParams();
  const [open, setOpen] = useState(true);
  const editPaidAmount = useEditPaidAmount();
  const rescheduleBooking = useRescheduleBooking();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });
  const [toastID, setToastID] = useState<string | number>("");
  const { onOpenDialog } = useConfirmationDialog();

  const updateStatus = (
    values: z.infer<typeof updateStatusWithEventSchema>
  ) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: values,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.booking,
          routeSufix: [booking?.id.toString() || ""],
        }),
      }
    );
  };

  setUpModalPayload(
    key,
    () => {
      console.log("SET UP TOOLBAR");
      let actions: ButtonToolbar[] = [];
      const status = stateFromJSON(booking?.status);
      const allowEdit = permission?.edit && status != State.CANCELLED;
      const isNotCompleted = allowEdit && status != State.COMPLETED;
      if (isNotCompleted) {
        actions.push({
          label: "Completar Reserva",
          onClick: () => {
            const body: z.infer<typeof updateStatusWithEventSchema> = {
              current_state: booking?.status || "",
              party_type: regatePartyTypeToJSON(RegatePartyType.booking),
              party_id: booking?.id.toString() || "",
              events: [EventState.COMPLETED_EVENT],
            };
            onOpenDialog({
              title:
                "Por favor, confirme antes de continuar con la acción requerida.",
              onConfirm: () => {
                updateStatus(body);
              },
            });
          },
        });
      }
      if (isNotCompleted) {
        actions.push({
          label: "Agregar pago",
          onClick: () => {
            editPaidAmount.onOpenDialog({
              booking: booking,
            });
          },
        });
      }
      if (allowEdit) {
        actions.push({
          label: "Reprogramar la Reserva",
          onClick: () => {
            rescheduleBooking.openDialog({
              booking: booking,
            });
          },
        });
      }
      if (status == State.CANCELLED) {
        actions.push({
          label: "Eliminar Reserva",
          onClick: () => {},
        });
      }
      return {
        titleToolbar: params.code,
        status: stateFromJSON(booking?.status),
        actions: actions,
        onChangeState: (e) => {
          const body: z.infer<typeof updateStatusWithEventSchema> = {
            current_state: booking?.status || "",
            party_type: regatePartyTypeToJSON(RegatePartyType.booking),
            party_id: booking?.id.toString() || "",
            events: [e],
          };
          updateStatus(body);
        },
      };
    },
    [permission, booking]
  );

  const initData = () => {
    fetcherLoader.submit(
      {},
      {
        action: route.toRoute({
          main: route.booking,
          routeSufix: [bookingID],
        }),
      }
    );
  };
  useEffect(() => {
    initData();
  }, []);

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.eventData?.events[0] == EventState.DELETED_EVENT) {
          setOpen(false);
        }
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.booking);
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
      title={booking?.code || ""}
      keyPayload={key}
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
                children: <BookingInfo appContext={appContext} />,
              },
            ]}
          />
        </>
      )}

      {editPaidAmount.open && (
        <EditPaidAmount
          open={editPaidAmount.open}
          onOpenChange={editPaidAmount.onOpenChange}
        />
      )}

      {rescheduleBooking.open && (
        <RescheduleBooking
          open={rescheduleBooking.open}
          onOpenChange={rescheduleBooking.onOpenChange}
          booking={rescheduleBooking.booking}
        />
      )}
    </ModalLayout>
  );
};
