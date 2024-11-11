import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CompanyEntityDto = {
  company_id: number | null
  entity_id: number
  entity_name: string
}

interface CompanyEntitySelectorProps {
  entities: CompanyEntityDto[]
  onSelectionChange: (selectedEntities: CompanyEntityDto[]) => void
}

export const CompanyEntitySelector: React.FC<CompanyEntitySelectorProps> = ({ 
  entities, 
  onSelectionChange 
}) => {
  const [selectedEntities, setSelectedEntities] = useState<Set<number>>(new Set())

  const handleCheckboxChange = (entityId: number) => {
    const newSelectedEntities = new Set(selectedEntities)
    if (newSelectedEntities.has(entityId)) {
      newSelectedEntities.delete(entityId)
    } else {
      newSelectedEntities.add(entityId)
    }
    setSelectedEntities(newSelectedEntities)
    onSelectionChange(entities.filter(entity => newSelectedEntities.has(entity.entity_id)))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Entity Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.entity_id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEntities.has(entity.entity_id)}
                    onCheckedChange={() => handleCheckboxChange(entity.entity_id)}
                  />
                </TableCell>
                <TableCell>{entity.entity_name}</TableCell>
                <TableCell>
                  {entity.company_id !== null ? (
                    <Badge variant="default">Enabled</Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}