import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import Typography, { title } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatCurrency } from "~/util/format/formatCurrency"
import { formatQuantity } from "~/util/format/formatQuantiy"
import { routes } from "~/util/route"


export default function ItemPriceInfo(){
    const {itemPrice,actions} = useLoaderData<typeof loader>()
    const {t,i18n} = useTranslation("common")
    const r = routes
    return(
        <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("itemPrice.info")}</Typography>
        </div>

        {/* <DisplayTextValue title={t("form.code")} value={entity.code} /> */}

        <DisplayTextValue title={t("form.rate")} value={formatCurrency(itemPrice?.rate,itemPrice?.price_list.currency,i18n.language)} />

        <DisplayTextValue title={t("form.currency")} value={itemPrice?.price_list.currency} />


        <DisplayTextValue title={t("form.itemQuantity")} value={formatQuantity(itemPrice?.item_quantity,itemPrice?.item.unit_of_measure)} />




        <DisplayTextValue
          title={t("form.price-list")}
          value={itemPrice?.price_list.name}
          to={r.priceListDetail(itemPrice?.price_list.name,itemPrice?.price_list.uuid)}
        />

        <DisplayTextValue
          title={t("form.tax")}
          value={itemPrice?.tax.name}
          to={r.taxDetailRoute(itemPrice?.tax.name,itemPrice?.tax.uuid)}
        />

        

        {/* <DisplayTextValue title={t("form.uom")} value={data.UnitOfMeasure.UnitOfMeasureTranslation.Name} /> */}
      </div>
    </div>
    )
}

