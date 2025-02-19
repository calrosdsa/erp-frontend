import { Button } from "@/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { components } from "~/sdk";
import { route } from "~/util/route";

interface DealCardProps {
  deals: components["schemas"]["DealDto"][];
}
export default function DealContentHeader({ deals }: DealCardProps) {
//   const navigate = useNavigate();
  return (
    <div className="p-2">
      <div className=" flex justify-center py-2">
        <span className="text-xl">$0</span>
      </div>
      <Link to={route.toRoute({
        main:route.deal,
        routeSufix:["kanban","new"]
      })}>
        <Button className="w-full rounded-full" variant={"outline"}>
          <span>Crear Trato</span>
          <PlusIcon />
        </Button>
      </Link>
    </div>
  );
}
