import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import {
  Await,
  useActionData,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { ItemType } from "~/types/services/item";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import CustomAlertDialog from "@/components/custom/dialog/CustomAlertDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  createItemSchema,
  editItemSchema,
} from "~/util/data/schemas/stock/item-schemas";
import { z } from "zod";
import FallBack from "@/components/layout/Fallback";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemVariantColumns } from "@/components/custom/table/columns/stock/item-variant-columns";
import useActionRow from "~/util/hooks/useActionRow";
import AddItemVariant, {
  useCreateItemVariant,
} from "./components/create-item-variant";
import { action, loader } from "./route";
import { ItemGlobalState } from "~/types/app";
import { routes } from "~/util/route";
import { components } from "~/sdk";

export default function ItemVariantsClient() {
  const { itemVariants } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const [enableVariantsConfirmation, setEnableVariantsConfirmation] =
    useState(false);
  const { toast } = useToast();
  const createItemVariant = useCreateItemVariant();
  const params = useParams();
  const { item } = useOutletContext<ItemGlobalState>();
  const r = routes;
  //   const {  } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      setEnableVariantsConfirmation(false);
    }
  }, [fetcher.data]);
  return (
    <>
      {enableVariantsConfirmation && (
        <CustomAlertDialog
          open={enableVariantsConfirmation}
          onOpenChange={(e) => setEnableVariantsConfirmation(e)}
          onContinue={() => {
            const newItem: z.infer<typeof editItemSchema> = {
              itemType: ItemType.ITEM_TEMPLATE_TYPE,
              name: item.name,
            };
            fetcher.submit(
              {
                action: "update-item",
                updateItem: newItem,
              },
              {
                method: "post",
                action: r.toItemDetail(item.name || "", item.uuid || ""),
                encType: "application/json",
              }
            );
          }}
          loading={fetcher.state == "submitting"}
        />
      )}
      <div className=" col-span-full">
        {item.item_type != ItemType.ITEM_VARIANT_TYPE && (
          <Typography fontSize={title}>{t("_item.variants")}</Typography>
        )}

        {item.item_type == ItemType.ITEM_TYPE && (
          <div className=" w-full py-20 flex  justify-center">
            <Button
              variant={"outline"}
              onClick={() => {
                setEnableVariantsConfirmation(true);
              }}
            >
              {t("_item.enableForVariants")}
            </Button>
          </div>
        )}
        {item.item_type == ItemType.ITEM_TEMPLATE_TYPE && (
          <Suspense fallback={<FallBack />}>
            <Await resolve={itemVariants}>
              {(itemVariants: any) => {
                const vData =
                  itemVariants.data as components["schemas"]["PaginationResponsePaginationResultListItemVariantDtoBody"];
                return (
                  <div>
                    {/* {JSON.stringify(vData)} */}
                    <DataTable
                      columns={itemVariantColumns()}
                      data={vData.pagination_result.results || []}
                      metaActions={{
                        meta: {
                          addNew: () => {
                            createItemVariant.openDialog({
                              item: {
                                uuid: item.uuid,
                                name: item.name,
                              },
                            });
                          },
                        },
                      }}
                    />
                    {/* {JSON.stringify(itemVariants)}     */}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        )}
      </div>
    </>
  );
}
