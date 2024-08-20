import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { upsertItemAttributeValueSchema } from "~/routes/home.stock.item-attributes.$code/components/upsert-item-attribute-value";

interface Props<T> {
  form: any;
  formItemsData: FormItemData[];
  onSubmitt: (values:any) => void;
  fetcherKey:string
  className?:string
}
export default function CustomForm<T>({ form, formItemsData,
    fetcherKey,onSubmitt,className
 }: Props<T>) {
    const fetcher = useFetcher()
    const onSubmit = (e:z.infer<typeof upsertItemAttributeValueSchema>) =>{
        console.log(e)
    }
  return (
    <Form  {...form}>
        <fetcher.Form 
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className,"grid gap-y-2 p-3")}
        >
      {formItemsData.map((item, idx) => {
          return (
          <div key={idx}>
            {item.typeForm == "input" && (
              <CustomFormField
                label={item.label}
                name={item.name}
                form={form}
                children={(field) => {
                    return <Input {...field} type={item.type} readOnly={item.readOnly} />;
                }}
                />
            )}
          </div>
        );
    })}
    <Button  type="submit">
        {fetcher.state == "submitting" ?
        <Icons.spinner/>
        :
        t("form.submit")
    }
    </Button>
    </fetcher.Form>
    </Form>
  );
}
