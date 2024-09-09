import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { formatLongDate } from "~/util/format/formatDate";
import UpdatePassword from "./components/update-password";
import { useState } from "react";

export default function AccountClient() {
  const globalState = useOutletContext<GlobalState>();
  const { t,i18n } = useTranslation("common");
  const [openUpdatePassword,setOpenUpdatePassword] = useState(false)
  return (
    <>
    {openUpdatePassword &&
    <UpdatePassword
    open={openUpdatePassword}
    onOpenChange={(e)=>setOpenUpdatePassword(e)}
    />
    }
    <div className="w-full info-grid-sidebar">
      <div className=" col-span-full flex justify-between w-full items-center">
        <Typography fontSize={title}>{t("info")}</Typography>
      </div>

      {globalState.user && (
        <>
          <DisplayTextValue
            title={t("form.email")}
            value={globalState.user.identifier}
          />

          <DisplayTextValue
            title={t("_account.lastLogin")}
            value={
                globalState.user.last_login ? 
              formatLongDate(globalState.user.last_login,i18n.language)
              : ""
            }
            />
        </>
      )}

      <div className=" col-span-full">
        <Button onClick={()=>setOpenUpdatePassword(true)}>
            {t("_account.updatePassword")}
        </Button>
      </div>
    </div>
    </>
  );
}
