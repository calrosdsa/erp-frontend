import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";
import AccountPayableHeader from "./components/account-payable-header";
import { accountPayableSumaryColumns } from "@/components/custom/table/columns/accounting/account-payable-sumary-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ActionToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { routes } from "~/util/route";

interface LedgerData {
  Name: string;
}

export default function AccountPayableSumaryClient() {
  const { accountPayableSumary } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  const r = routes
  const navigate = useNavigate()
  const total =  useMemo(()=>{
    const totalInvoiceAmount = accountPayableSumary?.reduce((prev,acc)=>prev + acc.total_invoiced_amount,0)
    const totalPaidAmount = accountPayableSumary?.reduce((prev,acc)=>prev + acc.total_paid_amount,0)
    const totalOutstanding = Number(totalPaidAmount)-Number(totalInvoiceAmount)
    return {
      totalInvoiceAmount,
      totalPaidAmount,
      totalOutstanding,
    }
  },[accountPayableSumary])

  setUpToolbar(()=>{
    let actions: ActionToolbar[] = [];
    actions.push({
      label: t("accountPayable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountPayable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
            },
          })
        );
      },
    });
    return {
      actions:actions,
    }
  },[])
  

  return (
    <div>
      <Card>
        <CardHeader>
          <AccountPayableHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <DataTable
            data={[
              ...(accountPayableSumary || []),
              {
                total_paid_amount: total.totalPaidAmount,
                total_invoiced_amount: total.totalInvoiceAmount,
                currency: (accountPayableSumary != undefined && accountPayableSumary.length > 0)
                  ? accountPayableSumary[0]?.currency
                  : DEFAULT_CURRENCY,
              } as components["schemas"]["SumaryEntryDto"],
            ]}
            columns={accountPayableSumaryColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
