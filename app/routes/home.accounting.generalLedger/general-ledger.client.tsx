import React, { useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import GeneralLedgerHeader from "./components/general-ledger-header";
import { generalLedgerColumns } from "@/components/custom/table/columns/accounting/general-ledger-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { DEFAULT_CURRENCY } from "~/constant";
import { components } from "~/sdk";
import type { loader } from "./route";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ResizableVirtualizedTable } from "@/components/custom/table/ResizableTable";

type GeneralLedgerEntryDto = components["schemas"]["GeneralLedgerEntryDto"];

export default function GeneralLedgerClient() {
  const { generalLedger, opening } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");

  const transactions = useMemo(() => {
    if (!generalLedger || generalLedger.length === 0) {
      return [];
    }

    const openingBalance = Number(opening?.opening_balance) || 0;
    let runningBalance = openingBalance;

    const transactionsWithBalance = generalLedger.map((transaction) => {
      const amount = runningBalance + (transaction.debit - transaction.credit);
      runningBalance = amount;

      return {
        ...transaction,
        balance: amount,
      };
    });

    return [
      {
        currency:
          transactionsWithBalance.length > 0
            ? transactionsWithBalance[0]?.currency
            : DEFAULT_CURRENCY,
        account: "Opening",
        balance: openingBalance,
        debit: Number(opening?.debit),
        credit: Number(opening?.credit),
      } as GeneralLedgerEntryDto,
      ...transactionsWithBalance,
    ];
  }, [generalLedger, opening]);

  const total = useMemo(() => {
    const totalDebit =
      generalLedger?.reduce((prev, acc) => prev + acc.debit, 0) || 0;
    const totalCredit =
      generalLedger?.reduce((prev, acc) => prev + acc.credit, 0) || 0;
    const totalBalance = totalCredit - totalDebit;

    return {
      totalDebit,
      totalCredit,
      totalBalance,
    };
  }, [generalLedger]);

  const dataWithTotal = useMemo(() => {
    const totalBalance = total.totalDebit - total.totalCredit
    return [
      ...transactions,
      {
        account: "Total",
        credit: total.totalCredit,
        debit: total.totalDebit,
        currency:
          transactions.length > 0
            ? transactions[0]?.currency
            : DEFAULT_CURRENCY,
        balance: totalBalance,
      } as GeneralLedgerEntryDto,
      {
        account: "Closing (Opening + Total)",
        credit: total.totalCredit + Number(opening?.credit),
        debit: total.totalDebit + Number(opening?.debit),
        currency:
          transactions.length > 0
            ? transactions[0]?.currency
            : DEFAULT_CURRENCY,
        balance: Number(opening?.opening_balance) + totalBalance,
      } as GeneralLedgerEntryDto,
    ];
  }, [transactions, total]);

  setUpToolbar(() => ({}), []);

  return (
    <div>
      <Card>
        <CardHeader>
          <GeneralLedgerHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
      <ScrollArea className="w-full rounded-md border">
          <ResizableVirtualizedTable data={dataWithTotal} columns={generalLedgerColumns({})} />
          <ScrollBar orientation="horizontal" />
      </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
