import {
  KanbanBoard,
  KanbanColumn,
} from "@/components/layout/kanban/kanban-board";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DealContentHeader from "./components/deal-content-header";
import DealCard from "./components/deal-card";
import { DraggableLocation } from "@hello-pangea/dnd";
import { components } from "~/sdk";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { DEFAULT_CURRENCY, DEFAULT_ID } from "~/constant";
import MentionTextarea from "../home.activity/components/activity-comment";
import { TimePicker } from "@/components/custom/datetime/time-picker";
import { useState } from "react";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";

export default function CrmClient() {
  const { deals, stages,actions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults,roleActions } = useOutletContext<GlobalState>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    actions:actions,
    roleActions:roleActions
  })
  const currency = companyDefaults?.currency || DEFAULT_CURRENCY;
  const dataTransition = (
    source: DraggableLocation<string>,
    destination: DraggableLocation<string>,
    data: components["schemas"]["DealDto"],
    srcColumn: string,
    tgtColumn: string
  ) => {
    const body: components["schemas"]["EntityTransitionData"] = {
      id: data.id,
      destination_index: destination.index,
      destination_stage_id: Number(destination.droppableId),
      source_index: source.index,
      source_stage_id: Number(source.droppableId),
      source_name: srcColumn,
      destination_name: tgtColumn,
    };
    fetcher.submit(
      {
        action: "deal-transition",
        dealTransition: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: "Deals",
    };
  });

  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return (
    <>
      <ListLayout
      title="Tratos"
       {...(permission.create && {
          onCreate:()=>{
            openModal(route.deal,DEFAULT_ID)
          }
        })}
      >
        <KanbanBoard
          stages={stages}
          data={deals}
          headerComponent={(deals, stage) => {
            return (
              <DealContentHeader
                deals={deals}
                stage={stage}
                openModal={openModal}
                currency={currency}
              />
            );
          }}
          cardComponent={(deal) => {
            return (
              <DealCard deal={deal} currency={currency} openModal={openModal} />
            );
          }}
          dataTransition={dataTransition}
        />
        {/* {JSON.stringify(stages)} */}
      </ListLayout>
    </>
  );
}
