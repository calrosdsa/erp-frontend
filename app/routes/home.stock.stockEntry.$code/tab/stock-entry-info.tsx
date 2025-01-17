import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import {
  ItemLineType,
  itemLineTypeToJSON,
  State,
  stateFromJSON,
  stateToJSON,
  StockEntryType,
} from "~/gen/common";
import { GlobalState } from "~/types/app";
import { useEffect, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { z } from "zod";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { action, loader } from "../route";
import { StockEntryData } from "~/routes/home.stock.stockEntry.new/stock-entry-data";
import { stockEntryDataSchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import { party } from "~/util/party";

type EditData = z.infer<typeof stockEntryDataSchema>;
export default function StockEntryInfoTab() {
  // const { t, i18n } = useTranslation("common");
  // const { invoice, lineItems, totals, taxLines } =
  //   useLoaderData<typeof loader>();
  // const { companyDefaults } = useOutletContext<GlobalState>();
  // const params = useParams();
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { stockEntry, actions, lineItems } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const isDraft = stateFromJSON(stockEntry?.status) == State.DRAFT;
  const allowEdit = isDraft && perm?.edit;
  const allowCreate = isDraft && perm.create;
  const toolbar = useToolbar();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: stockEntryDataSchema,
    defaultValues: {
      id: stockEntry?.id,
      currency: stockEntry?.currency,
      postingTime: stockEntry?.posting_time,
      postingDate: new Date(stockEntry?.posting_date || ""),
      tz: stockEntry?.tz,
      entryType: stockEntry?.entry_type,

      sourceWarehouse: {
        id: stockEntry?.source_warehouse_id,
        name: stockEntry?.source_warehouse,
        uuid: stockEntry?.source_warehouse_uuid,
      },
      targetWarehouse: {
        id: stockEntry?.target_warehouse_id,
        name: stockEntry?.target_warehouse,
        uuid: stockEntry?.target_warehouse_uuid,
      },
      items: lineItems.map((t) =>
        toLineItemSchema(t, {
          partyType: party.stockEntry,
        })
      ),
    },
  });
  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        stockEntryData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    toolbar.setToolbar({
      onSave: () => inputRef.current?.click(),
    });
  }, [toolbar.isMounted]);

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <StockEntryData
      form={form}
      inputRef={inputRef}
      onSubmit={onSubmit}
      fetcher={fetcher}
      allowCreate={allowCreate}
      allowEdit={allowEdit}
    />
  );
}
