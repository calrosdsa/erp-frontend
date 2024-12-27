import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from 'lucide-react'
import { Link } from '@remix-run/react'
import { components } from '~/sdk'



interface ConnectionsProps {
  data: components["schemas"]["PartyConnections"][]
}

export default function Connections({ data }: {
    data: components["schemas"]["PartyConnections"][]
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* <CardTitle>{title}</CardTitle> */}
      </CardHeader>
      <CardContent>
        {data.map((connection, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{connection.connections}</Badge>
              <span className="font-medium">{connection.entity}</span>
              <span className="text-sm text-muted-foreground">({connection.party_type})</span>
            </div>
            <Button asChild variant="link" size="sm">
              <Link to={connection.href}>View</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

