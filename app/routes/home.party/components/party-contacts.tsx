import ContactList from "@/components/custom-ui/contacts-component"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useNavigate } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { PartyType, partyTypeToJSON } from "~/gen/common"
import { components } from "~/sdk"
import { routes } from "~/util/route"


export const PartyContacts = ({
    contacts,onAddContact,partyID
}:{
    contacts:components["schemas"]["ContactDto"][] | undefined | null
    onAddContact?:()=>void
    partyID?:number
}) =>{
    const {t} = useTranslation("common")
    const navigate = useNavigate()
    const r  = routes
    return (
        <div className="py-3 grid">
            <Typography fontSize={subtitle}>
                {t("_contact.list")}
            </Typography>

            <div className="py-3">
            <ContactList
            onAddContact={()=>{
                if(onAddContact){
                    onAddContact()
                }else{
                    navigate(r.toRoute({
                        main:partyTypeToJSON(PartyType.contact),
                        routePrefix:["new"],
                        q:{
                            referenceID:partyID?.toString(),
                        }
                    }))
                }
            }}
            contacts={contacts}
            />
            </div>

        </div>
    )
}