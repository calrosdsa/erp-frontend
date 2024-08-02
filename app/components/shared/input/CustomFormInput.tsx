import { FormControl, FormControlProps, FormHelperText, FormLabel, Input, InputProps } from "@mui/joy";

interface Props  {
  label: string;
  helperText?:string
  formControlProps:FormControlProps
  inputProps:InputProps
}
export default function CustomFormInput({ formControlProps,label,helperText, inputProps }: Props) {
  return (
    <FormControl {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Input {...inputProps} />
      {helperText != undefined &&
          <FormHelperText>{helperText}</FormHelperText>
      }
    </FormControl>
  );
}
