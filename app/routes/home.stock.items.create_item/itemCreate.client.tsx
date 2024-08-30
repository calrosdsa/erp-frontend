import {
  useFetcher,
  useOutletContext,
} from "@remix-run/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/custom/form/CustomFormField";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import Typography, { subtitle, title } from "@/components/typography/Typography";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { action } from "./route";
import { itemFormSchema } from "~/util/data/schemas/stock/item-schemas";
import { useCreateItemGroup } from "../home.stock.item-groups_/components/add-item-group";

export default function CreateItemClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const state = useOutletContext<GlobalState>();
  const fetcherDebounce = useDebounceFetcher<
    | {
        paginationResult: {
          readonly $schema?: string;
          pagination_result: components["schemas"]["PaginationResultListItemGroup"];
        };
      }
    | undefined
  >();

  const fetcherDebounceUoms = useDebounceFetcher<
     {
        uoms: components["schemas"]["UnitOfMeasureTranslation"][];
      }>();
  const createItemGroup = useCreateItemGroup()
  const [selectedItemGroup, setSelectedItemGroup] = useState<
    components["schemas"]["ItemGroup"] | null
  >(null);

  const [selectedUom, setSelectedUom] = useState<
  components["schemas"]["UnitOfMeasureTranslation"] | null
>();
  const { toast } = useToast()


 
  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof itemFormSchema>) {
      if (selectedItemGroup == null) {
      return;
    }

    if (selectedUom == null) {
      return;
    }

    const body: components["schemas"]["CreateItemRequestBody"] = {
      item: {
        name: values.name,
        itemGroupId: selectedItemGroup.ID,
        uomId: selectedUom.UnitOfMeasure.ID,
      },
    };
    
    console.log(body)
      fetcher.submit(body, {
      action: "/home/stock/items/create_item",
      method: "POST",
      encType: "application/json",
    });
    
  }


  useEffect(()=>{
    if(fetcher.data?.errorAction != undefined){
      toast({
        title: fetcher.data.errorAction || "",
      })
    }
    // if(fetcher.data?.responseMessage != undefined){
    //   toast({
    //     title: fetcher.data.responseMessage.message || "",
    //   })
    // }
  },[fetcher.data])

  return (
    <div>
      <Form {...form}>

      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-2 items-end">
          <div className="col-span-6">
            <Typography fontSize={subtitle}
            >{t("itemInfo")}</Typography>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <CustomFormField
            form={form}
            name="name"
            label={t("form.name")}
            children={(field)=>{
              return(
                <Input {...field} name="name" />
              )
            }}
            />
         
          </div>


          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <FormAutocomplete
            form={form}
            data={fetcherDebounceUoms.data?.uoms || []}
            label={t("form.uom")}
            value={"Name"}
            nameK={"Name"}
            onValueChange={(e)=>{
              fetcherDebounceUoms.submit(
                { query: e, action: "get" },
                {
                  debounceTimeout: 600,
                  method: "POST",
                  action: `/home/settings/uom`,
                  encType: "application/json",
                }
              );
            }}
            onSelect={(v)=>{
              setSelectedUom(v)
            }}
            name="uomName"
            onOpen={()=>{
              fetcherDebounceUoms.submit(
                { query: "", action: "get" },
                {
                  method: "POST",
                  action: `/home/settings/uom`,
                  encType: "application/json",
                }
              );
            }}
            />
        
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            {/* <label className="block font-medium" htmlFor="item-group">
              {t("form.item-group")}
            </label> */}
            <FormAutocomplete
            form={form}
            addNew={()=>createItemGroup.onOpenChage(true)}
            data={fetcherDebounce.data?.paginationResult.pagination_result.results || []}
            label={t("form.item-group")}
            value={"Name"}
            nameK={"Name"}
            onSelect={(v)=>{
              setSelectedItemGroup(v)
            }}
            onValueChange={(e)=>{
              fetcherDebounce.submit(
                { query: e,action:"get" },
                {
                  debounceTimeout: 600,
                  method: "POST",
                  action: `/home/stock/item-groups`,
                  encType: "application/json",
                }
              );
            }}
            name="itemGroupName"
            onOpen={()=>{
              fetcherDebounce.submit(
                { query: "",action:"get" },
                {
                  method: "POST",
                  action: `/home/stock/item-groups`,
                  encType: "application/json",
                }
              );
            }}
            />
          
          </div>

          {/* <div className="col-span-6">
            <Typography fontSize={subtitle}>
              {t("itemPrice.s")} ({t("form.optional")})
            </Typography>
          </div> */}

          {/* {selectedPriceList != undefined && (
            <div className="col-span-6">
              <div className="flex flex-wrap gap-3">
                <h3 className="font-semibold">
                  {t("form.currency")}: {selectedPriceList.Currency}
                </h3>
                <div className="flex items-center gap-1">
                  {selectedPriceList.IsBuying ? (
                    <SquareCheckIcon />
                  ) : (
                    <SquareIcon />
                  )}
                  <h3 className="font-medium">{t("form.buying")}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {selectedPriceList.IsSelling ? (
                    <SquareCheckIcon />
                  ) : (
                    <SquareIcon />
                  )}
                  <h3 className="font-medium">{t("form.selling")}</h3>
                </div>
              </div>
            </div>
          )} */}

          {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <FormAutocomplete
            form={form}
            data={fetcherDebouncePriceList.data?.pagination_result.results || []}
            label={t("form.price-list")}
            value={"Name"}
            nameK={"Name"}
            onSelect={(v)=>{
              setSelectedPriceList(v)
            }}
            onValueChange={(e)=>{
              fetcherDebouncePriceList.submit(
                { query: e,action: "get"  },
                {
                  debounceTimeout: 600,
                    method: "POST",
                    action: `/home/selling/stock/price-list`,
                    encType: "application/json",
                }
              );
            }}
            name="priceListName"
            onOpen={()=>{
              fetcherDebouncePriceList.submit(
                { query: "",action: "get"  },
                {
                  method: "POST",
                  action: `/home/selling/stock/price-list`,
                  encType: "application/json",
                }
              );
            }}
            />
          
          </div> */}

          {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <CustomFormField
            form={form}
            name="rate"
            label={t("form.rate")}
            children={(field)=>{
              return(
                <Input {...field} name="rate" type="number" onChange={(e)=>form.setValue("rate",Number(e.target.value))}/>
              )
            }}
            />
         
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            
            <CustomFormField
            form={form}
            name="itemQuantity"
            label={t("form.itemQuantity")}
            children={(field)=>{
              return(
                <Input {...field} name="itemQuantity" type="number" onChange={(e)=>form.setValue("itemQuantity",Number(e.target.value))} />
              )
            }}
            />
          </div>

          <div className="col-span-6">
            <Typography fontSize={title}>{t("integrations")}</Typography>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
           <MultiSelect
           data={state?.activeCompany?.CompanyPlugins || []}
           keyName={"Plugin"}
           label={t("plugins")}
           form={form}
           name="pluginList"
           onSelect={(v)=>setSelectedPlugins(v)}
           />
          </div> */}

          <div className="col-span-6 mt-2">
          <Button
            type="submit"
            disabled={fetcher.state == "submitting"}
          >
            {fetcher.state == "submitting" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            {t("form.submit")}
          </Button>
          </div>
        </div>
      </fetcher.Form>
      </Form>

    </div>
  );
}
