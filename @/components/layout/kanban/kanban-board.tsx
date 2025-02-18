"use client";

import * as React from "react";
import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { components } from "~/sdk";
import { cn } from "@/lib/utils";

interface KanbanLayout<T> {
  data?: T[];
  stages?: components["schemas"]["StageDto"][];
}

type StageDto = components["schemas"]["StageDto"];

interface Column<T> extends StageDto {
  data: T[];
  // Aquí puedes agregar propiedades o métodos adicionales
}

export function KanbanBoard<T>({ stages, data }: KanbanLayout<T>) {
  const [columns, setColumns] = React.useState<Column<T>[]>([]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const newColumns = Array.from(columns);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      if (reorderedColumn == undefined) return;
      newColumns.splice(destination.index, 0, reorderedColumn);
      setColumns(newColumns);
      return;
    }

    // Copy current state
    const newColumns = [...columns];

    // Find source and destination columns
    const sourceColumn = newColumns.find(
      (col) => col.id.toString() === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id.toString() === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    // Get the moved deal
    const [movedDeal] = sourceColumn.data.splice(source.index, 1);

    // Insert the deal in the destination
    console.log("MOVE DEAL", movedDeal);
    if (movedDeal) {
      destColumn.data.splice(destination.index, 0, movedDeal);
    }

    setColumns(newColumns);
  };

  const groupData = (stages: StageDto[], data?: T[]): Column<T>[] => {
    return stages.map((stage) => ({
      ...stage,
      data: data?.filter((item) => item["stage_id" as keyof T] === stage.id) || [],
    }));
  };

  React.useEffect(() => {
    if (stages) {
      const groupedData = groupData(stages,data);
      setColumns(groupedData);
    }
  }, [data, stages]);

  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal" >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex h-full w-full gap-4 overflow-x-auto p-4"
          >
            {columns?.map((column, index) => (
              <Draggable
                key={column.id}
                draggableId={column.id.toString()}
                index={index}
                
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex h-full w-80 flex-none flex-col rounded-lg border shadow-lg "
                  >
                    <div
                      {...provided.dragHandleProps}
                      onMouseEnter={()=>{console.log("ON MOUSE ENTER")}}
                      className={cn(
                        "flex items-center justify-between rounded-t-lg",
                        // "cursor-move" // Add this class to indicate draggable
                      )}
                      style={{
                        backgroundColor: column.color,
                      }}
                    >
                      <h3 className="font-medium text-white p-1">
                        {column.name}{" "}
                        <span className="text-sm text-muted-foreground">
                          {/* ({column.deals.length}) */}
                        </span>
                      </h3>
                    </div>
                    <div className="mt-2 text-2xl font-bold text-blue-900">
                      {/* ${getColumnTotal(column.deals)} */}
                      $0
                    </div>
                    <Droppable droppableId={column.id.toString()} type="DEAL">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex-1 space-y-4 overflow-y-auto p-4"
                        >
                          {/* {column.deals.map((deal, index) => (
                            <Draggable
                              key={deal.id}
                              draggableId={deal.id}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{deal.title}</h4>
                                    <span className="text-sm text-muted-foreground">
                                      ${deal.amount}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    {deal.contact}
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    {deal.timestamp}
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          ))} */}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <div className="p-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-blue-900"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add deal
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
