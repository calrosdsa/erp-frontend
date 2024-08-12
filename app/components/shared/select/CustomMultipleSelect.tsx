import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Chip } from '@mui/joy';


interface Props<T extends object, K extends keyof T> {
  data: T[];
  name: K;
  selected:T[]
  setSelected:(e:T[]) =>void
}


export default function CustomMultipleSelect<T extends object,K extends keyof T>({
  data,
  name,
  selected,
  setSelected
}: Props<T,K>){

    return (
      <Select
      multiple
      onChange={(e,newValue)=>{
        console.log(newValue)
        setSelected(newValue)
      }}
      value={selected}
    
      renderValue={(selected) => (
        <div className='flex space-x-3' >
          {selected.map((selectedOption,idx) => (
            <Chip variant="soft" color="primary" key={idx}>
              {selectedOption.label}
            </Chip>
          ))}
        </div>
      )}
      sx={{
        minWidth: '15rem',
      }}
      slotProps={{
        listbox: {
          sx: {
            width: '100%',
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