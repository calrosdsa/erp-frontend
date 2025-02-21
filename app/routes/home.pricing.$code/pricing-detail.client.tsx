import DetailLayout from "@/components/layout/detail-layout";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { NavItem } from "~/types";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  setUpToolbarDetailPage,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import PricingInfo from "./components/pricing-info";
import { useRef } from "react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { Entity } from "~/types/enums";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import PricingConnections from "./components/pricing-connections";

export default function PricingDetailClient() {
  const { pricing, actions, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  // const inputRef = useRef<HTMLInputElement | null>(null)
  const [permission] = usePermission({
    roleActions,
    actions: actions && actions[Entity.PRICING],
  });
  const [poPerm] = usePermission({
    roleActions,
    actions: actions && actions[Entity.PURCHASE_ORDER],
  });
  const [quoPerm] = usePermission({
    roleActions,
    actions: actions && actions[Entity.QUOTATION],
  });
  const confirmationDialog = useConfirmationDialog();
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.pricing,
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
    {
      title: t("connections"),
      href: toRoute("connections"),
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

  setUpToolbarRegister(
    () => {
      return {
        status: stateFromJSON(pricing?.status),
        onChangeState: onChangeState,
      };
    },
    [pricing, permission, poPerm, quoPerm]
  );
  return (
    <DetailLayout
      partyID={pricing?.id}
      navItems={navItems}
      activities={activities}
    >
      {/* {JSON.stringify(pricing)} */}
      {tab == "info" && <PricingInfo />}
      {tab == "connections" && <PricingConnections />}
    </DetailLayout>
  );
}
