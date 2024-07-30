import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useChangeLanguage } from 'remix-i18next/react';

export default function LanguageSelect({
  defaultLanguage
}:{
  defaultLanguage:string
}) {
  const handleChange = async(
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    // alert(`You chose "${newValue}"`);

    // useChangeLanguage("en")

     await fetch("/",{
      method:"post",
      body:JSON.stringify({
        language:newValue
      })
    })
    window.location.reload()
    
  };
  return (
    <Select defaultValue={defaultLanguage} value={defaultLanguage} onChange={handleChange}>
      <Option value="en">English</Option>
      <Option value="es">Español</Option>
    </Select>
  );
}