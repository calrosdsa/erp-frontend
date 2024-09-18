import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"


export default function AddressClient(){
    const { address,actions } = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    return (
        <div>
            <div className="info-grid">
              <DisplayTextValue
              title={t("form.name")}
              value={address?.title}
              />
              <DisplayTextValue
              title={t("form.city")}
              value={address?.city}
              />
               <DisplayTextValue
              title={t("form.streetLine1")}
              value={address?.street_line1}
              />
               <DisplayTextValue
              title={t("form.streetLine2")}
              value={address?.street_line2}
              />
               <DisplayTextValue
              title={t("form.province")}
              value={address?.province}
              />
               <DisplayTextValue
              title={t("form.country")}
              value={address?.country_code}
              />
               <DisplayTextValue
              title={t("form.email")}
              value={address?.email}
              />
               <DisplayTextValue
              title={t("form.phoneNumber")}
              value={address?.phone_number}
              />
              <DisplayTextValue
              title={t("form.company")}
              value={address?.company}
              />
                            <DisplayTextValue
              title={t("form.identificationNumber")}
              value={address?.identification_number}
              />

              <Typography fontSize={subtitle} className=" col-span-full">
                {t("_address.references")}
              </Typography>
            </div>

        </div>
    )
}