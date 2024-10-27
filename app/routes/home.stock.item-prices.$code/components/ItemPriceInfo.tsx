import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "../route";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatQuantity } from "~/util/format/formatQuantiy";
import { routes } from "~/util/route";
import { DEFAULT_CURRENCY } from "~/constant";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export default function ItemPriceInfo() {
  const { itemPrice, actions, associatedActions } =
    useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const [taxPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions && associatedActions[partyTypeToJSON(PartyType.tax)],
  });
  const [priceListPermission] = usePermission({
    roleActions: globalState.roleActions,
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.priceList)],
  });
  return (
    <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("itemPrice.info")}</Typography>
        </div>

        {/* <DisplayTextValue title={t("form.code")} value={entity.code} /> */}
        <DisplayTextValue
          title={t("form.rate")}
          value={formatCurrency(
            itemPrice?.rate,
            itemPrice?.price_list_currency || DEFAULT_CURRENCY,
            i18n.language
          )}
        />

        <DisplayTextValue
          title={t("form.itemQuantity")}
          value={formatQuantity(itemPrice?.item_quantity, itemPrice?.uom)}
        />

        {priceListPermission?.view && (
          <DisplayTextValue
            title={t("form.price-list")}
            value={itemPrice?.price_list_name}
            to={r.priceListDetail(
              itemPrice?.price_list_name,
              itemPrice?.price_list_uuid
            )}
          />
        )}

        {priceListPermission?.view && (
          <DisplayTextValue
            title={t("form.tax")}
            value={itemPrice?.tax_name}
            to={r.taxDetailRoute(itemPrice?.tax_name, itemPrice?.tax_uuid)}
          />
        )}
        {/* <DisplayTextValue title={t("form.uom")} value={data.UnitOfMeasure.UnitOfMeasureTranslation.Name} /> */}
      </div>
    </div>
  );
}
