import { CreditCardIcon, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app-types";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const AccountingNav = ({
  entities,
}: {
  entities: number[] | undefined;
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route;
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
  if(entities?.includes(Entity.CHARGES_TEMPLATE)){
    accountingChildrens.push({
      title: t("chargesTemplate"),
      href:r.toRoute({
        main:r.chargesTemplate,
        routePrefix: [r.accountingM]
      })
    })
  }

  if(entities?.includes(Entity.CURRENCY_EXCHANGE)){
    accountingChildrens.push({
      title: t("currencyExchange"),
      href:r.toRoute({
        main:r.currencyExchange,
      })
    })
  }

  
  const accounting: NavItem = {
    title: t("accounting"),
    icon: CreditCardIcon,
    href: r.chartOfAccount,
    isChildren: true,
    children: accountingChildrens,
  };

  return accounting;
};
