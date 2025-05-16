import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useNewBooking } from "../../store/use-new-booking";
import { components } from "~/sdk";
import generateBookingData from "../../util/util-new";
import { ValidateBooking } from "../validate-booking";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import { action } from "../../route";
import CreateBookings from "../create-bookings";

export const CreateBookingModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const key = "booking-new";
  const fetcher = useFetcher<typeof action>({ key: "booking-data" });
  const { payload } = useNewBooking();

  const onBookingPayload = () => {
    console.log("PAYLOAD",payload,)
    if (!payload)  return
    console.log("PROCESS BOOKING/....")
      const body: components["schemas"]["ValidateBookingData"] = {
        bookings: generateBookingData(
          Number(payload.court),
          payload.courtName || "",
          payload.slots || []
        ),
      };
      fetcher.submit(
        {
          action: "validate-booking-data",
          validateBookingData: body,
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
  };

  useEffect(() => {
    if (payload) {
      onBookingPayload();
    }
  }, [payload]);
  setUpModalPayload(
    key,
    () => {
      return {
        isNew: true,
      };
    },
    []
  );
  return (
    <ModalLayout
      title="Crear Reserva"
      keyPayload={key}
      open={open}
      onOpenChange={onOpenChange}
    >
      {fetcher.state == "submitting" ? (
        <LoadingSpinner className="h-[70vh]" size="lg" />
      ) : fetcher.data?.bookingData && fetcher.data.bookingData ? (
        <CreateBookings data={fetcher.data.bookingData} keyPayload={key}
        closeModal={()=>onOpenChange(false)} />
      ) : (
        <ValidateBooking keyPayload={key} />
      )}
    </ModalLayout>
  );
};
