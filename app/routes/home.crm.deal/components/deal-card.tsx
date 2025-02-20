import { Button } from "@/components/ui/button"
import { Link } from "@remix-run/react"
import { components } from "~/sdk"
import { route } from "~/util/route"

interface DealCardProps {
    deal:components["schemas"]["DealDto"]
}
export default function DealCard({deal}:DealCardProps){
    
    return (
        <div>
            <Link to={route.toRoute({
                main:route.deal,
                routeSufix:[deal.name],
                q:{
                    tab:"info",
                    id:deal.uuid
                }
            })}>
          {deal.name}
            </Link>
        </div>
    )
}