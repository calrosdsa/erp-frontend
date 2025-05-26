import {
  useFetcher,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { ButtonToolbar } from "~/types/actions";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { DEFAULT_ID, fromDate, LOADING_MESSAGE, toDate, voucherNo } from "~/constant";
import { SerializeFrom } from "@remix-run/node";

import { toast } from "sonner";
import { JournalEntryInfo } from "./tab/journal-entry-info";
import { format } from "date-fns";

export default function JournalEntryModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.journalEntry;

  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  // const data = fetcherLoader.data;
  const journalEntry = data?.journalEntry;
  const [open, setOpen] = useState(true);
  // const { journalEntry, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("info");

  const { t, i18n } = useTranslation("common");
  const journalEntryCode = searchParams.get(key);
  const navigate = useNavigate();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });
  const [toastID, setToastID] = useState<string | number>("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        route.toRouteDetail(route.journalEntry, journalEntryCode)
      );
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
        console.log("BODY", body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (journalEntryCode) {
      load();
    }
  }, [journalEntryCode]);

  const onChangeState = (e: EventState) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: journalEntry?.status || "",
      party_id: journalEntry?.id.toString() || "",
      events: [e],
    };
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: body,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.journalEntry,
          routeSufix: [journalEntry?.id.toString() || ""],
        }),
      }
    );
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        load();
      },
    },
    [fetcher.data]
  );

  setUpModalPayload(
    key,
    () => {
      const status = stateFromJSON(journalEntry?.status);
      const isNew = DEFAULT_ID == journalEntryCode;
      let view: ButtonToolbar[] = [];
      if(status == State.SUBMITTED){
        view.push({
          label:t("generalLedger"),
          onClick:()=>{
            navigate(route.to(route.generalLedger,{
              [voucherNo]:data?.journalEntry?.code,
              [fromDate]:format(new Date(journalEntry?.posting_date || new Date()),"yyyy-MM-dd"),
              [toDate]:format(new Date(journalEntry?.posting_date || new Date()),"yyyy-MM-dd"),
            }))
          }
        })
      }
      // let actions: ButtonToolbar[] = [];
      // if (permission.edit && state == State.ENABLED) {
      //   actions.push({
      //     label: "Deshabilitar",
      //     onClick: () => {
      //       onChangeState(EventState.DISABLED_EVENT);
      //     },
      //   });
      // }
      // if (permission.edit && state == State.DISABLED) {
      //   actions.push({
      //     label: "Habilitar",
      //     onClick: () => {
      //       onChangeState(EventState.ENABLED_EVENT);
      //     },
      //   });
      // }

      return {
        title: isNew ? "Nuevo asiento contable" : journalEntry?.code,
        view: isNew ? [] : view,
        // actions: isNew ? [] : actions,
        status: stateFromJSON(journalEntry?.status),
        enableEdit: isNew,
        isNew: isNew,
        onChangeState:onChangeState,
        loadData: load,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data]
  );

  const closeModal = () => {
    searchParams.delete(route.journalEntry);
    searchParams.delete("action");
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    if (!open) {
      closeModal();
    }
  }, [open]);

  return (
    <ModalLayout
      keyPayload={key}
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      className="xl:w-[90%]"
    >
      {loading && !data ? (
        <LoadingSpinner />
      ) : (
        <>
          {data && (
            <TabNavigation
              defaultValue={tab}
              onValueChange={(value) => {
                setTab(value);
                // searchParams.set("tab", value);
                // setSearchParams(searchParams, {
                //   preventScrollReset: true,
                // });
              }}
              items={[
                {
                  label: "Info",
                  value: "info",
                  children: (
                    <JournalEntryInfo
                      appContext={appContext}
                      data={data}
                      load={load}
                      permission={permission}
                      closeModal={() => setOpen(false)}
                    />
                  ),
                },
              ]}
            />
          )}
        </>
      )}
    </ModalLayout>
    // <DetailLayout
    //   activities={activities}
    //   partyID={journalEntry?.id}
    //   navItems={navItems}
    // >
    //   {tab == "info" && <CustomerInfo />}
    //   {tab == "connections" && <CustomerConnections />}
    // </DetailLayout>
  );
}
