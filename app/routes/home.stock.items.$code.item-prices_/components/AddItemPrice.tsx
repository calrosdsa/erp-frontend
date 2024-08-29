import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app";
import { itemPriceFormSchema } from "~/util/data/schemas/stock/item-price-schema";
import { action } from "../../home.stock.items.$code/route";
import { pluginObjectSchema } from "~/util/data/schemas/plugin/plugin-schema";
import { useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax";
import { useCreatePriceList } from "~/routes/home.selling_.stock_.price-list/components/add-price-list";

export default function AddItemPrice({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  item: components["schemas"]["Item"];
}) {
  const { t } = useTranslation("common");
  const state = useOutletContext<GlobalState>();
  const fetcher = useFetcher<typeof action>();
  const createTax = useCreateTax()
  const createPriceList = useCreatePriceList()
  const fetcherDebounceTaxes = useDebounceFetcher<{ result: components["schemas"]["Tax"][] }>();
  const fetcherDebouncePriceList = useDebounceFetcher<
    | {
        pagination_result: {
          results: components["schemas"]["ItemPriceList"][];
          total: number;
        };
      }
    | undefined
  >();
  const [selectedPriceList, setSelectedPriceList] = useState<
    components["schemas"]["ItemPriceList"] | null
  >(null);
  const [selectedTax, setSelectedTax] =
    useState<components["schemas"]["Tax"]>();
  const [selectedPlugins, setSelectedPlugins] = useState<
    components["schemas"]["CompanyPlugins"][]
  >([]);
  const { toast } = useToast();

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
      //close form dialog
      onOpenChange(false);
    }
  }, [fetcher.data]);

  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      className="md:max-w-5xl"
      title={t("_stock.addItemPrice")}
    >
      <CustomForm
        schema={itemPriceFormSchema}
        className="create-grid "
        defaultValues={
          {
            itemId: item.ID,
          } as z.infer<typeof itemPriceFormSchema>
        }
        formItemsData={[
          {
            name: "rate",
            type: "number",
            typeForm: "input",
            label: t("form.rate"),
          },
          {
            name: "itemQuantity",
            type: "number",
            typeForm: "input",
            label: t("form.itemQuantity"),
          },
        ]}
        fetcher={fetcher}
        onSubmit={(values: z.infer<typeof itemPriceFormSchema>) => {
          console.log("ITEM", values);
          const plugins:z.infer<typeof pluginObjectSchema>[] = selectedPlugins.map(item=>{
            return {
              plugin:item.Plugin,
              companyId:item.CompanyID
            }
          })
          const body:z.infer<typeof itemPriceFormSchema> = {
            ...values,
            plugins:plugins,
          }
          fetcher.submit(
            {
              action: "add-item-price",
              itemPriceFormSchema: body,
            },
            {
              method: "POST",
              encType: "application/json",
            }
          );
        }}
        renderCustomInputs={(form) => {
          return (
            <>
              <FormAutocomplete
                form={form}
                data={fetcherDebounceTaxes.data?.result || []}
                label={t("taxes")}
                value={"Name"}
                nameK={"Name"}
                addNew={()=>{
                  createTax.onOpenChange(true)
                }}
                onSelect={(v) => {
                  setSelectedTax(v);
                  form.setValue("taxId", v.ID);
                }}
                onValueChange={(e) => {
                  fetcherDebounceTaxes.submit(
                    { query: e, action: "get" },
                    {
                      debounceTimeout: 600,
                      method: "POST",
                      action: `/home/accounting/taxes`,
                      encType: "application/json",
                    }
                  );
                }}
                name="taxName"
                onOpen={() => {
                  fetcherDebounceTaxes.submit(
                    { query: "", action: "get" },
                    {
                      method: "POST",
                      action: `/home/accounting/taxes`,
                      encType: "application/json",
                    }
                  );
                }}
              />

              {selectedPriceList != undefined && (
                <div className="col-span-full">
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
              )}

              <FormAutocomplete
                form={form}
                data={
                  fetcherDebouncePriceList.data?.pagination_result.results || []
                }
                label={t("form.price-list")}
                value={"Name"}
                nameK={"Name"}
                onSelect={(v) => {
                  setSelectedPriceList(v);
                  form.setValue("priceListId", v.ID);
                }}
                onValueChange={(e) => {
                  fetcherDebouncePriceList.submit(
                    { query: e, action: "get" },
                    {
                      debounceTimeout: 600,
                      method: "POST",
                      action: `/home/selling/stock/price-list`,
                      encType: "application/json",
                    }
                  );
                }}
                addNew={()=>{
                  createPriceList.onOpenChange(true)
                }}
                name="priceListName"
                onOpen={() => {
                  fetcherDebouncePriceList.submit(
                    { query: "", action: "get" },
                    {
                      method: "POST",
                      action: `/home/selling/stock/price-list`,
                      encType: "application/json",
                    }
                  );
                }}
              />

              <div className="col-span-full">
                <Typography fontSize={title}>{t("integrations")}</Typography>
              </div>

              <div className="">
                <MultiSelect
                  data={state?.activeCompany?.CompanyPlugins || []}
                  keyName={"Plugin"}
                  label={t("plugins")}
                  form={form}
                  name="pluginList"
                  onSelect={(v) => setSelectedPlugins(v)}
                />
              </div>
            </>
          );
        }}
      />
    </DrawerLayout>
  );
}
