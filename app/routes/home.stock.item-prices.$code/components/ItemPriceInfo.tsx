import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import Typography, { title } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatCurrency } from "~/util/format/formatCurrency"
import { formatQuantity } from "~/util/format/formatQuantiy"
import { routes } from "~/util/route"


export default function ItemPriceInfo(){
    const {itemPriceData} = useLoaderData<typeof loader>()
    const {entity} = itemPriceData.result
    const {t,i18n} = useTranslation("common")
    const r = routes
    return(
        <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("itemPrice.info")}</Typography>
        </div>

        {/* <DisplayTextValue title={t("form.code")} value={entity.code} /> */}

        <DisplayTextValue title={t("form.rate")} value={formatCurrency(entity.rate,entity.price_list.currency,i18n.language)} />

        <DisplayTextValue title={t("form.currency")} value={entity.price_list.currency} />


        <DisplayTextValue title={t("form.itemQuantity")} value={formatQuantity(entity.item_quantity,entity.item.unit_of_measure)} />




        <DisplayTextValue
          title={t("form.price-list")}
          value={entity.price_list.name}
          to={r.priceListDetail(entity.price_list.name,entity.price_list.uuid)}
        />

        <DisplayTextValue
          title={t("form.tax")}
          value={entity.tax.name}
          to={r.taxDetailRoute(entity.tax.name,entity.tax.uuid)}
        />

        

        {/* <DisplayTextValue title={t("form.uom")} value={data.UnitOfMeasure.UnitOfMeasureTranslation.Name} /> */}
      </div>
    </div>
    )
}

