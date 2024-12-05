import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useFetcher, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import { DEFAULT_CURRENCY } from "~/constant";
import { editChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { useRef } from "react";
import { routes } from "~/util/route";
import { useEditFields } from "~/util/hooks/useEditFields";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { z } from "zod";
type EditCustomerType = z.infer<typeof editChargesTemplateSchema>;
export default function ChargesTemplateInfo() {
  const { t } = useTranslation("common");
  const { chargesTemplate,taxLines } = useLoaderData<typeof loader>();
  const {companyDefaults} = useOutletContext<GlobalState>()
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const r = routes;
  const { form, hasChanged, updateRef } = useEditFields<EditCustomerType>({
    schema: editChargesTemplateSchema,
    defaultValues: {},
  });

  const onSubmit = (e: EditCustomerType) => {
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
  useLoadingTypeToolbar({
    loading:fetcher.state == "submitting",
    loadingType:"SAVE"
  }, [fetcher.state]);


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
    <div className="info-grid">
      <DisplayTextValue title={t("form.name")} value={chargesTemplate?.name} />

      {chargesTemplate &&
       <TaxAndCharges
       currency={companyDefaults?.currency || DEFAULT_CURRENCY}
       status={chargesTemplate.status}
       taxLines={taxLines}
       docPartyID={chargesTemplate.id}
       showTotal={false}
     />
      }
    </div>
  );
}
