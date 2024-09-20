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
        <div className="py-3 grid ">
            <Typography fontSize={subtitle}>
                {t("_address.list")}
            </Typography>

            <div className="py-3">
            <AddressesComponent
            onAddAddress={onAddAddress}
            addresses={addresses}
            />
            </div>

        </div>
    )
}