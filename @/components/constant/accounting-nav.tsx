import { CreditCardIcon, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const AccountingNav = ({
  entities,
}: {
  entities: number[] | undefined;
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes;
  let accountingChildrens: NavItem[] = [];
  if (entities?.includes(Entity.LEDGER)) {
    accountingChildrens.push({
      title: t("_ledger.chartOfAccounts"),
      href: r.chartOfAccount,
    });
  }
  if (entities?.includes(Entity.TAX_ENTITY)) {
    accountingChildrens.push({
      title: t("taxes"),
      href: r.taxes,
    });
  }
  if (entities?.includes(Entity.PAYMENT)) {
    accountingChildrens.push({
      title: t("_payment.base"),
      href: r.payment,
    });
  }
  if (entities?.includes(Entity.JOURNAL_ENTRY)) {
    accountingChildrens.push({
      title: t("journalEntry"),
      href: r.toRoute({
        main: r.journalEntry,
        routePrefix: [r.accountingM],
      }),
    });
  }

  if (entities?.includes(Entity.COST_CENTER)) {
    accountingChildrens.push({
      title: t("costCenter"),
      href: r.toRoute({
        main: r.costCenter,
        routePrefix: [r.accountingM],
      }),
    });
  }
  if (entities?.includes(Entity.FINANCIAL_STATEMENTS)) {
    accountingChildrens.push({
      title: t("profitAndLoss"),
      href: r.toRoute({
        main: r.profitAndLoss,
        routePrefix: [r.accountingM],
      }),
    });
  }
  if (entities?.includes(Entity.ACCOUNT_PAYABLE)) {
    accountingChildrens.push({
      title: t("accountPayable"),
      href: r.toRoute({
        main: r.accountPayable,
        routePrefix: [r.accountingM],
      }),
    });
  }
  if (entities?.includes(Entity.ACCOUNT_RECEIVABLE)) {
    accountingChildrens.push({
      title: t("accountReceivable"),
      href: r.toRoute({
        main: r.accountReceivable,
        routePrefix: [r.accountingM],
      }),
    });
  }
  if (entities?.includes(Entity.GENERAL_LEDGER)) {
    accountingChildrens.push({
      title: t("generalLedger"),
      href: r.toRoute({
        main: r.generalLedger,
        routePrefix: [r.accountingM],
      }),
    });
  }

  //   if (entities?.includes(Entity.PRICE_LIST_ENTITY_ID)) {
  //     accountingChildrens.push({
  //       title: t("price-list"),
  //       href: r.priceList,
  //     });
  //   }
  const accounting: NavItem = {
    title: t("accounting"),
    icon: CreditCardIcon,
    href: r.chartOfAccount,
    isChildren: true,
    children: accountingChildrens,
  };

  return accounting;
};
