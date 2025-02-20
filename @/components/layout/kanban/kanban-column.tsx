import { Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./kanban-board";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PaintBucketIcon,
  Pencil,
  Plus,
  SaveIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOnClickOutside } from "usehooks-ts";
import React from "react";
import ColorPicker from "@/components/custom/popover/color-picker";
import { TooltipLayout } from "../tooltip-layout";
import { Card } from "@/components/ui/card";
interface KanbanColumnProps<T> {
  column: KanbanColumn<T>;
  index: number;
  selectColumn: number | null;
  editColumn: (e: KanbanColumn<T>) => void;
  addColumn: (index: number) => void;
  removeColumn: (index: number) => void;
  deleteColumn: (e: KanbanColumn<T>) => void;
  setSelectColumn: React.Dispatch<React.SetStateAction<number | null>>;
  headerComponent: (e: T[]) => JSX.Element;
  cardComponent: (e: T) => JSX.Element;
}

export default function KanbanColumnComponent<T>({
  column,
  index,
  selectColumn,
  setSelectColumn,
  addColumn,
  editColumn,
  removeColumn,
  deleteColumn,
  headerComponent,
  cardComponent,
}: KanbanColumnProps<T>) {
  const [hoveredColumn, setHoveredColumn] = React.useState<number | null>(null);
  const [formColumn, setFormColumn] = useState<KanbanColumn<T>>({
    id: 0,
    name: "",
    color: "",
    index: 0,
    data: [],
    entity_id: 0,
  });
  const columnHeaderRef = React.useRef<HTMLInputElement | null>(null);
  const [allowClickOutside, setAllowClickOutside] = useState(true);

  const handleClickOutside = () => {
    // setTimeout(()=>{
    // if (allowClickOutside) {
    //   console.log("CLICK OUTSIDE");
    //   setSelectColumn(null);
    // }
    // },100)
  };

  useOnClickOutside(columnHeaderRef, handleClickOutside);

  useEffect(() => {
    setFormColumn(column);
  }, [column]);

  return (
    <Draggable
      key={index}
      draggableId={index.toString()}
      index={index}
      isDragDisabled={selectColumn != null}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex min-w-64 min-h-[90vh] bg-gray-100  flex-col rounded-sm border-r border-l"
        >
          <div
            {...provided.dragHandleProps}
            onMouseEnter={() => setHoveredColumn(index)}
            onMouseLeave={() => {
              setHoveredColumn(null);
            }}
            className={cn(
              "flex items-center justify-between rounded-t-sm cursor-default p-1"
              // "cursor-move" // Add this class to indicate draggable
            )}
            style={{
              backgroundColor: formColumn.color,
            }}
          >
            {selectColumn == index ? (
              <Input
                ref={columnHeaderRef}
                autoFocus
                value={formColumn.name}
                onChange={(e) =>
                  setFormColumn({ ...formColumn, name: e.target.value })
                }
                className="h-5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-xs"
              />
            ) : (
              <span className="text-gray-100 text-xs">{formColumn.name}</span>
            )}
            <div className={`flex items-center space-x-2`}>
              {selectColumn == index ? (
                <>
                  <ColorPicker
                    onChange={(e) => {
                      setFormColumn({ ...formColumn, color: e });
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-white rounded-full"
                    >
                      <PaintBucketIcon className="h-4 w-4" />
                    </Button>
                  </ColorPicker>
                  <TooltipLayout content="Guardar Cambios">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        editColumn(formColumn);
                        setSelectColumn(null);
                      }}
                      className="h-5 w-5 text-white rounded-full"
                    >
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                  </TooltipLayout>
                  <TooltipLayout content="Cancelar">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectColumn(null);
                        setFormColumn(column);
                      }}
                      className="h-5 w-5 text-white rounded-full"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </TooltipLayout>
                </>
              ) : (
                <div
                  className={`flex items-center space-x-2 transition-opacity duration-300 ease-in-out ${
                    hoveredColumn === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white rounded-full"
                    onClick={() => {
                      setSelectColumn(null);
                      deleteColumn(column);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 p-[1px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white rounded-full"
                    onClick={() => {
                      setSelectColumn(index);
                    }}
                  >
                    <Pencil className="h-4 w-4 p-[1px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      addColumn(index);
                      setSelectColumn(index + 1);
                    }}
                    className="h-5 w-5 text-white rounded-full hover:scale-105 hover:transition-all 
                hover:duration-300 hover:ease-in-out"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {headerComponent(column.data)}
          <Droppable droppableId={column.id.toString()} type="DEAL">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 space-y-4 overflow-y-auto p-4"
              >
                {column.data.map((item, index) => {
                  const id = (item["id" as keyof T] as number).toString()
                  return (
                    <Draggable
                      key={id}
                      draggableId={id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className=" "
                          
                        >
                          <div className="bg-white p-4 rounded-lg border-0 border-l-2" style={{
                            borderColor:column.color,
                          }}>
                          {cardComponent(item)}
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
