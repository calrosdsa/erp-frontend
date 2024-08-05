import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import {
  Form,
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
  const [selectedUom, setSelectedUom] = useState<
    components["schemas"]["UnitOfMeasureTranslation"] | null
  >(null);
 
  const [selectedPlugins, setSelectedPlugins] = useState<
    components["schemas"]["CompanyPlugins"][]
  >([]);

  const [formData, setFormData] = useState({
    name: "Item",
    code: "item",
    rate: "11.50",
    itemQuantity:"1",
    itemGroup: selectedItemGroup,
    plugins: selectedPlugins,
  });

  const onSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(selectedUom == null) {
      return
    }
    if(selectedItemGroup == null){
      return 
    }
   
    if(selectedPriceList == null){
      return
    }
    const body:components["schemas"]["CreateItemRequestBody"] ={
      item:{
        code:formData.code,
        name:formData.name,
        itemGroupId:selectedItemGroup.ID,
        uom:selectedUom
      },
      plugins:selectedPlugins,
      itemPrice:{
        priceListId:selectedPriceList.ID,
        rate:Number(formData.rate),
        itemQuantity:Number(formData.itemQuantity),
      },
    }
    fetcher.submit(body,{
      action:"/home/stock/items/create_item",
      method:"POST",
      encType:"application/json"
    }
    )
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

  return (
    <div>
      {/* <fetcher.Form method="post" action="/home/stock/items/create_item" onSubmit={onSubmit}> */}
      <fetcher.Form onSubmit={onSubmit}>
        <Grid container spacing={2} columns={6} sx={{ flexGrow: 1 }}>
          <Grid xs={6}>
            <Typography level="title-lg">{t("itemInfo")}</Typography>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.name")}</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
              />
            </FormControl>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.code")}</FormLabel>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    code: e.target.value,
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.uom")}</FormLabel>
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
              />
            </FormControl>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.item-group")}</FormLabel>
              <CustomAutoComplete
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
              />
            </FormControl>
          </Grid>

          <Grid xs={6}>
            <Typography level="title-lg">
              {t("itemPrice")} ({t("form.optional")})
            </Typography>
          </Grid>

          {selectedPriceList != undefined && (
            <Grid xs={6}>
              <Stack direction={"row"} spacing={3} flexWrap="wrap" useFlexGap>
                <Typography level="title-md" fontWeight={600}>
                  {t("form.currency")}: {selectedPriceList.Currency}
                </Typography>
                <div className="flex space-x-1">
                  {selectedPriceList.IsBuying ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                  <Typography level="title-md" fontWeight={500}>
                    {t("form.buying")}
                  </Typography>
                </div>
                <div className="flex space-x-1">
                  {selectedPriceList.IsSelling ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )}
                  <Typography level="title-md" fontWeight={500}>
                    {t("form.selling")}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          )}

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.price-list")}</FormLabel>
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
            </FormControl>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <CustomFormInput
              formControlProps={{
                required: true,
              }}
              inputProps={{
                type: "number",
                name: "priceList",
                value: formData.rate,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    rate:e.target.value,
                  });
                },
              }}
              label={t("form.rate")}
            />
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <CustomFormInput
              formControlProps={{
                required: true,
              }}
              inputProps={{
                type: "number",
                name: "priceList",
                value: formData.itemQuantity,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    itemQuantity: e.target.value,
                  });
                },
              }}
              label={t("form.itemQuantity")}
            />
          </Grid>

          <Grid xs={6}>
            <Typography level="title-lg">{t("integrations")}</Typography>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl>
              <FormLabel>{t("plugins")}</FormLabel>
              <CustomMultipleSelect
                name={"Plugin"}
                selected={selectedPlugins}
                setSelected={(e) => {
                  setSelectedPlugins(e);
                }}
                data={state?.activeCompany?.CompanyPlugins || []}
              />
            </FormControl>
          </Grid>

          <Grid xs={6} sx={{ marginTop: 2 }}>
            {/* <Typography level="title-lg">{t("integrations")}</Typography> */}
            <Button loading={fetcher.state == "loading"} type="submit">{t("form.submit")}</Button>
          </Grid>
        </Grid>
      </fetcher.Form>
    </div>
  );
}
