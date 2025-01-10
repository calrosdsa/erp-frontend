import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { components, operations } from "~/sdk";
import { paymentDataSchema } from "~/util/data/schemas/accounting/payment-schema";
import { useFetcherWithPromise } from "~/util/hooks/use-fetcher-with-promise";
import { routes } from "~/util/route";
import { action as actionAccount } from "../home.accounting.account.$name/route";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import {
  formatAmount,
  formatCurrency,
  formatCurrencyAmount,
} from "~/util/format/formatCurrency";
import { i18n } from "i18next";
import { Key } from "lucide-react";

type PaymentDataType = z.infer<typeof paymentDataSchema>;
export const usePaymentData = ({
  form,
  i18n,
}: {
  form: UseFormReturn<PaymentDataType, any, undefined>;
  i18n: i18n;
}) => {
  const fetcherAccountBalance = useFetcherWithPromise<typeof actionAccount>();
  const r = routes;
  const accountBalanceService: AccountBalanceService = {
    async getAccountBalance(
      name: string,
      id: number
    ): Promise<AccountBalance | undefined> {
      try {
        const data = await fetcherAccountBalance.submit(
          {
            action: "account-balance",
            accountBalanceQuery: { id: id.toString() },
          },
          {
            action: r.toRoute({
              main: r.p.accountLedger,
              routePrefix: [r.p.accounting],
              routeSufix: [name || ""],
            }),
            method: "POST",
            encType: "application/json",
          }
        );
        return data?.balance;
      } catch (error) {
        console.error("Error fetching account balance:", error);
        return undefined;
      }
    },
    formatAmountBalance: function (
      balance?: number,
      currency?: string
    ): string {
      return formatCurrency(balance, currency, i18n.language);
    },
    setAccountValue: function (fields: Record<string, any>): void {
      Object.entries(fields).forEach(([key, value]) => {
        form.setValue(key as any, value);
        form.trigger(key as any);
      });
    },
  };

  return {
    accountBalanceService,
  };
};

type PaymentAccounts = components["schemas"]["PaymentAccountsDto"];
type AccountBalance = components["schemas"]["GeneralLedgerOpening"];

interface AccountBalanceService {
  getAccountBalance(
    name: string,
    id: number
  ): Promise<AccountBalance | undefined>;
  formatAmountBalance(balance?: number, currency?: string): string;
  setAccountValue(fields: Record<string, any>): void;
}

export interface FormService {
  setValue(field: any, value: any): void;
  trigger(field: any): void;
}

// Abstract class for party type strategy
abstract class PartyTypeStrategy {
  constructor(
    protected accountBalanceService: AccountBalanceService,
    protected formService: FormService
  ) {}

  abstract updateAccounts(): Promise<void>;

  async updateAccount(
    fieldPrefix: string,
    id: number,
    name: string,
    currency:string,
  ): Promise<void> {
    this.formService.setValue(`${fieldPrefix}`, { id, name });
    const balance = await this.accountBalanceService.getAccountBalance(
      name,
      id
    );
    if (balance) {
      console.log("BALANCE", id, name, balance);
      this.formService.setValue(
        `${fieldPrefix}Balance`,
        balance.opening_balance
      );
      this.formService.setValue(
        `${fieldPrefix}Currency`,
        currency
      );
      this.formService.trigger(`${fieldPrefix}Balance`);
      this.formService.trigger(`${fieldPrefix}Currency`);
    }
  }
}

class CustomerStrategy extends PartyTypeStrategy {
  constructor(
    protected accounts: PaymentAccounts,
    protected accountBalanceService: AccountBalanceService,
    protected formService: FormService
  ) {
    super(accountBalanceService, formService);
  }
  async updateAccounts(): Promise<void> {
    const {
      cash_acct_id,
      cash_acct,
      cash_acct_currency,
      receivable_acct_id,
      receivable_acct,
      receivable_acct_currency,
    } = this.accounts;

    await this.updateAccount("accountPaidTo", cash_acct_id, cash_acct,cash_acct_currency);
    await this.updateAccount(
      "accountPaidFrom",
      receivable_acct_id,
      receivable_acct,
      receivable_acct_currency,
    );
  }
}

class SupplierStrategy extends PartyTypeStrategy {
  constructor(
    protected accounts: PaymentAccounts,
    protected accountBalanceService: AccountBalanceService,
    protected formService: FormService
  ) {
    super(accountBalanceService, formService);
  }
  async updateAccounts(): Promise<void> {
    const { cash_acct_id, cash_acct,cash_acct_currency, payable_acct_id, payable_acct,payable_acct_currency } =
      this.accounts;

    await this.updateAccount("accountPaidTo", payable_acct_id, payable_acct,cash_acct_currency);
    await this.updateAccount("accountPaidFrom", cash_acct_id, cash_acct,payable_acct_currency);
  }
}

// Factory for creating party type strategies
export class PartyTypeStrategyFactory {
  static createStrategy(
    partyType: string,
    accounts: PaymentAccounts,
    accountBalanceService: AccountBalanceService,
    formService: FormService
  ): PartyTypeStrategy {
    switch (partyType) {
      case partyTypeToJSON(PartyType.customer):
        return new CustomerStrategy(
          accounts,
          accountBalanceService,
          formService
        );
      case partyTypeToJSON(PartyType.supplier):
        return new SupplierStrategy(
          accounts,
          accountBalanceService,
          formService
        );
      default:
        throw new Error(`Unsupported party type: ${partyType}`);
    }
  }
}
