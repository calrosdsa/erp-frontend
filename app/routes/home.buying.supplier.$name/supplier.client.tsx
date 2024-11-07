import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import SupplierInfo from "./tab/supplier-info";
import { NavItem } from "~/types";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { ActionToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";

export default function SupplierClient() {
  const { supplier, actions, addresses, contacts } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyTypeToJSON(PartyType.supplier),
        routePrefix: [r.buyingM],
        routeSufix: [supplier?.name || ""],
        q: {
          tab: "info",
          id: supplier?.uuid,
        },
      }),
    },
  ];

  setUpToolbar(() => {
    let actions: ActionToolbar[] = [];
    actions.push({
      label: t("accountingLedger"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.generalLedger,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              partyName: supplier?.name,
              party: supplier?.id.toString(),
              partyType: partyTypeToJSON(PartyType.supplier),
            },
          })
        );
      },
    });
    actions.push({
      label: t("accountsPayable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountPayable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              parties: encodeURIComponent(JSON.stringify([supplier?.id])),
            },
          })
        );
      },
    });
    return {
      actions: actions,
    };
  }, []);
  return (
    <DetailLayout navItems={navItems} partyID={supplier?.id}>
      {tab == "info" && <SupplierInfo />}
    </DetailLayout>
  );
}
