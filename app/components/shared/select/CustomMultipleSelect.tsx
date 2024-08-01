import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Box, Chip } from '@mui/joy';


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
        <Box sx={{ display: 'flex', gap: '0.25rem' }}>
          {selected.map((selectedOption) => (
            <Chip variant="soft" color="primary">
              {selectedOption.label}
            </Chip>
          ))}
        </Box>
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