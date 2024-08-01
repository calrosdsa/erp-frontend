import { Autocomplete } from "@mui/joy";
import { useState } from "react";

interface Props<T extends object, K extends keyof T> {
    data: T[];
    name: K;
    selected:T | null
    setSelected:(e:T | null) =>void
    onChangeInputValue:(e:string)=>void
    onFocus:()=>void
  }

  
  export default function CustomAutoComplete<T extends object,K extends keyof T>({
    data,
    name,
    selected,
    setSelected,
    onChangeInputValue,
    onFocus
  }: Props<T,K>) {
    const [inputValue, setInputValue] = useState('');

  
    return (
        <Autocomplete
          value={selected as any}
          onChange={(event, newValue) => {
            setSelected(newValue);
          }}
          getOptionLabel={option => option[name] as string}
          inputValue={inputValue}
          onFocus={onFocus}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            onChangeInputValue(newInputValue)
          }}
          options={data}
          sx={{ width: "100%" }}
        />
       
    );
  }