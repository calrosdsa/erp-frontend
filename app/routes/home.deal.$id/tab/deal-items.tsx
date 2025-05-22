import { GlobalState } from "~/types/app-types";
import { loader } from "../route";
import { SerializeFrom } from "@remix-run/node";
import { action } from "~/routes/api.itemline/route";

import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import ProductList from "@/components/custom/shared/item/product-list";
import { party } from "~/util/party";
import { useEffect } from "react";
import { useModalStore } from "@/components/ui/custom/modal-layout";

export default function DealItemsTab({
  appContext,
  data,
  keyPayload,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  keyPayload:string
}) {
  const deal = data?.deal;
  

  return (
    <div>
      {deal && (
        <ProductList
          partyID={deal.id}
          partyType={party.deal}
          currency="USD"
          allowEdit={true}
          lineType={itemLineTypeToJSON(ItemLineType.DEAL_LINE_ITEM)}
          keyPayload={keyPayload}
        />
      )}
    </div>
  );
}
