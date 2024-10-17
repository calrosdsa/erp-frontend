import { useFetcher, useLoaderData, useOutletContext, useParams, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { routes } from "~/util/route";
import { action, loader } from "./route";
import { BookingInfo } from "./components/tabs/booking-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import { EventState, RegatePartyType, regatePartyTypeToJSON, State, stateFromJSON, stateToJSON } from "~/gen/common";
import ActivityFeed from "@/components/custom-ui/activity-feed";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { ActionToolbar } from "~/types/actions";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const BookingDetailClient = () => {
  const fetcher = useFetcher<typeof action>()
  const globalState = useOutletContext<GlobalState>()
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = routes
  const {booking,actions,activities} = useLoaderData<typeof loader>()
  const {t} = useTranslation("common")
  const params = useParams()
  const {toast} = useToast()
  const [permission] = usePermission({
    roleActions:globalState.roleActions,
    actions:actions
  })
  const navTabs: NavItem[] = [
    { title: t("info"), href: r.toBookingDetail(booking?.code || "","info") },
  ];

  const updateStatus = (values:z.infer<typeof updateStateWithEventSchema>)=>{
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
    let actions:ActionToolbar[] = []
    const status = stateFromJSON(booking?.status)
    const allowEdit = permission?.edit && status != State.CANCELLED
    const isNotCompleted = allowEdit && status != State.COMPLETED
    if(isNotCompleted){
      actions.push({
        label:"Completar Reserva",
        onClick:()=>{
        const body: z.infer<typeof updateStateWithEventSchema> = {
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
        }
      })
    }
    if(allowEdit){
      actions.push({
        label:"Reprogramar la Reserva",
        onClick:()=>{
        }
      })
    }

    return {
      title:params.code,
      status:stateFromJSON(booking?.status),
      actions:actions,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: booking?.status || "",
          party_type: regatePartyTypeToJSON(RegatePartyType.booking),
          party_id: booking?.id.toString() || "",
          events: [e],
        };
        updateStatus(body)
       
      },
    }
  },[permission])

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
    {tab == "info" && 
    <BookingInfo/>
    }
    
  </DetailLayout>
  );
};
