import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useState } from "react";

export default function WareHouseClient() {
  const { warehouse } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [data,setData] = useState(warehouse)
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        <DisplayTextValue title={t("form.name")} value={warehouse?.Name} />

        <DisplayTextValue title={t("form.enabled")} value={data?.Enabled} 
        readOnly={false}
        onChange={(e)=>{
            if(data){
                if(typeof e == "boolean"){
                    setData({
                        ...data,
                        Enabled:e
                    })
                }
            }
            }}/>
      </div>
    </div>
  );
}
