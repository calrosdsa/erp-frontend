import React, { useState, useCallback, useMemo } from 'react'
import { ChevronRight, ChevronDown, Folder, File, ChevronUp, Plus, Edit, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TreeItem = {
  id: number
  is_group: boolean
  name: string
  parent: number
  uuid: string
}

type TreeViewProps = {
  data: TreeItem[] | undefined
  onAddChild?: (parentId: number) => void
  onEdit?: (item: TreeItem) => void
  onViewLedger?: (item: TreeItem) => void
}

export const TreeView: React.FC<TreeViewProps> = ({ data, onAddChild, onEdit, onViewLedger }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  const toggleExpand = useCallback((id: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const expandAll = useCallback(() => {
    if (data) {
      const allGroupIds = data.filter(item => item.is_group).map(item => item.id)
      setExpandedItems(new Set(allGroupIds))
    }
  }, [data])

  const collapseAll = useCallback(() => {
    setExpandedItems(new Set())
  }, [])

  const treeStructure = useMemo(() => {
    if (!data) return {}
    const structure: Record<number, TreeItem[]> = {}
    data.forEach(item => {
      if (!structure[item.parent]) {
        structure[item.parent] = []
      }
      structure[item.parent]?.push(item)
    })
    return structure
  }, [data])

  const handleItemClick = useCallback((id: number) => {
    setSelectedItem(prevSelected => prevSelected === id ? null : id)
  }, [])

  const renderTreeItems = useCallback((parentId: number = 0, level = 0) => {
    const items = treeStructure[parentId] || []
    return items.map(item => (
      <div key={item.id} className={cn("pl-4", level > 0 && "ml-4 border-l border-gray-200")}>
        <div className="flex items-center space-x-5 py-2 px-2 hover:bg-gray-100 rounded-md">
          <div 
            className={cn(
              "flex items-center cursor-pointer",
              item.is_group && "font-semibold"
            )}
            onClick={() => {
              handleItemClick(item.id)
              if (item.is_group) toggleExpand(item.id)
            }}
          >
            {item.is_group && (
              expandedItems.has(item.id) ? (
                <ChevronDown className="w-4 h-4 mr-1 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 text-gray-500" />
              )
            )}
            {item.is_group ? (
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            ) : (
              <File className="w-4 h-4 mr-2 text-gray-500" />
            )}
            <span className=' hover:underline'>{item.name}</span>
          </div>
          {selectedItem === item.id && (
            <div className="flex space-x-2">
              {item.is_group ? (
                <>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onAddChild && onAddChild(item.id)}
                    className="flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Child
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onEdit && onEdit(item)}
                    className="flex items-center"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onEdit && onEdit(item)}
                    className="flex items-center"
                  >
                    Edit
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onViewLedger && onViewLedger(item)}
                    className="flex items-center"
                  >
                    View Ledger
                  </Button> */}
                </>
              )}
            </div>
          )}
        </div>
        {(item.is_group && expandedItems.has(item.id)) && renderTreeItems(item.id, level + 1)}
      </div>
    ))
  }, [expandedItems, treeStructure, toggleExpand, onAddChild, onEdit, onViewLedger, selectedItem, handleItemClick])

  if (!data) return null

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={expandAll}
          className="flex items-center"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAll}
          className="flex items-center"
        >
          <ChevronUp className="w-4 h-4 mr-1" />
          Collapse All
        </Button>
      </div>
      {renderTreeItems(0)}
    </div>
  )
}
