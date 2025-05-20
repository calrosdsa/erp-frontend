import * as React from "react";
import {
  DragDropContext,
  DraggableLocation,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { components } from "~/sdk";
import KanbanColumnComponent from "./kanban-column";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/home.stage/route";
import { route } from "~/util/route";
import { useConfirmationDialog } from "../drawer/ConfirmationDialog";

interface KanbanLayout<T> {
  data?: T[];
  stages?: components["schemas"]["StageDto"][];
  headerComponent: (e: T[], stage: StageDto) => JSX.Element;
  cardComponent: (e: T) => JSX.Element;
  dataTransition: (
    source: DraggableLocation<string>,
    destination: DraggableLocation<string>,
    data: T,
    srcColumn: string,
    tgtColumn: string
  ) => void;
}

type StageDto = components["schemas"]["StageDto"];

export interface KanbanColumn<T> extends StageDto {
  data: T[];
  // Aquí puedes agregar propiedades o métodos adicionales
}

export function KanbanBoard<T>({
  stages,
  data,
  dataTransition,
  headerComponent,
  cardComponent,
}: KanbanLayout<T>) {
  const [columns, setColumns] = React.useState<KanbanColumn<T>[]>([]);
  const [selectColumn, setSelectColumn] = React.useState<number | null>(null);
  const stageFetcher = useFetcher<typeof action>();
  const confirmationDialog = useConfirmationDialog();
  const stageTransition = (sourceIndex: number, destinationIndex: number) => {
    const source = columns[sourceIndex];
    const destination = columns[destinationIndex];
    if (source != undefined && destination != undefined) {
      const body: components["schemas"]["StageTransitionData"] = {
        source_id: source.id,
        source_index: sourceIndex,
        destionation_index: destinationIndex,
        destination_id: destination.id,
      };
      stageFetcher.submit(
        {
          stageTransition: body,
          action: "stage-transition",
        },
        {
          action: route.toRoute({ main: route.stage }),
          method: "POST",
          encType: "application/json",
        }
      );
    }
  };
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination || !source) return;

    if (type === "COLUMN") {
      const newColumns = Array.from(columns);
      console.log("SOURCE", source, "DESTINATION", destination);
      const [reorderedColumn] = newColumns.splice(source.index, 1);
      if (reorderedColumn == undefined) return;
      newColumns.splice(destination.index, 0, reorderedColumn);
      console.log("NEW COLUMNS", newColumns);
      setColumns(newColumns);
      stageTransition(source.index, destination.index);
      return;
    }

    // Copy current state
    const newColumns = [...columns];
    console.log("SOURCE", source);
    console.log("DESTINATION", destination);
    // Find source and destination columns
    const sourceColumn = newColumns.find(
      (col) => col.id.toString() === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id.toString() === destination.droppableId
    );

    console.log("source Column", sourceColumn);
    console.log("dest Column", destColumn);

    if (!sourceColumn || !destColumn) return;

    // Get the moved deal
    const [movedDeal] = sourceColumn.data.splice(source.index, 1);

    // Insert the deal in the destination
    console.log("MOVE DEAL", movedDeal);
    if (movedDeal) {
      dataTransition(
        source,
        destination,
        movedDeal,
        sourceColumn.name,
        destColumn.name
      );
      destColumn.data.splice(destination.index, 0, movedDeal);
    }

    setColumns(newColumns);
  };

  const groupData = (stages: StageDto[], data?: T[]): KanbanColumn<T>[] => {
    return stages.map((stage) => ({
      ...stage,
      data:
        data?.filter((item) => item["stage_id" as keyof T] === stage.id) || [],
    }));
  };

  const mapToStageData = (e: KanbanColumn<T>) => {
    const d: components["schemas"]["StageData"] = {
      fields: {
        color: e.color,
        entity_id: e.entity_id,
        index: e.index,
        name: e.name,
      },
      id: e.id,
    };
    return d;
  };

  const deleteColumn = (e: KanbanColumn<T>) => {
    const allowDeleteColumn = e.data.length == 0;
    confirmationDialog.onOpenDialog({
      hideConfirmButton: !allowDeleteColumn,
      onConfirm: () => {
        stageFetcher.submit(
          {
            action: "delete",
            id: e.id.toString(),
          },
          {
            encType: "application/json",
            action: route.toRoute({ main: route.stage }),
            method: "POST",
          }
        );
      },
      description: allowDeleteColumn
        ? "¿Estás seguro de que deseas eliminar la columna?"
        : "Este escenario no está vacío. ⚠️",
    });
  };

  const editColumn = (e: KanbanColumn<T>) => {
    stageFetcher.submit(
      {
        action: "edit",
        data: mapToStageData(e),
      },
      {
        encType: "application/json",
        action: route.toRoute({ main: route.stage }),
        method: "POST",
      }
    );
  };
  const saveColumn = (e: KanbanColumn<T>) => {
    stageFetcher.submit(
      {
        action: "create",
        data: mapToStageData(e),
      },
      {
        encType: "application/json",
        action: route.toRoute({ main: route.stage }),
        method: "POST",
      }
    );
  };

  const addColumn = (index: number) => {
    if (stages == undefined) return;
    const prevColumns = [...columns.slice(0, index + 1)];
    const nextColumns = [...columns.slice(index + 1)];
    console.log("PREV", prevColumns, "index", index);
    console.log("NEXT", nextColumns);
    // Create new column with default values
    const newColumn: KanbanColumn<T> = {
      id: 0,
      index: index + 1,
      name: ``,
      color: "#004777",
      data: [],
      entity_id: stages[0]?.entity_id || 0,
    };
    // Update indexes for subsequent columns
    const adjustedColumns = nextColumns.map((col) => ({
      ...col,
      index: col.index + 1,
    }));
    const newColumns = [...prevColumns, newColumn, ...adjustedColumns];
    console.log("NEW COLUMNS", newColumns);
    setColumns(newColumns);
    saveColumn(newColumn);
  };

  React.useEffect(() => {
    console.log("STAGE FETCHER", stageFetcher.data);
  }, [stageFetcher]);

  React.useEffect(() => {
    if (stages) {
      const groupedData = groupData(stages, data);
      console.log("NEW GROUPDATA", groupedData);
      setColumns(groupedData);
    }
  }, [data, stages]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex w-96 h-full gap-2  overflow-auto"
          >
            {columns.map((column, index) => (
              <div className="w-64">

              <KanbanColumnComponent
                column={column}
                index={index}
                addColumn={addColumn}
                deleteColumn={deleteColumn}
                selectColumn={selectColumn}
                setSelectColumn={setSelectColumn}
                removeColumn={() => {}}
                editColumn={editColumn}
                headerComponent={headerComponent}
                cardComponent={cardComponent}
              />
                </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
