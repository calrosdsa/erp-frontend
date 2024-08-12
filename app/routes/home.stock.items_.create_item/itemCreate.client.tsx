import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useRouteLoaderData,
} from "@remix-run/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import CustomAutoComplete from "~/components/shared/input/CustomAutoComplete";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app";
import CustomMultipleSelect from "~/components/shared/select/CustomMultipleSelect";
import CustomSelect from "~/components/shared/select/CustomSelect";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CustomFormInput from "~/components/shared/input/CustomFormInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomFormField from "@/components/custom/form/CustomFormField";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

export default function CreateItemClient() {
  const fetcher = useFetcher();
  const { t } = useTranslation();
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
    | {
        uoms: components["schemas"]["UnitOfMeasureTranslation"][];
      }
    | undefined
  >();

  const fetcherDebouncePriceList = useDebounceFetcher<
    | {
        pagination_result: {
          results: components["schemas"]["ItemPriceList"][];
          total: number;
        };
      }
    | undefined
  >();

  const [selectedItemGroup, setSelectedItemGroup] = useState<
    components["schemas"]["ItemGroup"] | null
  >(null);
  const [selectedPriceList, setSelectedPriceList] = useState<
    components["schemas"]["ItemPriceList"] | null
  >(null);
  const [uoms, setUoms] = useState<
    components["schemas"]["UnitOfMeasureTranslation"][]
  >([]);

  const [selectedPlugins, setSelectedPlugins] = useState<
    components["schemas"]["CompanyPlugins"][]
  >([]);

  const formSchema = z.object({
    name: z.string().min(5),
    code: z.string().min(5),
    rate: z.string().min(5),
    itemQuantity: z.string().email(),
    uomID:z.number(),
    itemGroupId:z.number(),

  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      rate: "",
      itemQuantity: "",
    },
  });

  const [formData, setFormData] = useState({
    name: "Item",
    code: "item",
    rate: "11.50",
    itemQuantity: "1",
    itemGroup: selectedItemGroup,
    plugins: selectedPlugins,
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    if (selectedItemGroup == null) {
      return;
    }

    if (selectedPriceList == null) {
      return;
    }
    const body: components["schemas"]["CreateItemRequestBody"] = {
      item: {
        code: formData.code,
        name: formData.name,
        itemGroupId: selectedItemGroup.ID,
        uom: null,
      },
      plugins: selectedPlugins,
      itemPrice: {
        priceListId: selectedPriceList.ID,
        rate: Number(formData.rate),
        itemQuantity: Number(formData.itemQuantity),
        taxId: 1,
      },
    };
    fetcher.submit(body, {
      action: "/home/stock/items/create_item",
      method: "POST",
      encType: "application/json",
    });
    try {
    } catch (err) {}
  };

  function slugify(string: string) {
    return string
      .toString() // Convert to string
      .normalize("NFD") // Normalize the string to decompose combined characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading and trailing whitespace
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  }
 
  useEffect(()=>{
    console.log("UOMS",fetcherDebounceUoms.data)
    setUoms(fetcherDebounceUoms.data?.uoms||[])
  },[fetcherDebounceUoms.data])

  return (
    <div>
      {/* <fetcher.Form method="post" action="/home/stock/items/create_item" onSubmit={onSubmit}> */}
      <Form {...form}>

      <fetcher.Form onSubmit={onSubmit}>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-6">
            <h2 className="text-xl font-bold">{t("itemInfo")}</h2>
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
            <CustomFormField
            form={form}
            name="code"
            label={t("form.code")}
            children={(field)=>{
              return(
                <Input {...field} name="code" />
              )
            }}
            />
          {/* <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.code")}</FormLabel>
                      <FormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            {/* {JSON.stringify(fetcherDebounceUoms.data?.uoms)} */}
            
            <FormAutocomplete
            form={form}
            data={uoms}
            label={t("form.uom")}
            value={"ID"}
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
            name="uomID"
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
          {/* <FormField
                  control={form.control}
                  name="uomID"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>{t("form.uom")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            onClick={()=>{
                              fetcherDebounceUoms.submit(
                                { query: "", action: "get" },
                                {
                                  method: "POST",
                                  action: `/home/settings/uom`,
                                  encType: "application/json",
                                }
                              );
                            }}
                            className={cn(
                              " justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? fetcherDebounceUoms.data?.uoms.find(
                                  (item) => item.ID === field.value
                                )?.Name
                              : "Select item"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent >
                        <Command>
                          <CommandInput placeholder="Search item..." onValueChange={(e)=>{
                            fetcherDebounceUoms.submit(
                              { query: e, action: "get" },
                              {
                                debounceTimeout: 600,
                                method: "POST",
                                action: `/home/settings/uom`,
                                encType: "application/json",
                              }
                            );
                          }}/>
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {fetcherDebounceUoms.data?.uoms.map((item) => (
                                <CommandItem
                                  value={item.ID.toString()}
                                  key={item.ID}
                                  onSelect={() => {
                                    form.setValue("uomID", item.ID)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.ID === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {item.Name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the language that will be used in the dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  )}
                /> */}
            {/* <label className="block font-medium" htmlFor="uom">
              {t("form.uom")}
            </label>
            <CustomAutoComplete
              selected={selectedUom}
              setSelected={(e) => {
                setSelectedUom(e);
              }}
              onChangeInputValue={(e) => {
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
              onFocus={() => {
                fetcherDebounceUoms.submit(
                  { query: "", action: "get" },
                  {
                    method: "POST",
                    action: `/home/settings/uom`,
                    encType: "application/json",
                  }
                );
              }}
              data={
                fetcherDebounceUoms.data != undefined
                  ? fetcherDebounceUoms.data.uoms
                  : []
              }
              name="Name"
            /> */}
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            {/* <label className="block font-medium" htmlFor="item-group">
              {t("form.item-group")}
            </label> */}
            <FormAutocomplete
            form={form}
            data={fetcherDebounce.data?.paginationResult.pagination_result.results || []}
            label={t("form.item-group")}
            value={"ID"}
            nameK={"Name"}
            onValueChange={(e)=>{
              console.log(e,"VAlue change")
              fetcherDebounce.submit(
                { query: e },
                {
                  debounceTimeout: 600,
                  method: "POST",
                  action: `/home/stock/item-groups`,
                  encType: "application/json",
                }
              );
            }}
            name="uomID"
            onOpen={()=>{
              fetcherDebounce.submit(
                { query: "" },
                {
                  method: "POST",
                  action: `/home/stock/item-groups`,
                  encType: "application/json",
                }
              );
            }}
            />
            {/* <CustomAutoComplete
              selected={selectedItemGroup}
              setSelected={(e) => {
                setSelectedItemGroup(e);
              }}
              onChangeInputValue={(e) => {
                fetcherDebounce.submit(
                  { query: e },
                  {
                    debounceTimeout: 600,
                    method: "POST",
                    action: `/home/stock/item-groups`,
                    encType: "application/json",
                  }
                );
              }}
              onFocus={() => {
                fetcherDebounce.submit(
                  { query: "" },
                  {
                    method: "POST",
                    action: `/home/stock/item-groups`,
                    encType: "application/json",
                  }
                );
              }}
              data={
                fetcherDebounce.data != undefined
                  ? fetcherDebounce.data.paginationResult.pagination_result
                      .results
                  : []
              }
              name="Name"
            /> */}
          </div>

          <div className="col-span-6">
            <h2 className="text-xl font-bold">
              {t("itemPrice")} ({t("form.optional")})
            </h2>
          </div>

          {selectedPriceList != undefined && (
            <div className="col-span-6">
              <div className="flex flex-wrap gap-3">
                <h3 className="font-semibold">
                  {t("form.currency")}: {selectedPriceList.Currency}
                </h3>
                <div className="flex items-center gap-1">
                  {selectedPriceList.IsBuying ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                  <h3 className="font-medium">{t("form.buying")}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {selectedPriceList.IsSelling ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                  <h3 className="font-medium">{t("form.selling")}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label className="block font-medium" htmlFor="price-list">
              {t("form.price-list")}
            </label>
            <CustomAutoComplete
              selected={selectedPriceList}
              setSelected={(e) => {
                setSelectedPriceList(e);
              }}
              onChangeInputValue={(e) => {
                fetcherDebouncePriceList.submit(
                  { query: e, action: "get" },
                  {
                    debounceTimeout: 600,
                    method: "POST",
                    action: `/home/stock/price-list`,
                    encType: "application/json",
                  }
                );
              }}
              onFocus={() => {
                fetcherDebouncePriceList.submit(
                  { query: "", action: "get" },
                  {
                    method: "POST",
                    action: `/home/stock/price-list`,
                    encType: "application/json",
                  }
                );
              }}
              data={
                fetcherDebouncePriceList.data != undefined
                  ? fetcherDebouncePriceList.data.pagination_result.results
                  : []
              }
              name="Name"
            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
         
            <CustomFormInput
              formControlProps={{
                required: true,
              }}
              inputProps={{
                type: "number",
                name: "rate",
                value: formData.rate,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    rate: e.target.value,
                  });
                },
              }} label={t("form.rate")}            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            {/* <label className="block font-medium" htmlFor="itemQuantity">
              {t("form.itemQuantity")}
            </label> */}
            <CustomFormInput
              formControlProps={{
                required: true,
              }}
              inputProps={{
                type: "number",
                name: "itemQuantity",
                value: formData.itemQuantity,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    itemQuantity: e.target.value,
                  });
                },
              }} label={t("form.itemQuantity")}

                 />
          </div>

          <div className="col-span-6">
            <h2 className="text-xl font-bold">{t("integrations")}</h2>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label className="block font-medium" htmlFor="plugins">
              {t("plugins")}
            </label>
            <CustomMultipleSelect
              name="Plugin"
              selected={selectedPlugins}
              setSelected={(e) => {
                setSelectedPlugins(e);
              }}
              data={state?.activeCompany?.CompanyPlugins || []}
            />
          </div>

          <div className="col-span-6 mt-2">
            <button
              type="submit"
              className={`btn ${fetcher.state === "loading" && "loading"}`}
            >
              {t("form.submit")}
            </button>
          </div>
        </div>
      </fetcher.Form>
      </Form>

    </div>
  );
}
