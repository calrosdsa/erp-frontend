

export interface CustomTableProps {
    headerValues:HeadTableValue[]
    body:()=>JSX.Element
}

export interface HeadTableValue {
    name:string
    onClick?:()=>void
    style?: React.CSSProperties
}

export interface RowTableValue {
    name:string
    onClick?:()=>void
    style?: React.CSSProperties
}

export enum RowMenuOptions {
    EDIT,
    DELETE,
    MOVE,
}