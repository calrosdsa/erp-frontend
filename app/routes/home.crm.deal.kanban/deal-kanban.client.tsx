import { KanbanBoard } from "@/components/layout/kanban/kanban-board";
import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import DealContentHeader from "./components/deal-content-header";
import DealCard from "./components/deal-card";

export default function CrmClient() {
  const { deals, stages } = useLoaderData<typeof loader>();
  
  return (
    <>
      <KanbanBoard
        stages={stages}
        data={deals}
        headerComponent={(deals) => {
          return <DealContentHeader deals={deals} />;
        }}
        cardComponent={(deal) => {
          return <DealCard deal={deal} />;
        }}
      />
      {/* {JSON.stringify(stages)} */}
    </>
  );
}
