import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDealStore } from "~/routes/home.deal.$id/deal-store";
import { components } from "~/sdk";
import { formatCurrency, formatCurrencyAmount } from "~/util/format/formatCurrency";
import { route } from "~/util/route";

interface DealCardProps {
  deals: components["schemas"]["DealDto"][];
  stage: components["schemas"]["StageDto"];
  currency:string
}
export default function DealContentHeader({ deals, stage,currency }: DealCardProps) {
  const { setPayload } = useDealStore();
  const navigate = useNavigate();
  const {i18n} = useTranslation("common")
  const totalAmount = useMemo(() => {
    return deals.reduce((prev, curr) => prev + curr.amount, 0);
  }, [deals]);
  return (
    <div className="p-2">
      <div className=" flex justify-center py-2">
        <span className="text-xl">{formatCurrency(totalAmount,currency,i18n.language)}</span>
      </div>

      <Button
        className="w-full rounded-full"
        variant={"outline"}
        onClick={() => {
          setPayload({
            enableEdit: true,
            stage: {
              id: stage.id,
              name: stage.name,
            },
          });
          navigate(
            route.toRoute({
              main: route.deal,
              routeSufix: ["new"],
            })
          );
        }}
      >
        <span>Crear Trato</span>
        <PlusIcon />
      </Button>
    </div>
  );
}
