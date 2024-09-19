import AddressesComponent from "@/components/custom-ui/addresses-component"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import { components } from "~/sdk"


export const PartyAddresses = ({
    addresses,onAddAddress
}:{
    addresses:components["schemas"]["AddressDto"][] | undefined | null
    onAddAddress:()=>void
}) =>{
    const {t} = useTranslation("common")
    return (
        <div className="py-3">
            <Typography fontSize={subtitle}>
                {t("_address.info")}
            </Typography>

            <div className="py-6">
            <AddressesComponent
            onAddAddress={onAddAddress}
            addresses={addresses}
            />
            </div>

        </div>
    )
}