import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";


export default function ItemLine({open,onOpenChange}:{
    open:boolean
    onOpenChange:()=>void
}){
    const {t} = useTranslation("common")
    return (
        <DrawerLayout
        open={open}
        onOpenChange={onOpenChange}

        >
            <div className="grid col-span-1 md:col-span-2">
                <Typography fontSize={subtitle}>
                    {t("f.and",{o:t("form.quantity"),p:t("form.rate")})}
                </Typography>
            </div>
        </DrawerLayout>
    )
}