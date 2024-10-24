  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useState } from "react";
  
  interface Props<T extends object, K extends keyof T> {
    data: T[];
    keyName?: K;
    defaultValue?:string
    keyValue?: K;
    label?: string;
    placeholder?:string
    onValueChange?: (e: T) => void;
  }
  export default function CustomSelect<T extends object, K extends keyof T>({
    label,
    keyName,
    keyValue,
    defaultValue,
    placeholder="Select a option",
    data,
    onValueChange,
  }: Props<T, K>) {
    const [value,setValue] = useState(defaultValue)
    return (
        <div className=" w-[200px]">
            <Select
              onValueChange={(e) => {
                  //   const object = JSON.parse(e)
                if(keyValue == undefined) return
                const item =  data.find(t =>  t[keyValue] == e)
                if (onValueChange != undefined && item) {
                  onValueChange(item);
                }
                setValue(e)
              }}
              value={value}
            >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              <SelectContent>
                {data.map((option, idx) => {
                  return (
                      <SelectItem value={keyValue ? option[keyValue] as string : ""} key={idx}>
                      {keyName ? option[keyName]?.toString() || "" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
                </div>
    );
  }
  
  // From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
  