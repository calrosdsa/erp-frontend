import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_CURRENCY, DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"
import { PartyType, partyTypeToJSON } from "~/gen/common"
import { Control, Form } from "react-hook-form"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { formatCurrency } from "~/util/format/formatCurrency"


export const PriceAutocompleteForm = ({
    allowEdit =true,
    control,
    label,
    onSelect,
    docPartyType,
    currency,
    lang
}:{
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    onSelect: (e: components["schemas"]["ItemPriceDto"]) => void;
    docPartyType:string;
    currency?:string,
    lang:string
  }) =>{
  const [fetcher, onChange] = useItemPriceForOrders({
    isBuying:
      docPartyType == partyTypeToJSON(PartyType.purchaseOrder) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseReceipt) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseInvoice),
    isSelling:
      docPartyType == partyTypeToJSON(PartyType.saleOrder) ||
      docPartyType == partyTypeToJSON(PartyType.saleInvoice) ||
      docPartyType == partyTypeToJSON(PartyType.deliveryNote),
    currency: currency || DEFAULT_CURRENCY,
  });
  return (
    <FormAutocomplete
    data={fetcher.data?.itemPriceForOrders || []}
    nameK={"item_name"}
    label={label}
    name="item_name"
    allowEdit={allowEdit}
    control={control}
    onValueChange={onChange}
    onSelect={onSelect}
    onCustomDisplay={(e) => {
      return (
        <div className="flex flex-col">
          <div className="flex font-medium space-x-1">
            <span>{e.item_name}</span>
            <span className=" uppercase"> {e.uuid.slice(0, 5)}</span>
          </div>
          <div className="flexspace-x-1">
            {e.price_list_name}:{" "}
            {formatCurrency(
              e.rate,
              e.price_list_currency,
              lang
            )}
          </div>
        </div>
      );
    }}
  />
  );
}

export const useItemPriceForOrders = ({isSelling,isBuying,currency}:{
    isSelling?:boolean
    isBuying?:boolean
    currency:string
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        itemPriceForOrders:components["schemas"]["ItemPriceDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"item-price-for-orders",
            query:e,
            currency:currency,
            isBuying:isBuying || false,
            isSelling:isSelling || false,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.toRoute({
                main:partyTypeToJSON(PartyType.itemPrice),
                routePrefix:[r.stockM]
            })
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}