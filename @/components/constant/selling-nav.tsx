import { CreditCardIcon, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON, regatePartyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const SellingNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
  let sellingChildrens:NavItem[] = [];
  if(entities?.includes(Entity.CUSTOMER)){
    sellingChildrens.push({
      title: t("customers"),
      href: r.toParty(partyTypeToJSON(PartyType.customer)),
    });
  }
  if(entities?.includes(Entity.CUSTOMER)){
    sellingChildrens.push({
      title: t("customerGroup"),
      href: r.toGroupsByParty(PartyType.customerGroup),
    });
  }

  if (entities?.includes(Entity.PRICE_LIST_ENTITY_ID)) {
    sellingChildrens.push({
      title: t("price-list"),
      href: r.priceList,
    });
  }
  if(entities?.includes(Entity.SALE_ORDER_ENTITY_ID)){
    sellingChildrens.push({
      title: t("saleOrder"),
      href: r.toParty(partyTypeToJSON(PartyType.saleOrder)),
    });
  }

  if(entities?.includes(Entity.SALE_INVOICE_ENTITY_ID)){
    sellingChildrens.push({
      title: t("saleInvoice"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.saleInvoice),
        routePrefix:["invoice"],
        
      }),
    });
  }
  
  const selling: NavItem = {
    title: t("selling"),
    icon: DollarSign,
    href: r.selling,
    isChildren: true,
    children: sellingChildrens,
  };


  return selling
}