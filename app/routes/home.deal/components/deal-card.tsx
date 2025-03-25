import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { openDealModal } from "~/routes/home.deal.$id/route";
import { components } from "~/sdk";
import { formatCurrency } from "~/util/format/formatCurrency";
import { route } from "~/util/route";

interface DealCardProps {
  deal: components["schemas"]["DealDto"];
  currency: string;
  openModal: (key: string, value: string) => void;
}
export default function DealCard({ deal, currency, openModal }: DealCardProps) {
  const { i18n } = useTranslation("common");
  return (
    <div className="">
      <div className="flex flex-col">
        <span
          className=" font-medium text-sm"
          onClick={() => openDealModal(deal.id.toString(), openModal)}
        >
          {deal.name}
        </span>

        <span className="text-sm text-secondary-foreground">
          {formatCurrency(deal.amount, currency, i18n.language)}
        </span>
        <div className="flex justify-between space-x-2 mt-2">
          <div className="icon-button flex cursor-pointer items-center text-xs">
            <PlusIcon className=" w-3 h-3 " />
            <span>Actividad</span>
          </div>
          <div className="text-gray-400 flex items-center text-xs space-x-1">
            <span>
              {formatDate(deal.created_at, "PP", {
                locale: es,
              })}
            </span>
            <Avatar className="w-6 h-6 ">
              {/* <AvatarImage src={activity.profile_avatar || undefined} /> */}
              <AvatarFallback>
                {deal.responsible_given_name[0]}
                {deal.responsible_family_name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
