import { useLoaderData, useParams } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"



export default function UserClient(){
    const {profile,actions} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    const params = useParams()
    setUpToolbar(()=>{
        return {
            title:params.path
        }
    },[])
    return (
        <>
        <div className="info-grid">
            <Typography fontSize={subtitle} className=" col-span-full">
                {t("info")}
            </Typography>

            <DisplayTextValue
            title={t("form.givenName")}
            value={profile?.given_name}
            />

            <DisplayTextValue
            title={t("form.familyName")}
            value={profile?.family_name}
            />
            <DisplayTextValue
            title={t("form.email")}
            value={profile?.email}
            />
            {/* <DisplayTextValue
            title={t("_role.base")}
            value={profile?.UserRelation.Role.Code}
            /> */}
        </div>
        </>
    )
}