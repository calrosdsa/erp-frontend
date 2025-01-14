import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useEffect, useRef } from "react";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { GlobalState } from "~/types/app";
import { action } from "./route";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { format } from "date-fns";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import UpdateStock from "@/components/custom/shared/document/update-stock";
import { Card } from "@/components/ui/card";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { ReceiptData } from "./receipt-data";

export default function NewReceiptClient() {
  const fetcher = useFetcher<typeof action>();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const params = useParams();
  const partyReceipt = params.partyReceipt || "";
  const form = useForm<z.infer<typeof receiptDataSchema>>({
    resolver: zodResolver(receiptDataSchema),
    defaultValues: {
      receiptPartyType: partyReceipt,
      docReferenceID: payload?.documentRefernceID,
      currency: payload?.currency || companyDefaults?.currency,
      lines: lineItemsStore.lines.map((t) => {
        t.lineItemReceipt = {
          acceptedQuantity: t.quantity || 0,
          rejectedQuantity: 0,
        };
        if (partyReceipt == r.purchaseReceipt) {
          t.lineType = itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT);
        }
        if (partyReceipt == r.deliveryNote) {
          t.lineType = itemLineTypeToJSON(ItemLineType.DELIVERY_LINE_ITEM);
        }
        t.itemLineReferenceID = t.itemLineID
        return t;
      }),
      taxLines: taxLinesStore.lines,
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,

      
      party:{
        id:payload?.partyID,
        name:payload?.partyName,
      },
      priceList:{
        id:payload?.priceListID,
        name:payload?.priceListName,
      },
      costCenter:{
        name:payload?.costCenterName,
        id:payload?.costCenterID,
      },
      project: {
        name:payload?.projectName,
        id:payload?.projectID,
      },
      warehouse:{

      },
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof receiptDataSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-receipt",
        receiptData: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t(partyReceipt),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.receipt) {
          navigate(
            r.toRoute({
              main: partyReceipt,
              routeSufix: [fetcher.data.receipt.code],
              routePrefix: ["receipt"],
              q: {
                tab: "info",
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  return (
    <div>
      {/* {JSON.stringify(payload)} */}
      <Card>
        <ReceiptData
        form={form}
        inputRef={inputRef}
        onSubmit={onSubmit}
        fetcher={fetcher}
        />
      </Card>
    </div>
  );
}

// import {
//   useFetcher,
//   useNavigate,
//   useOutletContext,
//   useParams,
//   useRevalidator,
// } from "@remix-run/react";
// import { action } from "./route";
// import { routes } from "~/util/route";
// import { useTranslation } from "react-i18next";
// import { useToast } from "@/components/ui/use-toast";
// import { createReceiptSchema } from "~/util/data/schemas/receipt/receipt-schema";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import FormLayout from "@/components/custom/form/FormLayout";
// import { Form } from "@/components/ui/form";
// import { useEffect, useRef } from "react";
// import { ItemLineType, PartyType, partyTypeFromJSON } from "~/gen/common";
// import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
// import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
// import { GlobalState } from "~/types/app";
// import { usePermission } from "~/util/hooks/useActions";
// import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
// import Typography, {
//   subtitle,
// } from "@/components/typography/Typography";
// import CustomFormDate from "@/components/custom/form/CustomFormDate";
// import ItemLineForm from "@/components/custom/shared/item/item-line-form";
// import { useCreateReceipt } from "./use-create-receipt";
// import { useToolbar } from "~/util/hooks/ui/useToolbar";
// import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
// import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
// import { useCreateSupplier } from "../home.buying.supplier_/components/create-supplier";
// import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";

// export default function NewReceiptClient() {
//   const fetcher = useFetcher<typeof action>();
//   const [supplierDebounceFetcher, onSupplierChange] =
//     useSupplierDebounceFetcher();
//   const [currencyDebounceFetcher, onCurrencyChange] =
//     useCurrencyDebounceFetcher();
//   const globalState = useOutletContext<GlobalState>();
//   const [supplierPermission] = usePermission({
//     actions: supplierDebounceFetcher.data?.actions,
//     roleActions: globalState.roleActions,
//   });
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const r = routes;
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { t } = useTranslation("common");
//   const createReceipt = useCreateReceipt();
//   const { payload } = createReceipt;
//   const form = useForm<z.infer<typeof createReceiptSchema>>({
//     resolver: zodResolver(createReceiptSchema),
//     defaultValues: {
//       partyName: payload?.party_name,
//       partyUuid: payload?.party_uuid,
//       partyType: payload?.party_type,
//       currency: payload?.currency || globalState.companyDefaults?.currency || "",
//       currencyName: payload?.currency || globalState.companyDefaults?.currency,
//       reference: payload?.reference,
//       lines: payload?.lines || [],
//     },
//   });
//   const revalidator = useRevalidator();
//   const params = useParams();
//   const partyReceipt = params.partyReceipt || "";
//   const onSubmit = (values: z.infer<typeof createReceiptSchema>) => {
//     fetcher.submit(
//       {
//         action: "create-receipt",
//         createReceipt: values as any,
//       },
//       {
//         method: "POST",
//         encType: "application/json",
//         action: r.toCreateReceipt(partyTypeFromJSON(partyReceipt)),
//       }
//     );
//   };

//   setUpToolbar(() => {
//     return {
//       titleToolbar: t("f.add-new", { o: t("_receipt.base").toLocaleLowerCase() }),
//       onSave: () => {
//         inputRef.current?.click();
//       },
//     };
//   }, []);

//   useDisplayMessage(
//     {
//       error: fetcher.data?.error,
//       success: fetcher.data?.message,
//       onSuccessMessage: () => {
//         if (fetcher.data?.receipt) {
//           navigate(
//             r.toReceiptDetail(
//               params.partyReceipt || "n/a",
//               fetcher.data.receipt.code
//             )
//           );
//         }
//       },
//     },
//     [fetcher.data]
//   );
//   return (
//     <div>
//       <FormLayout>
//         <Form {...form}>
//           <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
//             <div className="create-grid">
//               <PartyAutocomplete
//                 party={partyReceipt}
//                 roleActions={globalState.roleActions}
//                 form={form}
//               />

//               <CustomFormDate
//                 form={form}
//                 name="postingDate"
//                 label={t("form.postingDate")}
//               />

//               <Typography className=" col-span-full" fontSize={subtitle}>
//                 {t("form.currencyAndPriceList")}
//               </Typography>
//               <FormAutocomplete
//                 data={currencyDebounceFetcher.data?.currencies || []}
//                 form={form}
//                 name="currencyName"
//                 nameK={"code"}
//                 onValueChange={onCurrencyChange}
//                 label={t("form.currency")}
//                 onSelect={(v) => {
//                   form.setValue("currency", v.code);
//                   revalidator.revalidate();
//                 }}
//               />

//               <div className=" col-span-full">
//                 <ItemLineForm
//                   form={form}
//                   configuteWarehouse={true}
//                   itemLineType={ItemLineType.ITEM_LINE_RECEIPT}
//                   partyType={partyReceipt || ""}
//                 />
//               </div>
//             </div>
//             <input ref={inputRef} type="submit" className="hidden" />
//           </fetcher.Form>
//         </Form>
//       </FormLayout>
//     </div>
//   );
// }
