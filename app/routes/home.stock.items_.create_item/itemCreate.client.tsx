import { Button, FormControl, FormLabel, Grid, Input, Typography } from "@mui/joy";
import { Form, useFetcher, useOutletContext } from "@remix-run/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import CustomAutoComplete from "~/components/shared/input/CustomAutoComplete";
import { components } from "~/sdk";
import { loader } from "../home.stock.item-groups/route";
import { GlobalState } from "~/types/app";
import CustomMultipleSelect from "~/components/shared/select/CustomMultipleSelect";
import CustomSelect from "~/components/shared/select/CustomSelect";

export default function CreateItemClient() {
  const fetcher = useFetcher();
  const { t } = useTranslation();
  const state = useOutletContext<GlobalState>()
  const fetcherDebounce = useDebounceFetcher<
    | {
        paginationResult: {
          readonly $schema?: string;
          pagination_result: components["schemas"]["PaginationResultListItemGroup"];
        };
      }
    | undefined
  >();

  const [selectedItemGroup, setSelectedItemGroup] = useState<components["schemas"]["ItemGroup"] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<components["schemas"]["Company"] | null>(null);
  const [selectedPlugins, setSelectedPlugins] = useState<components["schemas"]["CompanyPlugins"][]>([]);


  const [formData,setFormData] = useState({
    name:"",
    code:"",
    itemGroup:selectedItemGroup,
    company:selectedCompany,
    plugins:selectedPlugins
  })


  const onSubmit = (e:FormEvent<HTMLFormElement>) => {
    try{
      
    }catch(err){

    }
  }

  function slugify(string:string) {
    return string
      .toString()                             // Convert to string
      .normalize('NFD')                       // Normalize the string to decompose combined characters
      .replace(/[\u0300-\u036f]/g, '')        // Remove diacritics
      .toLowerCase()                          // Convert to lowercase
      .trim()                                 // Remove leading and trailing whitespace
      .replace(/[^a-z0-9 -]/g, '')            // Remove invalid characters
      .replace(/\s+/g, '-')                   // Replace spaces with hyphens
      .replace(/-+/g, '-');                   // Replace multiple hyphens with a single hyphen
  }
  

  const data = [
    { Name: "Alice", id: 30 },
    { Name: "Bob", id: 25 },
  ];
  return (
    <div>
      <fetcher.Form  method="post" action="/home/stock/items/create_item">
        <Grid container spacing={2} columns={6} sx={{ flexGrow: 1 }}>
        <Grid xs={6}>
          <Typography level="title-lg">{t("itemInfo")}</Typography>
        </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.name")}</FormLabel>
              <Input type="text" name="name" value={formData.name} onChange={(e)=>{
                setFormData({
                  ...formData,
                  name:e.target.value,
                  code:slugify(e.target.value)
                })
              }}/>
            </FormControl>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.code")}</FormLabel>
              <Input type="text" name="code" value={formData.code} onChange={(e)=>{
                setFormData({
                  ...formData,
                  code:slugify(e.target.value)
                })
              }}/>
            </FormControl>
          </Grid>

          <Grid xs={6} sm={3} lg={2}>

            <FormControl required>
              <FormLabel>{t("form.item-group")}</FormLabel>
              <CustomAutoComplete
                selected={selectedItemGroup}
                setSelected={(e) => {
                  setSelectedItemGroup(e)
                }}
                onChangeInputValue={(e) => {
                  fetcherDebounce.submit({query:e},{
                    debounceTimeout:600,
                    method:"POST",
                    action:`/home/stock/item-groups`,
                    encType: "application/json",
                  });
                }}
                onFocus={()=>{
                  fetcherDebounce.submit({query:""},{
                    method:"POST",
                    action:`/home/stock/item-groups`,
                    encType: "application/json",
                  });
                }}
                data={fetcherDebounce.data != undefined ?fetcherDebounce.data.paginationResult.pagination_result.results:[] }
                name="Name"
              />
            </FormControl>

          </Grid>

          <Grid xs={6} sm={3} lg={2}>
            <FormControl required>
              <FormLabel>{t("form.companyName")}</FormLabel>
              <CustomSelect
              data={state.user?.Companies || []}
              name={"Name"}
              selected={selectedCompany}
              setSelected={(e)=>setSelectedCompany(e)}
              />
              {/* <CustomMultipleSelect
              defaultValue={[]}
              // data={}
              /> */}
            </FormControl>
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
              setSelected={(e)=>{setSelectedPlugins(e)}}
              data={selectedCompany?.CompanyPlugins || []}
              />
            </FormControl>
          </Grid>

          <Grid xs={6} sx={{marginTop:2}}>
          {/* <Typography level="title-lg">{t("integrations")}</Typography> */}
          <Button  type="submit">{t("form.submit")}</Button>
        </Grid>

        </Grid>
        
      </fetcher.Form>
    </div>
  );
}
