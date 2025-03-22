import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Navigate,
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { route } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { GlobalState } from "~/types/app-types";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useMemo, useRef } from "react";
import { quotationDataSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { addMonths, format, formatRFC3339 } from "date-fns";

import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { Card } from "@/components/ui/card";
import { QuotationData } from "./quotation-data";


type QuotationDataType = z.infer<typeof quotationDataSchema>

export default function NewQuotationClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = route;
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const form = useForm<QuotationDataType>({
    resolver: zodResolver(quotationDataSchema),
    defaultValues: {
      validTill: addMonths(new Date(), 1),
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: payload?.currency || companyDefaults?.currency,
      
      party:{
        id:payload?.partyID,
        name:payload?.partyName,
      },
      costCenter:{
        name:payload?.costCenterName,
        id:payload?.costCenterID,
      },
      project: {
        name:payload?.projectName,
        id:payload?.projectID,
      },

      lines: lineItemsStore.lines,
      taxLines: taxLinesStore.lines,
    },
  });

  const onSubmit = (e: QuotationDataType) => {
    fetcher.submit(
      {
        quotationData: e as any,
        action: "create-quotation",
      },
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
      titleToolbar: t("f.add-new", { o: t(quotationParty) }),
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
        if (fetcher.data) {
          navigate(
            r.toRoute({
              main: quotationParty,
              routePrefix: [r.quotation],
              routeSufix: [fetcher.data.quotation?.code || ""],
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

  
  return (
    <div>
      <Card>
        <QuotationData
        form={form}
        fetcher={fetcher}
        onSubmit={onSubmit}
        inputRef={inputRef}
        />
      </Card>
    </div>
  );
}
