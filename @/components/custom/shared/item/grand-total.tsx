import { formatCurrencyAmount } from "~/util/format/formatCurrency";
import DisplayTextValue from "../../display/DisplayTextValue";
import { useTaxAndCharges } from "../accounting/tax/use-tax-charges";
import { useLineItems } from "./use-line-items";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/typography";

export default function GrandTotal({currency}:{
    currency:string
}) {
  const {total} = useLineItems();
  const {total:totalTaxAndCharges} = useTaxAndCharges();
  const {i18n} = useTranslation()
  return (
    <>
    <Separator className=" col-span-full"/>   
    <Typography variant="subtitle2" className="col-span-full">Total</Typography>
      <DisplayTextValue
        title="Total"
        className=" col-start-end"
        value={formatCurrencyAmount((total+totalTaxAndCharges), currency, i18n.language)}
      />
    </>
  );
}
