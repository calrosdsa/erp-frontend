import { KanbanBoard, KanbanColumn } from "@/components/layout/kanban/kanban-board";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "./route";
import DealContentHeader from "./components/deal-content-header";
import DealCard from "./components/deal-card";
import { DraggableLocation } from "@hello-pangea/dnd";
import { components } from "~/sdk";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { DEFAULT_CURRENCY } from "~/constant";
import MentionTextarea from "../home.activity/components/activity-comment";
import { TimePicker } from "@/components/custom/datetime/time-picker";
import { useState } from "react";

export default function CrmClient() {
  const { deals, stages } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const currency = companyDefaults?.currency || DEFAULT_CURRENCY;
  const dataTransition = (
    source: DraggableLocation<string>,
    destination: DraggableLocation<string>,
    data: components["schemas"]["DealDto"],
    srcColumn:string,
    tgtColumn:string
  ) => {
    const body: components["schemas"]["EntityTransitionData"] = {
      id: data.id,
      destination_index: destination.index,
      destination_stage_id: Number(destination.droppableId),
      source_index: source.index,
      source_stage_id: Number(source.droppableId),
      source_name:srcColumn,
      destination_name:tgtColumn,
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

  return (
    <>
      <KanbanBoard
        stages={stages}
        data={deals}
        headerComponent={(deals, stage) => {
          return (
            <DealContentHeader
              deals={deals}
              stage={stage}
              currency={currency}
            />
          );
        }}
        cardComponent={(deal) => {
          return <DealCard deal={deal} currency={currency} />;
        }}
        dataTransition={dataTransition}
      />
      {/* {JSON.stringify(stages)} */}
    </>
  );
}
