import React, { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type CompanyEntityDto = {
  company_id: number | null
  entity_id: number
  entity_name: string
  enabled: boolean
}

interface CompanyEntitySelectorProps {
  entities: CompanyEntityDto[]
  onSelectionChange: (selectedEntities: CompanyEntityDto[]) => void
  onEnableDisable: (entitiesToUpdate: CompanyEntityDto[], enable: boolean) => void
}

export const CompanyEntitySelector: React.FC<CompanyEntitySelectorProps> = ({ 
  entities, 
  onSelectionChange,
  onEnableDisable
}) => {
  const [selectedEntities, setSelectedEntities] = useState<Set<number>>(new Set())
  const [filteredEntities, setFilteredEntities] = useState<CompanyEntityDto[]>(entities)
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all')

  useEffect(() => {
    setFilteredEntities(
      filter === 'all' ? entities :
      filter === 'enabled' ? entities.filter(e => e.enabled) :
      entities.filter(e => !e.enabled)
    )
  }, [entities, filter])

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

  const handleEnableDisable = (enable: boolean) => {
    const entitiesToUpdate = entities.filter(entity => selectedEntities.has(entity.entity_id))
    onEnableDisable(entitiesToUpdate, enable)
    // Reset selection after action
    setSelectedEntities(new Set())
  }

  const toggleAll = () => {
    if (selectedEntities.size === filteredEntities.length) {
      setSelectedEntities(new Set())
    } else {
      setSelectedEntities(new Set(filteredEntities.map(e => e.entity_id)))
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Entities</CardTitle>
        <CardDescription>Manage your company entities</CardDescription>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter('enabled')}
              className={filter === 'enabled' ? 'bg-primary text-primary-foreground' : ''}
            >
              Enabled
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter('disabled')}
              className={filter === 'disabled' ? 'bg-primary text-primary-foreground' : ''}
            >
              Disabled
            </Button>
          </div>
          <div className="space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleEnableDisable(true)}
              disabled={selectedEntities.size === 0}
            >
              Enable Selected
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleEnableDisable(false)}
              disabled={selectedEntities.size === 0}
            >
              Disable Selected
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedEntities.size === filteredEntities.length && filteredEntities.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Entity Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntities.map((entity) => (
                <TableRow key={entity.entity_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEntities.has(entity.entity_id)}
                      onCheckedChange={() => handleCheckboxChange(entity.entity_id)}
                    />
                  </TableCell>
                  <TableCell>{entity.entity_name}</TableCell>
                  <TableCell>
                    <Badge variant={entity.enabled ? "default" : "secondary"}>
                      {entity.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}