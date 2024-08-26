import Typography, { labelF, sm } from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "@remix-run/react";
import { PencilIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

export default function DisplayTextValue({
  title,
  value,
  to,
  readOnly=true,
  onChange
}: {
  title: string;
  value: string | undefined;
  to?: string;
  readOnly?:boolean
  onChange?:(e:ChangeEvent<HTMLInputElement>)=>void
  // isEditable?:boolean
}) {
  const { t } = useTranslation("common");
  z.setErrorMap(makeZodI18nMap({ t }));
  return (
    <div className="flex flex-col ">
      <Typography fontSize={labelF}>{title}</Typography>

      <div className="bg-accent rounded-md p-[6px] shadow-sm flex justify-between">
      {to != undefined ? (
        <Link to={to}  className="underline h-7 items-center flex" >
          <Typography
            fontWeight={500}
            fontSize={sm}
            >
            {value}
          </Typography>
        </Link>
      ) : (
        <Input
        readOnly={readOnly}
        onChange={(e)=>{
          if(onChange){
            onChange(e)
          }
        }}
        className={cn(
          "focus-visible:ring-0 focus-visible:border-none  border-none ring-0 h-7 ring-offset-0 focus-visible:ring-offset-0",
          readOnly ? "bg-accent" :""
        )}
        value={readOnly ? value || "-" : value || ""}
        />
        // <Typography
        // fontWeight={500}
        // fontSize={sm}
        // >
        //   {value || "-"}
        // </Typography>
      )}
      {/* {!readOnly &&
      <Button variant={"default"} size={"icon"} className="h-6 w-6 ">
      <PencilIcon size={14}/>
      </Button>
      } */}
      </div>
    </div>
  );
}
