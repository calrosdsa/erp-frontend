import * as React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Box, Chip } from '@mui/joy';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

interface Props<T extends object, K extends keyof T,V extends keyof T> {
  data: T[];
  name: K;
  selected:T | null
  setSelected:(e:T | null) =>void
}


export default function CustomSelect<T extends object,K extends keyof T,V extends keyof T>({
  data,
  name,
  selected,setSelected
}: Props<T,K,V>){

    return (
      <Select
      indicator={<KeyboardArrowDown />}
      value={selected}
      onChange={(e,newValue)=>{
        setSelected(newValue)
      }}
      sx={{
        width: "100%",
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      {data.map((item,idx)=>{
        return (
          <Option value={item} key={idx}>{item[name] as any}</Option>
        )
      })}
    </Select>
    )
}