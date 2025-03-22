import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Navigate,
  useFetcher,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { route } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ItemLineType, itemLineTypeToJSON, StockEntryType } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { stockEntryDataSchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { GlobalState } from "~/types/app-types";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { format } from "date-fns";
import { useFormErrorToast } from "~/util/hooks/ui/use-form-error-toast";
import { Card } from "@/components/ui/card";
import { StockEntryData } from "./stock-entry-data";

export default function NewStockEntryClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = route;
  const lineItemsStore = useLineItems();
 
  const form = useForm<z.infer<typeof stockEntryDataSchema>>({
    resolver: zodResolver(stockEntryDataSchema),
    defaultValues: {
      items: [],
      currency: companyDefaults?.currency,
      postingDate: new Date(),
      postingTime: format(new Date(), "HH:mm:ss"),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  const formValues = form.getValues();
  const onSubmit = (e: z.infer<typeof stockEntryDataSchema>) => {
    fetcher.submit(
      {
        stockEntryData: e as any,
        action: "create-stock-entry",
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
      titleToolbar: t("f.add-new", { o: t("stockEntry") }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onShowMessage: () => {
        if (fetcher.data) {
          navigate(
            r.toRoute({
              main: r.stockEntry,
              routePrefix: [r.stockM],
              routeSufix: [fetcher.data.stockEntry?.code || ""],
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

  useFormErrorToast(form.formState.errors);

  useEffect(() => {
    lineItemsStore.onLines(formValues.items);
  }, [formValues.items]);
  return (
    <Card>
      <StockEntryData
      form={form}
      fetcher={fetcher}
      onSubmit={onSubmit}
      inputRef={inputRef}
      />
    </Card>
  );
}
