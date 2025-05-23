import StagesHeader from "../home.stage/components/stages-header";
import DealInfoTab from "./tab/deal-info";

import ModalLayout from "@/components/ui/custom/modal-layout";
import { GlobalState } from "~/types/app-types";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import DealItemsTab from "./tab/deal-items";

import { DealViewModel } from "./deal-viewmodel";

export default function DealModal({ appContext }: { appContext: GlobalState }) {
  // const [open, setOpen] = useState(true);
  const {
    key,
    data,
    stages,
    load,
    deal,
    loading,
    setOpen,
    open,
    dealTransition,
    payload,
    tab,
    searchParams,
    setSearchParams,
  } = DealViewModel({
    appContext: appContext,
  });

  return (
    <div>
      <ModalLayout
        keyPayload={key}
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <StagesHeader
          stages={stages || []}
          selectedStageID={deal?.stage_id || payload.stage?.id}
          transition={dealTransition}
        />
        {loading && !data ? (
          <LoadingSpinner />
        ) : (
          <>
            {data && (
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
                    children: (
                      <DealInfoTab
                        appContext={appContext}
                        data={data}
                        keyPayload={key}
                        load={load}
                      />
                    ),
                  },
                  {
                    label: "Productos",
                    value: "products",
                    children: (
                      <DealItemsTab
                        appContext={appContext}
                        data={data}
                        keyPayload={key}
                      />
                    ),
                  },
                ]}
              />
            )}
          </>
        )}
      </ModalLayout>
    </div>
  );
}
