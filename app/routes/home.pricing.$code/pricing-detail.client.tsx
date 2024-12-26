import DetailLayout from "@/components/layout/detail-layout";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { NavItem } from "~/types";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import PricingInfo from "./components/pricing-info";
import { useRef } from "react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { Entity } from "~/types/enums";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";

export default function PricingDetailClient() {
  const { pricing, actions, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = routes;
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  // const inputRef = useRef<HTMLInputElement | null>(null)
  const [permission] = usePermission({
    roleActions,
    actions:actions && actions[Entity.PRICING],
  });
  const [poPerm] = usePermission({
    roleActions,
    actions:actions && actions[Entity.PURCHASE_ORDER],
  });
  const [quoPerm] = usePermission({
    roleActions,
    actions:actions && actions[Entity.QUOTATION],
  });
  const confirmationDialog = useConfirmationDialog()
  
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.pricing,
      routePrefix: [r.accountingM],
      routeSufix: [pricing?.code || ""],
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

  const onChangeState = (e: EventState) => {
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: pricing?.status || "",
      party_id: pricing?.code || "",
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
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  setUpToolbar(
    (opts) => {
      console.log("TOOL BAR OPTS", opts);
      return {
        ...opts,
        status: stateFromJSON(pricing?.status),
        onChangeState: onChangeState,
        // onSave:()=>{
        //   console.log("SUBMIT",inputRef.current)
        //   inputRef.current?.click()
        // },
      };
    },
    [pricing, permission,poPerm,quoPerm]
  );
  return (
    <DetailLayout
      partyID={pricing?.id}
      navItems={navItems}
      activities={activities}
    >
      {tab == "info" && (
        <PricingInfo
        // inputRef={inputRef}
        />
      )}
    </DetailLayout>
  );
}
