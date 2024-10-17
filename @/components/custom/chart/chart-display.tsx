import Typography, { subtitle } from "@/components/typography/Typography"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"


export default function ChartDisplay({
    children,title,description
}:{
    children:ReactNode
    title:string
    description?:string
}){
    return (
        <Card>
            <CardHeader>
                <CardTitle className="">
                {title}
                </CardTitle>
                <CardDescription>
                {description}
                </CardDescription>
                </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}