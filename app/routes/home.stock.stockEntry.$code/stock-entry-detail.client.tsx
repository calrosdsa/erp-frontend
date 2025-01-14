import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import StockEntryInfo from "./tab/stock-entry-info";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { usePermission } from "~/util/hooks/useActions";
import { Entity } from "~/types/enums";
import { GlobalState } from "~/types/app";
import { ButtonToolbar } from "~/types/actions";
import { useStatus } from "~/util/hooks/data/useStatus";
import { format, toZonedTime } from "date-fns-tz";

export default function StockEntryDetailClient() {
  const { stockEntry, associatedActions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  const navigate = useNavigate()
  const [gLPermission] = usePermission({
    actions: associatedActions && associatedActions[Entity.GENERAL_LEDGER],
    roleActions: roleActions,
  });

  const { isSubmitted } = useStatus({
    status: stateFromJSON(stockEntry?.status),
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.stockEntry,
      routePrefix: [r.stock],
      routeSufix: [stockEntry?.code || ""],
      q: {
        tab: tab,
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("form.name"),
      href: toRoute("info"),
    },
  ];

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "STATE",
    },
    [fetcher.state]
  );

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    if (isSubmitted && gLPermission?.view) {
        view.push({
          label: t("accountingLedger"),
          onClick: () => {
            navigate(
              r.toRoute({
                main: "generalLedger",
                routePrefix: [r.accountingM],
                q: {
                  voucherNo: stockEntry?.code,
                },
              })
            );
          },
        });
      }
      view.push({
        label: t("stockLedger"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.stockLedger,
              routePrefix: [r.stockM],
              q: {
                fromDate:format(toZonedTime(stockEntry?.posting_date || "","UTC"),"yyyy-MM-dd"),
                toDate:format(toZonedTime(stockEntry?.posting_date || "","UTC"),"yyyy-MM-dd"),
                voucherNo:stockEntry?.code,
              },
            })
          );
        },
      });
    return {
      titleToolbar: `${t("stockEntry")}(${stockEntry?.code})`,
      status: stateFromJSON(stockEntry?.status),
      view:view,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: stockEntry?.status || "",
          party_id: stockEntry?.code || "",
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
  }, [stockEntry,gLPermission]);
  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
    },
    [fetcher.data]
  );
  return (
    <DetailLayout partyID={stockEntry?.id} navItems={navItems}>
      {tab == "info" && <StockEntryInfo />}
    </DetailLayout>
  );
}
