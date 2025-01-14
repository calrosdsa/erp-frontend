import AddressesComponent from "@/components/custom-ui/addresses-component"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useNavigate } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { PartyType, partyTypeToJSON } from "~/gen/common"
import { components } from "~/sdk"
import { route } from "~/util/route"


export const PartyAddresses = ({
    addresses,onAddAddress,partyID
}:{
    addresses:components["schemas"]["AddressDto"][] | undefined | null
    onAddAddress?:()=>void
    partyID?:number
}) =>{
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    const r = route
    return (
        <div className="py-3 grid ">
            <Typography fontSize={subtitle}>
                {t("_address.list")}
            </Typography>

            <div className="py-3">
            <AddressesComponent
            onAddAddress={()=>{
                if(onAddAddress){
                    onAddAddress()
                }else{
                    navigate(r.toRoute({
                        main:partyTypeToJSON(PartyType.address),
                        routePrefix:["new"],
                        q:{
                            referenceID:partyID?.toString(),
                        }
                    }))
                }
            }}
            addresses={addresses}
            />
            </div>

        </div>
    )
}