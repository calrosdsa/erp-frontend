import { CreditCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const BuyingNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
  let buyingChildrens:NavItem[] = [];
  if(entities?.includes(Entity.SUPPLIER)){
    buyingChildrens.push({
      title: t("supplier-groups"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.supplierGroup),
        routePrefix:[r.group],
      }),
    });
  }
  if(entities?.includes(Entity.SUPPLIER)){
    buyingChildrens.push({
      title: t("suppliers"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.supplier),
        routePrefix:[r.buyingM],
      }),
    });
  }
  if(entities?.includes(Entity.PURCHASE_ORDER)){
    buyingChildrens.push({
      title: t("purchase-orders"),
      href: r.purchaseOrders,
    });
  }
  if(entities?.includes(Entity.PURCHASE_INVOICE)){
    buyingChildrens.push({
      title: t("purchase-invoice"),
      href: r.purchaseInvoices,
    });
  }

  if(entities?.includes(Entity.PURCHASE_RECEIPT)){
    buyingChildrens.push({
      title: t("_receipt.f",{o:t("_purchase.base")}),
      href:r.toReceipts(PartyType.purchaseReceipt)
    })
  }

  const buying:NavItem = {
    title: t("form.buying"),
    icon: CreditCardIcon,
    href: r.buying,
    isChildren: true,
    children: buyingChildrens,
  }


  return buying
}