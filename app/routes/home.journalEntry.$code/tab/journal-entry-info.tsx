import { GlobalState } from "~/types/app-types";
import { SerializeFrom } from "@remix-run/node";
import { route } from "~/util/route";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";

import { toast } from "sonner";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Entity } from "~/types/enums";
import { SmartForm } from "@/components/form/smart-form";
import { useTranslation } from "react-i18next";
import { usePermission } from "~/util/hooks/useActions";

import { action, loader } from "../route";
import {
  JournalEntrySchema,
  journalEntrySchema,
  mapToJournalEntryLineSchama,
} from "~/util/data/schemas/accounting/journal-entry-schema";
import JournalEntryForm from "../journal-entry-form";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Permission } from "~/types/permission";
import { toZonedTime } from "date-fns-tz";
import { State } from "~/gen/common";

export const JournalEntryInfo = ({
  appContext,
  data,
  load,
  closeModal,
  permission,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  load: () => void;
  closeModal: () => void;
  permission: Permission;
}) => {
  const key = route.journalEntry;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const journalEntry = data?.journalEntry;
  const fetcher = useFetcher<typeof action>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.journalEntry);
  const { t } = useTranslation("common");
  const onSubmit = (e: JournalEntrySchema) => {
    console.log("ONSUBMIT", e);
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-journalEntry" : "edit-journalEntry";
    fetcher.submit(
      {
        action,
        journalEntryData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.journalEntry, journalEntry?.code),
      }
    );
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (id == DEFAULT_ID) {
          if (fetcher.data?.journalEntry) {
            searchParams.set(
              route.journalEntry,
              fetcher.data?.journalEntry.code.toString()
            );
            setSearchParams(searchParams, {
              preventScrollReset: true,
              replace: true,
            });
          }
        } else {
          load();
        }
      },
    },
    [fetcher.data]
  );
  return (
    <div className="grid grid-cols-8 gap-3">
      <div className="col-span-5">
        <SmartForm
          isNew={payload.isNew || false}
          title={t("info")}
          schema={journalEntrySchema}
          keyPayload={key}
          permission={permission}
          defaultValues={{
            id: journalEntry?.id,
            postingDate: journalEntry?.posting_date
              ? toZonedTime(journalEntry.posting_date, "UTC")
              : new Date(),
            entryType: journalEntry?.entry_type,
            lines: data?.lines?.map((item) =>
              mapToJournalEntryLineSchama(item)
            ),
          }}
          onSubmit={onSubmit}
        >
          <JournalEntryForm permission={permission} />
        </SmartForm>
      </div>
      {journalEntry?.id != undefined && (
        <div className=" col-span-3">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={journalEntry?.id}
            partyName={journalEntry.code}
            entityID={Entity.JOURNAL_ENTRY}
          />
        </div>
      )}
    </div>
  );
};
