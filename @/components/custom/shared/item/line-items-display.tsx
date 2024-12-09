import ErrorElement from "@/components/layout/error/error-element";
import FallBack from "@/components/layout/Fallback";
import { Typography } from "@/components/typography";
import { Await } from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { components } from "~/sdk";
import LineItems from "./line-items";
import { useLineItems } from "./use-line-items";
import {
  toLineItemSchema,
} from "~/util/data/schemas/stock/line-item-schema";

export default function LineItemsDisplay({
  lineItems,
  status,
  currency,
  docPartyType,
  docPartyID,
  lineType,
  allowEdit = true,
  allowCreate = true,
}: {
  lineItems: any;
  status: string;
  currency: string;
  docPartyType?: string;
  docPartyID?:number,
  lineType: string;
  allowEdit?: boolean;
  allowCreate?: boolean;
}) {
  const { t } = useTranslation("common");
  return (
    <Suspense fallback={<FallBack />}>
      <Await resolve={lineItems} errorElement={<ErrorElement />}>
        {(resData: any) => {
          const { result: lines } =
            resData.data as components["schemas"]["ResponseDataListLineItemDtoBody"];
          const lineItemsStore = useLineItems();
          const setPayload = () => {
            lineItemsStore.onLines(
              lines.map((t) =>
                toLineItemSchema(t, {
                  partyType: docPartyType,
                })
              )
            );
          };
          useEffect(() => {
            setPayload();
          }, [lines]);
          return (
            <LineItems
              lineType={lineType}
              docPartyType={docPartyType}
              docPartyID={docPartyID}
              currency={currency}
              allowCreate={allowCreate}
              allowEdit={allowEdit}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}
