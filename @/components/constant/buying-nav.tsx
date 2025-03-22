import { CreditCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app-types";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const BuyingNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route
  let buyingChildrens:NavItem[] = [];
  if(entities?.includes(Entity.SUPPLIER)){
    buyingChildrens.push({
      title: t("supplierGroup"),
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
      title: t("purchaseOrder"),
      href: r.purchaseOrders,
    });
  }
  if(entities?.includes(Entity.PURCHASE_INVOICE)){
    buyingChildrens.push({
      title: t("purchaseInvoice"),
      href: r.purchaseInvoices,
    });
  }

  if(entities?.includes(Entity.PURCHASE_RECEIPT)){
    buyingChildrens.push({
      title: t("_receipt.f",{o:t("_purchase.base")}),
      href:r.toReceipts(PartyType.purchaseReceipt),
    })
  }
  if(entities?.includes(Entity.SUPPLIER_QUOTATION)){
    buyingChildrens.push({
      title: t("supplierQuotation"),
      href:r.toRoute({
        main:r.supplierQuotation,
        routePrefix:[r.quotation]
      })
    })
  }

  const buying:NavItem = {
    title: t("form.buying"),
    icon: CreditCardIcon,
    href: r.toRoute({
      main:partyTypeToJSON(PartyType.supplier),
      routePrefix:[r.buyingM],
    }),
    isChildren: true,
    children: buyingChildrens,
  }


  return buying
}