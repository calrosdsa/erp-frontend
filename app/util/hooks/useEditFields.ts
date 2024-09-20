import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    schema:any
    defaultValues:any
}
export default function useEditFields<T extends FieldValues>({schema,defaultValues}:Props){
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
      });
    const [hasChanged,setHasChanged] = useState(false)
    function validateIfDataHasChanged(){
        const isEqual = JSON.stringify(form.getValues()) == JSON.stringify(defaultValues)
        setHasChanged(!isEqual)
    }
    useEffect(()=>{
        validateIfDataHasChanged()
    },[form.getValues()])


    return {form,hasChanged}
}


// interface Props<T> {
//     data:T
//     form:any
// }
// export default function useEditFields<T>({data,form}:Props<T>){
//     const [updatedData,setUpdatedData]= useState<T>(data)
//     const [hasChanged,setHasChanged] = useState(false)
//     function validateIfDataHasChanged(){
//         const isEqual = JSON.stringify(data) == JSON.stringify(updatedData)
//         setHasChanged(!isEqual)
//     }

//     function updateField(keyValue:keyof T,value:any){
//         setUpdatedData({
//             ...updatedData,
//             [keyValue]:value
//         })
//         form.setValue(keyValue,value)
//     }

//     useEffect(()=>{
//         validateIfDataHasChanged()
//     },[updatedData])

//     return {updatedData,updateField,hasChanged}
// }