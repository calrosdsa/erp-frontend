import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { Await, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { components } from "~/sdk";
import { ItemType } from "~/types/services/item";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import CustomAlertDialog from "@/components/custom/dialog/CustomAlertDialog";
import { useToast } from "@/components/ui/use-toast";
import { itemDtoSchema, itemFormSchema } from "~/util/data/schemas/stock/item-schemas";
import { z } from "zod";
import FallBack from "@/components/layout/Fallback";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemVariantColumns } from "@/components/custom/table/columns/stock/item-variant-columns";
import useActionTable from "~/util/hooks/useActionTable";
import AddItemVariant from "./AddItemVariant";



export default function ItemVariants({item}:{
    item:components["schemas"]["Item"]
}){
    const {itemVariants} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    const fetcher = useFetcher<typeof action>()
    const [enableVariantsConfirmation,setEnableVariantsConfirmation] =useState(false)
    const {toast} = useToast()
    const [meta,state] = useActionTable({})
    const {openDialog,setOpenDialog} = state

//   const {  } = useLoaderData<typeof loader>();

    useEffect(()=>{
        if(fetcher.data?.error){
            toast({
                title:fetcher.data.error
            })
        }
        if(fetcher.data?.message){
            toast({
                title:fetcher.data.message
            })
            setEnableVariantsConfirmation(false)
        }
    },[fetcher.data])
    return (
        <>
        {openDialog &&
        <AddItemVariant
        open={openDialog}
        onOpenChange={(e)=>setOpenDialog(e)}
        item={item}
        />
        }
        {enableVariantsConfirmation && 
        <CustomAlertDialog
        open={enableVariantsConfirmation}
        onOpenChange={(e)=>setEnableVariantsConfirmation(e)}
        onContinue={()=>{
            const newItem:z.infer<typeof itemDtoSchema> = {
                id:item.ID,
                itemType:ItemType.ITEM_TEMPLATE_TYPE,
                name:item.Name,
                itemGroupId:item.ItemGroupID,
                uomId:item.UnitOfMeasureID,
            }
            fetcher.submit({
                action:"update-item",
                item:newItem
            },{
                method:"post",
                encType:"application/json"
            })
        }}
        loading={fetcher.state == "submitting"}
        />
        }
            <div className=" col-span-full">
          <Typography fontSize={title}>{t("_item.variants")}</Typography>

          {item.ItemType == ItemType.ITEM_TYPE &&
          <div className=" w-full py-20 flex  justify-center">
            <Button variant={"outline"} onClick={()=>{
                setEnableVariantsConfirmation(true)
            }}>
                {t("_item.enableForVariants")}
            </Button>
          </div>
          }

          {item.ItemType == ItemType.ITEM_TEMPLATE_TYPE && 
          <Suspense fallback={<FallBack />}>
             <Await resolve={itemVariants}>
          {(itemVariants:any) => {
              const vData =  itemVariants.data as components["schemas"]["PaginationResponsePaginationResultListItemVariantBody"]
              return (
                  <div>
                    <DataTable
                    columns={itemVariantColumns()}
                    data={vData.pagination_result.results || []}
                    metaOptions={{
                        meta:meta
                    }}
                    />
                    {/* {JSON.stringify(itemVariants)}     */}
                </div>
            )
          }}
        </Await>
          </Suspense>
          }

        </div>
        </>
    )
}