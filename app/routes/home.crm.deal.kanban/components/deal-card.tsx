import { Button } from "@/components/ui/button"
import { components } from "~/sdk"

interface DealCardProps {
    deal:components["schemas"]["DealDto"]
}
export default function DealCard({deal}:DealCardProps){
    return (
        <div>
          Card
        </div>
    )
}