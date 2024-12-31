import { useTranslation } from "react-i18next";
import { InvoiceSearch } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import { OrderSearch } from "~/util/hooks/fetchers/docs/use-order-fetcher";
import { PricingSearch } from "~/util/hooks/fetchers/pricing/use-pricing-fetcher";
import { parties } from "~/util/party";

export default function AutoCompleteByParty({
  partyType,
}: {
  partyType: string;
}) {
  const p = parties;
  const { t } = useTranslation("common");
  if (partyType == p.pricing) {
    return <PricingSearch placeholder={t("pricing")} />;
  }
  if (partyType == p.purchaseOrder || partyType == p.saleOrder) {
    return <OrderSearch placeholder={t(partyType)} partyType={partyType} />;
  }
  if (partyType == p.purchaseInvoice) {
    return <InvoiceSearch placeholder={t(partyType)} partyType={partyType} 
    queryName="pi_code" queryValue="pi_id"/>;
  }
  if (partyType == p.saleInvoice) {
    return <InvoiceSearch placeholder={t(partyType)} partyType={partyType} 
    queryName="si_code" queryValue="si_id"/>;
  }
  return null;
}
