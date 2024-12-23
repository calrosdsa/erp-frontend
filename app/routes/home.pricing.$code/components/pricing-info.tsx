import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import FormLayout from "@/components/custom/form/FormLayout";
import { z } from "zod";
import { editPricingSchema, mapPricingChargeDto, mapPricingLineItemDto } from "~/util/data/schemas/pricing/pricing-schema";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useTranslation } from "react-i18next";
import PricingData from "~/routes/home.pricing.new/compoments/pricing-data";

type EditType = z.infer<typeof editPricingSchema>;
export default function PricingInfo() {
  const laoder = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const { pricing,pricingCharges,pricingLines, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [currencyExchangePerm] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: editPricingSchema,
    defaultValues: {
      pricing_charges:pricingCharges.map(t=>mapPricingChargeDto(t)),
      pricing_line_items: pricingLines.map(t=>mapPricingLineItemDto(t)),
      id:pricing?.id,
    },
  });
  const allowEdit = currencyExchangePerm?.edit || false;

  const onSubmit = (e: EditType) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
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

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
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
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="info-grid">
            <div className=" col-span-full grid gap-3">
        {/* {JSON.stringify(pricingLines)} */}
            {form.getValues().pricing_charges &&
              form.getValues().pricing_line_items && (
                  <PricingData form={form} />
                )}
                </div>
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
