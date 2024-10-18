import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";


export default function FormLayout({children,className}:{
    children:ReactNode
    className?:string
}){
    const { t } = useTranslation("common");
    z.setErrorMap(makeZodI18nMap({ t }));
    return (
        <div className={cn("px-4",className)}>
            {children}
        </div>
    )
}