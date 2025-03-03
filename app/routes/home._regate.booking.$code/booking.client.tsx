import { useFetcher, useLoaderData, useOutletContext, useParams, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { route } from "~/util/route";
import { action, loader } from "./route";
import { BookingInfo } from "./components/tabs/booking-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import { EventState, RegatePartyType, regatePartyTypeToJSON, State, stateFromJSON, stateToJSON } from "~/gen/common";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { ButtonToolbar } from "~/types/actions";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EditPaidAmount, useEditPaidAmount } from "./components/edit-paid-amount";
import { RescheduleBooking, useRescheduleBooking } from "./components/reschedule-booking";

export const BookingDetailClient = () => {
  const fetcher = useFetcher<typeof action>()
  const globalState = useOutletContext<GlobalState>()
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = route
  const {booking,actions,activities} = useLoaderData<typeof loader>()
  const {t} = useTranslation("common")
  const params = useParams()
  const {toast} = useToast()
  const editPaidAmount = useEditPaidAmount()
  const rescheduleBooking = useRescheduleBooking()
  const [permission] = usePermission({
    roleActions:globalState.roleActions,
    actions:actions
  })
  const navTabs: NavItem[] = [
    { title: t("info"), href: r.toBookingDetail(booking?.code || "","info") },
  ];

  const updateStatus = (values:z.infer<typeof updateStatusWithEventSchema>)=>{
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: values,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  }

  setUpToolbar(()=>{
    console.log("SET UP TOOLBAR")
    let actions:ButtonToolbar[] = []
    const status = stateFromJSON(booking?.status)
    const allowEdit = permission?.edit && status != State.CANCELLED
    const isNotCompleted = allowEdit && status != State.COMPLETED
    if(isNotCompleted){
      actions.push({
        label:"Completar Reserva",
        onClick:()=>{
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: booking?.status || "",
          party_type: regatePartyTypeToJSON(RegatePartyType.booking),
          party_id: booking?.id.toString() || "",
          events: [EventState.COMPLETED_EVENT],
        };
        updateStatus(body)
        }
      })
    }
    if(isNotCompleted){
      actions.push({
        label:"Agregar pago",
        onClick:()=>{
          editPaidAmount.onOpenDialog({
            booking:booking,
          })
        }
      })
    }
    if(allowEdit){
      actions.push({
        label:"Reprogramar la Reserva",
        onClick:()=>{
          rescheduleBooking.openDialog({
            booking:booking
          })
        }
      })
    }

    return {
      titleToolbar:params.code,
      status:stateFromJSON(booking?.status),
      actions:actions,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: booking?.status || "",
          party_type: regatePartyTypeToJSON(RegatePartyType.booking),
          party_id: booking?.id.toString() || "",
          events: [e],
        };
        updateStatus(body)
       
      },
    }
  },[permission,booking])

  useEffect(()=>{
    if(fetcher.data?.error){
      toast({
        title:fetcher.data.error
      })
    }
    if(fetcher.data?.message){
      toast({
        title:fetcher.data.message
      })
    }
  },[fetcher.data])
  return (
    <DetailLayout navItems={navTabs} activities={activities} partyID={booking?.id}>
      {editPaidAmount.open &&
      <EditPaidAmount
      open={editPaidAmount.open}
      onOpenChange={editPaidAmount.onOpenChange}
      />
      }

      {rescheduleBooking.open && 
      <RescheduleBooking
      open={rescheduleBooking.open}
      onOpenChange={rescheduleBooking.onOpenChange}
      booking={rescheduleBooking.booking}
      />
      }

    {tab == "info" && 
    <BookingInfo/>
    }
    
  </DetailLayout>
  );
};
