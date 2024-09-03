import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"



export default function UserClient(){
    const {profile,actions} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    return (
        <>
        <div className="info-grid">
            <Typography fontSize={subtitle} className=" col-span-full">
                {t("info")}
            </Typography>

            <DisplayTextValue
            title={t("form.givenName")}
            value={profile?.GivenName}
            />

            <DisplayTextValue
            title={t("form.familyName")}
            value={profile?.FamilyName}
            />
            <DisplayTextValue
            title={t("form.email")}
            value={profile?.EmailAddress}
            />
            <DisplayTextValue
            title={t("_role.base")}
            value={profile?.UserRelation.Role.Code}
            />
        </div>
        </>
    )
}