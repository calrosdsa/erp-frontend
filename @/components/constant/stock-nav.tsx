import { CreditCardIcon, Layers3Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const StockNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route
  let stockChildrens: NavItem[] = [];
  if(entities?.includes(Entity.STOCK_ENTRY)){
    stockChildrens.push({
      title: t("stockEntry"),
      href: r.toRoute({
        main:r.stockEntry,
        routePrefix:[r.stockM],
      }),
    })
  }
  if (entities?.includes(Entity.ITEM)) {
    stockChildrens.push({
      title: t("items"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.item),
        routePrefix:[r.stockM],
      }),
    });
  }
  if (entities?.includes(Entity.ITEM_PRICE)) {
    stockChildrens.push({
      title: t("itemPrice"),
      href:r.toRoute({
        main:partyTypeToJSON(PartyType.itemPrice),
        routePrefix:[r.stockM],

      })
      // href: "/home/stock/item-prices",
    });
  }
  if (entities?.includes(Entity.ITEM)) {
    stockChildrens.push({
      title: t("item-groups"),
      href: r.toGroupByParty(partyTypeToJSON(PartyType.itemGroup)),
    });
  }
  if (entities?.includes(Entity.ITEM_ATTRIBUTES)) {
    stockChildrens.push({
      title: t("item-attributes"),
      href: "/home/stock/item-attributes",
    });
  }
  if (entities?.includes(Entity.ITEM_WAREHOUSE)) {
    stockChildrens.push({
      title: t("warehouses"),
      href: r.toRoute({
        main:partyTypeToJSON(PartyType.warehouse),
        routePrefix:[r.stockM],
      }),
    });
  }

  if (entities?.includes(Entity.PRICE_LIST)) {
    stockChildrens.push({
      title: t("priceList"),
      href: r.toRoute({
        main:r.priceList,
        routePrefix:[r.stockM]
      }),
    });
  }

  if (entities?.includes(Entity.SERIAL_NO)) {
    stockChildrens.push({
      title: t("serialNo"),
      href: r.toRoute({
        main:r.serialNo,
        routePrefix:[r.stockM]
      }),
    });
  }
  if (entities?.includes(Entity.BATCH_BUNDLE)) {
    stockChildrens.push({
      title: t("batchBundle"),
      href: r.toRoute({
        main:r.batchBundle,
        routePrefix:[r.stockM]
      }),
    });
  }

  const stock: NavItem = {
    title: t("stock"),
    icon: Layers3Icon,
    href: r.toRoute({
      main:partyTypeToJSON(PartyType.item),
      routePrefix:[r.stockM],
    }),
    isChildren: true,
    children: stockChildrens,
    
  };


  return stock
}