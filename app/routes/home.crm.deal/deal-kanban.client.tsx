import { KanbanBoard } from "@/components/layout/kanban/kanban-board";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "./route";
import DealContentHeader from "./components/deal-content-header";
import DealCard from "./components/deal-card";
import { DraggableLocation } from "@hello-pangea/dnd";
import { components } from "~/sdk";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function CrmClient() {
  const { deals, stages } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>()
  const dataTransition = (
    source: DraggableLocation<string>,
    destination: DraggableLocation<string>,
    data: components["schemas"]["DealDto"]
  ) => {
    const body:components["schemas"]["EntityTransitionData"] = {
      id: data.id,
      destination_index: destination.index,
      destination_stage_id: Number(destination.droppableId),
      source_index: source.index,
      source_stage_id: Number(source.droppableId)
    }
    fetcher.submit({
      action:"deal-transition",
      dealTransition:body
    },{
      method:"POST",
      encType:"application/json",
    })
  };

setUpToolbar(()=>{
  return {
    titleToolbar:"Deals"
  }
})

  return (
    <>
      <KanbanBoard
        stages={stages}
        data={deals}
        headerComponent={(deals,stage) => {
          return <DealContentHeader deals={deals} stage={stage}/>;
        }}
        cardComponent={(deal) => {
          return <DealCard deal={deal} />;
        }}
        dataTransition={dataTransition}
      />
      {/* {JSON.stringify(stages)} */}
    </>
  );
}
