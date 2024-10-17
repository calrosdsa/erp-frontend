import IconButton from "@/components/custom-ui/icon-button"
import Typography, { subtitle } from "@/components/typography/Typography"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "@remix-run/react"
import { MoreVertical } from "lucide-react"
import { ReactNode } from "react"
import { ChartType } from "~/gen/common"
import { routes } from "~/util/route"


export default function ChartDisplay({
    children,title,description,chartType
}:{
    children:ReactNode
    title:string
    description?:string
    chartType:ChartType
}){
    const r = routes
    const navigate = useNavigate()
    return (
        <Card className="w-full">
            <CardHeader >
                <div className="flex w-full  justify-between space-x-2">
                <div>
                <CardTitle className="">
                {title}
                </CardTitle>
                <CardDescription>
                {description}
                </CardDescription>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <IconButton
                        icon={MoreVertical}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                    <Link className="flex items-center justify-start gap-4 p-2 cursor-pointer" 
                    to={r.torChart(chartType)}>
                    </Link>

                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                </div>
                </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}