import ContactList from "@/components/custom-ui/contacts-component"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import { components } from "~/sdk"


export const PartyContacts = ({
    contacts,onAddContact
}:{
    contacts:components["schemas"]["ContactDto"][] | undefined | null
    onAddContact:()=>void
}) =>{
    const {t} = useTranslation("common")
    return (
        <div className="py-3 grid">
            <Typography fontSize={subtitle}>
                {t("_contact.list")}
            </Typography>

            <div className="py-3">
            <ContactList
            onAddContact={onAddContact}
            contacts={contacts}
            />
            </div>

        </div>
    )
}