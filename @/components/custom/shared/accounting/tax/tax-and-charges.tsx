import ErrorElement from "@/components/layout/error/error-element";
import FallBack from "@/components/layout/Fallback";
import { Await } from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { components } from "~/sdk";
import TaxAndChargesLines from "./tax-and-charge-lines";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { State, stateToJSON } from "~/gen/common";
import { useTaxAndCharges } from "./use-tax-charges";

export default function TaxAndCharges({
  taxLines,
  status,
  currency,
  docPartyID,
  docPartyType,
  showTotal = true,
  allowEdit = true,
  allowCreate = true,
}: {
  taxLines: any;
  status: string;
  currency: string;
  docPartyID: number;
  docPartyType:string
  showTotal?:boolean
  allowEdit?:boolean
  allowCreate?:boolean
}) {
  return (
      <Suspense fallback={<FallBack />}>
        <Await resolve={taxLines} errorElement={<ErrorElement />}>
          {(resData: any) => {
            const { result: taxLines } =
              resData.data as components["schemas"]["ResponseDataListTaxAndChargeLineDtoBody"] || [];
            const taxAndCharges = useTaxAndCharges();

            useEffect(() => {
              taxAndCharges.onLines(taxLines.map(t=>toTaxAndChargeLineSchema(t)))
            }, [taxLines]);
            return (
                <TaxAndChargesLines
                  docPartyID={docPartyID}
                  docPartyType={docPartyType}
                  currency={currency}
                  showTotal={showTotal}
                  allowEdit={allowEdit}
                  allowCreate={allowCreate}
                />
            );
          }}
        </Await>
      </Suspense>
  );
}
