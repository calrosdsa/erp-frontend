import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useDealStore } from "~/routes/home.crm.deal.$name/deal-store";
import { components } from "~/sdk";
import { route } from "~/util/route";

interface DealCardProps {
  deals: components["schemas"]["DealDto"][];
  stage: components["schemas"]["StageDto"];
}
export default function DealContentHeader({ deals, stage }: DealCardProps) {
  const { setPayload } = useDealStore();
  const navigate = useNavigate();
  const totalAmount = useMemo(() => {
    return deals.reduce((prev, curr) => prev + curr.amount, 0);
  }, [deals]);
  return (
    <div className="p-2">
      <div className=" flex justify-center py-2">
        <span className="text-xl">{totalAmount}</span>
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
