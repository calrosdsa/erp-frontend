import CustomFormField from "@/components/custom/form/CustomFormField";
import FormLayout from "@/components/custom/form/FormLayout";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { createChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Input } from "@/components/ui/input";
import { GlobalState } from "~/types/app";
import { DEFAULT_CURRENCY } from "~/constant";

export default function NewChargesTemplateClient() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = routes;
  const { companyDefaults } = useOutletContext<GlobalState>();
  const taxLinesStore = useTaxAndCharges();
  const form = useForm<z.infer<typeof createChargesTemplateSchema>>({
    resolver: zodResolver(createChargesTemplateSchema),
    defaultValues: {
      taxLines: taxLinesStore.lines,
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof createChargesTemplateSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-charges-template",
        createChargesTemplate: values,
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
        o: t("chargesTemplate"),
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
        if (fetcher.data?.chargesTemplate) {
          navigate(
            r.toRoute({
              main: r.chargesTemplate,
              routePrefix: [r.accountingM],
              routeSufix: [fetcher.data.chargesTemplate.name],
              q: {
                tab: "info",
                id: fetcher.data.chargesTemplate.uuid,
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

  return (
    <div>
      <Card>
        <FormLayout>
          <Form {...form}>
            <fetcher.Form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className={"gap-y-3 grid p-3"}
            >
              <div className="create-grid">
                <CustomFormField
                  label={t("form.name")}
                  control={form.control}
                  name="name"
                  children={(field) => {
                    return <Input {...field} />;
                  }}
                />

                <TaxAndChargesLines
                  onChange={(e) => {
                    form.setValue("taxLines", e);
                    form.trigger("taxLines");
                  }}
                  currency={companyDefaults?.currency || DEFAULT_CURRENCY}
                  showTotal={false}
                />
              </div>

              <input ref={inputRef} type="submit" className="hidden" />
            </fetcher.Form>
          </Form>
        </FormLayout>
      </Card>
    </div>
  );
}
