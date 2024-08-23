import DisplayRouteNav from "@/components/custom/display/DisplayRouteNav";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";


export default function CustomerPurchasesClient(){
    const {t}  = useTranslation("common")
    const r = routes
    return (
        <div className="p-4  route-display-grid ">
            <DisplayRouteNav
            navItem={{
                title:t("orders"),
                href:r.purchaseorders
            }}
            
            />
        </div>
    )
}