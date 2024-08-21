import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import ItemInfo from "./components/ItemInfo";
import ItemPrices from "./components/ItemPrices";
import { Separator } from "@/components/ui/separator";
import { components } from "~/sdk";
import ItemVariants from "./components/item-variants";

export default function ItemDetailClient({
  data
}:{
  data:components["schemas"]["EntityResponseResultEntityItemBody"]
}) {
  

  return (
    <div className="grid gap-y-5">
      {data?.result != undefined && <ItemInfo data={data.result.entity} />}

      <Separator/>
      <ItemPrices />
      <Separator/>
      
      <ItemVariants
      item={data.result.entity}
      />

    </div>
  );
}
