import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
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
  return (
    <div className="p-2">
      <div className=" flex justify-center py-2">
        <span className="text-xl">$0</span>
      </div>

      <Button
        className="w-full rounded-full"
        variant={"outline"}
        onClick={() => {
          setPayload({
            isEditable:true,
            open:true,
            stage:{
              id:stage.id,
              name:stage.name,
            }
          })
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
