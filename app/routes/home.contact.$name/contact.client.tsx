import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import Typography, { subtitle } from "@/components/typography/Typography"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { useTranslation } from "react-i18next"
import { PartyReferences } from "../home.party/components/party-references"


export default function ContactClient(){
    const {contact,actions } = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const {t} = useTranslation("common")
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    return (
        <div>
              <div className="info-grid">
              <DisplayTextValue
              title={t("form.givenName")}
              value={contact?.given_name}
              />
              <DisplayTextValue
              title={t("form.familyName")}
              value={contact?.family_name}
              />
               <DisplayTextValue
              title={t("form.email")}
              value={contact?.email}
              />
               <DisplayTextValue
              title={t("form.phoneNumber")}
              value={contact?.phone_number}
              />
               <DisplayTextValue
              title={t("form.gender")}
              value={contact?.gender}
              />
            
              <Typography fontSize={subtitle} className=" col-span-full">
                {t("_contact.list")}
              </Typography>

            <div className=" mx-2 col-span-full">
              {contact &&
              <PartyReferences
              partyId={contact.id}
              />
            }
            </div>

            </div>

        </div>
    )
}