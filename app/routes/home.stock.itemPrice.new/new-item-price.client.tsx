import { useRef } from "react";
import ItemPriceForm from "./components/item-price-form";
import FormLayout from "@/components/custom/form/FormLayout";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { route } from "~/util/route";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app-types";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useItemPriceStore } from "./use-item-price-store";

export default function NewItemPriceClient({}: {}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const globalState = useOutletContext<GlobalState>();
  const navigate = useNavigate();
  const {payload} = useItemPriceStore()
  const form = useForm<z.infer<typeof createItemPriceSchema>>({
    resolver: zodResolver(createItemPriceSchema),
    defaultValues: {
      itemQuantity:1,
      item:payload?.item,
      itemID:payload?.itemID,
      uom:payload?.uom,
      uomID:payload?.uomID,
    },
  });
  const r = route;
  const onSubmit = (values: z.infer<typeof createItemPriceSchema>) => {
    fetcher.submit(
      {
        action: "create-item-price",
        createItemPrice: values,
      },
      {
        encType: "application/json",
        method: "POST",
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.itemPrice),
          routePrefix: [r.stockM],
          routeSufix: ["new"],
        }),
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.itemPrice) {
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.itemPrice),
              routePrefix: [r.stockM],
              routeSufix: [form.getValues().item],
              q: {
                tab: "info",
                id:fetcher.data.itemPrice.uuid,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  setUpToolbar(() => {
    return {
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" create-grid"
        >
          <input type="submit" className="hidden" ref={inputRef} />
          <ItemPriceForm
            form={form}
            globalState={globalState}
          />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
