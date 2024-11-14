import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { components } from "~/sdk";
import  { ProfitLossStatement } from "./profit-loss-component";
import { endOfMonth, startOfMonth, startOfYear } from "date-fns";
type GroupedAccounts = {
  [accountType: string]: {
    [date: string]: AccountEntry[];
  };
};
type AccountEntry = components["schemas"]["ProfitAndLossEntryDto"];
export default function ProfitAndLossClient() {
  const { profitAndLoss } = useLoaderData<typeof loader>();
  // function groupAccountEntries(entries: AccountEntry[]): GroupedAccounts {
  //     return entries.reduce((acc, entry) => {
  //       if (!acc[entry.account_type]) {
  //         acc[entry.account_type] = {};
  //       }
  //       if (!acc[entry.account_type][entry.date]) {
  //         acc[entry.account_type][entry.date] = [];
  //       }
  //       acc[entry.account_type][entry.date].push(entry);
  //       return acc;
  //     }, {} as GroupedAccounts);
  //   }

  return (
    <div>
      {JSON.stringify(profitAndLoss)}
      <ProfitLossStatement
           data={profitAndLoss || []}
           startDate={startOfYear(new Date)}
           endDate={endOfMonth(new Date())}
           />

      {/* <ProfitLossDemo /> */}
    </div>
  );
}
