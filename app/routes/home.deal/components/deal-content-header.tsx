import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDealStore } from "~/routes/home.deal.$id/deal-store";
import { openDealModal } from "~/routes/home.deal.$id/route";
import { components } from "~/sdk";
import {
  formatCurrency,
  formatCurrencyAmount,
} from "~/util/format/formatCurrency";
import { route } from "~/util/route";

interface DealCardProps {
  deals: components["schemas"]["DealDto"][];
  currencyExchange: components["schemas"]["CurrencyExchangeDto"][];
  stage: components["schemas"]["StageDto"];
  currency: string;
  openModal: (key: string, value: string) => void;
}
export default function DealContentHeader({
  deals,
  stage,
  currency,
  currencyExchange,
  openModal,
}: DealCardProps) {
  const { setData } = useDealStore();
  const navigate = useNavigate();
  const { i18n } = useTranslation("common");
  const totalAmount = useMemo(() => {
    return deals.reduce((prev, curr) => {
      let amount = curr.amount
      if (currency != curr.currency) {
        const exchangeRate = currencyExchange.find(
          (t) => t.from_currency == curr.currency && t.to_currency == currency
        );
        if(exchangeRate){
          amount = (exchangeRate.exchange_rate * curr.amount)/100
        }
      }
      return prev + amount;
    }, 0);
  }, [deals]);
  return (
    <div className="p-2">
      <div className=" flex justify-center py-2">
        <span className="text-xl">
          {formatCurrency(totalAmount, currency, i18n.language)}
        </span>
      </div>

      <Button
        className="w-full rounded-full"
        variant={"outline"}
        onClick={() => {
          setData({
            stage: {
              id: stage.id,
              name: stage.name,
            },
          });
          openDealModal("0", openModal);
        }}
      >
        <span>Crear Trato</span>
        <PlusIcon />
      </Button>
    </div>
  );
}
