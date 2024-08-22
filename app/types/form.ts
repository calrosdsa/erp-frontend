


interface FormItemData {
    typeForm:"input" | "select"
    type?:"number" | "string"
    name:string
    label?:string
    readOnly?:boolean
    onValueChange?:(value:string)=>void
}