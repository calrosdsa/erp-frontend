import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import Typography, { title } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatCurrency } from "~/util/format/formatCurrency"
import { formatQuantity } from "~/util/format/formatQuantiy"
import Routes from "~/util/route"


export default function ItemPriceInfo(){
    const {itemPriceData} = useLoaderData<typeof loader>()
    const {entity} = itemPriceData.result
    const {t,i18n} = useTranslation()
    const routes = new Routes()
    return(
        <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("itemPrice.info")}</Typography>
        </div>

        <DisplayTextValue title={t("form.code")} value={entity.Code} />

        <DisplayTextValue title={t("form.rate")} value={formatCurrency(entity.Rate,entity.ItemPriceList.Currency,i18n.language)} />

        <DisplayTextValue title={t("form.currency")} value={entity.ItemPriceList.Currency} />


        <DisplayTextValue title={t("form.itemQuantity")} value={formatQuantity(entity.ItemQuantity,entity.Item.UnitOfMeasure)} />




        <DisplayTextValue
          title={t("form.price-list")}
          value={entity.ItemPriceList.Name}
          to={routes.priceListDetail(entity.ItemPriceList.Code)}
        />

        <DisplayTextValue
          title={t("form.tax")}
          value={entity.Tax.Name}
          to={routes.taxDetailRoute(entity.Tax.Code)}
        />

        

        {/* <DisplayTextValue title={t("form.uom")} value={data.UnitOfMeasure.UnitOfMeasureTranslation.Name} /> */}
      </div>
    </div>
    )
}

