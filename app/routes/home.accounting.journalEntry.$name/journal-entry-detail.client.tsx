import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { NavItem } from "~/types";
import JournalEntryInfo from "./tab/journal-entry-info";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { stateFromJSON } from "~/gen/common";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function JournalEntryDetailClient() {
  const { journalEntry } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = routes;
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.journalEntry,
      routePrefix: [r.accountingM],
      routeSufix: [journalEntry?.code || ""],
      q: {
        tab: tab,
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  useLoadingTypeToolbar({
    loading:fetcher.state == "submitting",
    loadingType:"STATE"
  }, [fetcher.state]);

  setUpToolbar(() => {
    return {
      titleToolbar: `${t("journalEntry")}(${journalEntry?.code})`,
      status: stateFromJSON(journalEntry?.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: journalEntry?.status || "",
          party_id: journalEntry?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-status-with-event",
            updateStatusWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    };
  }, [journalEntry]);

  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
  },[fetcher.data])
  return (
    <DetailLayout partyID={journalEntry?.id} navItems={navItems}>
      {tab == "info" && <JournalEntryInfo />}
    </DetailLayout>
  );
}
