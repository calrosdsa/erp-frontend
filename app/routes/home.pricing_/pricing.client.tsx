import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { chargesTemplateColumns } from "@/components/custom/table/columns/accounting/charges-templates-columns";
import { route } from "~/util/route";
import { currencyExchangeColumns } from "@/components/custom/table/columns/core/currency-exchange-columns";
import { pricingColumns } from "@/components/custom/table/columns/pricing/pricing-columns";
import { ListLayout } from "@/components/ui/custom/list-layout";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";

export default function PricingClient() {
  const { data, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const {t} = useTranslation("common")
  const navigate = useNavigate();
  const r = route;
  // setUpToolbar(() => {
  //   return {
  //     ...(permission?.create && {
  //       addNew: () => {
  //         navigate(
  //           r.toRoute({
  //             main: r.pricing,
  //             routeSufix: ["new"],
  //           })
  //         );
  //       },
  //     }),
  //   };
  // }, [permission]);
  return (
    <>
      <ListLayout
      title={t(party.pricing)}
      {...(permission.create && {
        onCreate:()=>{
          navigate(
            r.toRoute({
              main: r.pricing,
              routeSufix: ["new"],
            })
          );
        }
      })}
      >
        <DataTable
          data={data?.results || []}
          columns={pricingColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
