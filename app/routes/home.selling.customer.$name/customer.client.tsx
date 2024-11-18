import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";
import CustomerInfo from "./components/tab/customer-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CustomerConnections from "./components/tab/customer-connections";
import { ButtonToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export default function CustomerClient() {
  const { customer, actions, activities } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const params = useParams();
  const navigate = useNavigate()
  const navItems = [
    {
      title: t("info"),
      href: r.toCustomerDetail(customer?.name || "", customer?.uuid || ""),
    },
    {
      title: t("connections"),
      href: r.toCustomerDetail(
        customer?.name || "",
        customer?.uuid || "",
        "connections"
      ),
    },
  ];

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    view.push({
      label: t("accountingLedger"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.generalLedger,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              partyName: customer?.name,
              party: customer?.id.toString(),
              partyType: partyTypeToJSON(PartyType.supplier),
            },
          })
        );
      },
    });
    view.push({
      label: t("accountReceivable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountReceivable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
              party: customer?.id.toString(),
              partyName:customer?.name,
            },
          })
        );
      },
    });
    return {
      view: view,
    };
  }, []);

  

  return (
    <DetailLayout
      activities={activities}
      partyID={customer?.id}
      navItems={navItems}
    >
      {tab == "info" && <CustomerInfo />}
      {tab == "connections" && <CustomerConnections />}
    </DetailLayout>
  );
}
