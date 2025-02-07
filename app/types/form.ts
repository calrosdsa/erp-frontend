
//For selected items that are not objects, such as an array of strings.
interface SelectItem {
    name:string,
    value:string
}

interface FormItemData<T extends object,K extends keyof T> {
    typeForm:"input" | "select" | "check" | "multiselect" | "textarea" | "autocomplete"
    type?:"number" | "string" | "password" | "boolean" | "email" | "tel"
    name:string
    label?:string
    show?:boolean
    description?:string
    required?:boolean
    readOnly?:boolean
    // className?:string
    onValueChange?:(value:string)=>void
    data?:T[]
    keyName?:K
    keyValue?:K
    onSelectArray?:(e:T[])=>void
    onSelect?:(e:T)=>void
    // actions?:{
    //     addNew?:()=>void
    // }
    // onSelect?:(e:T)=>void
}