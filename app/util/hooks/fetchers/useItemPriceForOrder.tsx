import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_CURRENCY, DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components, operations } from "~/sdk"
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
    lang,
    priceListID,
}:{
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    onSelect: (e: components["schemas"]["ItemPriceDto"]) => void;
    docPartyType:string;
    currency?:string,
    lang:string
    priceListID?:number
  }) =>{
  const [fetcher, onChange] = useItemPriceForOrders({
    isBuying:
      docPartyType == partyTypeToJSON(PartyType.purchaseOrder) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseReceipt) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseInvoice) ||
      docPartyType == partyTypeToJSON(PartyType.supplierQuotation),
    isSelling:
      docPartyType == partyTypeToJSON(PartyType.saleOrder) ||
      docPartyType == partyTypeToJSON(PartyType.saleInvoice) ||
      docPartyType == partyTypeToJSON(PartyType.deliveryNote) ||
      docPartyType == partyTypeToJSON(PartyType.salesQuotation),
    currency: currency || DEFAULT_CURRENCY,
    priceListID:priceListID,
  });
  return (
    <>
    {/* {JSON.stringify(fetcher.data?.itemPriceForOrders)} */}
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
          {e.price_list_name &&
          <div className="flexspace-x-1">
            {e.price_list_name}:{" "}
            {formatCurrency(
              e.rate,
              e.price_list_currency,
              lang
            )}
          </div>
          }
        </div>
      );
    }}
  />
    </>

  );
}

export const useItemPriceForOrders = ({isSelling,isBuying,currency,priceListID}:{
    isSelling?:boolean
    isBuying?:boolean
    currency:string
    priceListID?:number
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        itemPriceForOrders:components["schemas"]["ItemPriceDto"][],
    }>()

    const onChange = (e:string)=>{
      const d = {
        query:e,
        currency:currency,
        is_buying:isBuying || false,
        is_selling:isSelling || false,  
        price_list_id:priceListID?.toString(),
      } as operations["get-item-prices-for-order"]["parameters"]["query"]
        debounceFetcher.submit({
            action:"item-price-for-orders",
            queryItemPriceForOrders:d,
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