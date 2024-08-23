


interface FormItemData {
    typeForm:"input" | "select"
    type?:"number" | "string" | "password"
    name:string
    label?:string
    readOnly?:boolean
    onValueChange?:(value:string)=>void
}