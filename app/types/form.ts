


interface FormItemData<T extends object,K extends keyof T> {
    typeForm:"input" | "select" | "check"
    type?:"number" | "string" | "password" | "boolean" | "email"
    name:string
    label?:string
    description?:string
    readOnly?:boolean
    onValueChange?:(value:string)=>void
    data?:T[]
    keyName?:K
    keyValue?:K
}