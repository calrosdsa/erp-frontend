import { KanbanBoard } from "@/components/layout/kanban/kanban-board";
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
import { ListLayout } from "@/components/ui/custom/list-layout";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useState } from "react";
import ActivityDeadlineTab from "../home.activity/tab/activity-deadline-tab";
import { Entity } from "~/types/enums";

export default function CrmClient() {
  const { deals, stages, actions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const appContext = useOutletContext<GlobalState>();
  const { companyDefaults, roleActions } = appContext;
  const [searchParams, setSearchParams] = useSearchParams();
  const [permission] = usePermission({
    actions: actions,
    roleActions: roleActions,
  });

  const [selectedDeal, setSelectedDeal] = useState<
    components["schemas"]["DealDto"] | undefined
  >(undefined);
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
      {selectedDeal && (
        <DrawerLayout
          open={selectedDeal != undefined}
          onOpenChange={() => setSelectedDeal(undefined)}
          className=""
        >
          <ActivityDeadlineTab
            partyID={selectedDeal.id}
            partyName={selectedDeal.name}
            entityID={Entity.DEAL}
            appContext={appContext}
            defaultSelected={true}
            className="p-1"
            defaultFocused={true}
            onClose={() => setSelectedDeal(undefined)}
          />
        </DrawerLayout>
      )}
      <ListLayout
        title="Tratos"
        {...(permission.create && {
          onCreate: () => {
            openModal(route.deal, DEFAULT_ID);
          },
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
              <DealCard
                deal={deal}
                currency={currency}
                openModal={openModal}
                openActivity={(deal) => setSelectedDeal(deal)}
              />
            );
          }}
          dataTransition={dataTransition}
        />
        {/* {JSON.stringify(stages)} */}
      </ListLayout>
    </>
  );
}
