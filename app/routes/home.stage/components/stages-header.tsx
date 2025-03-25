import { useMemo, useState } from "react";
import { components } from "~/sdk";


type StageDto =  components["schemas"]["StageDto"]

interface StagesHeaderProps {
  stages: StageDto[];
  selectedStageID?: number;
  transition: (destinationStage:StageDto) => void;
}

export default function StagesHeader({
  stages,
  transition,
  selectedStageID,
}: StagesHeaderProps) {
  // Track the currently hovered stage index
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(
    null
  );

  const data = useMemo(() => {
    const selectedStage = stages.find((item) => item.id === selectedStageID);
    const hoveredStage =
      hoveredStageIndex !== null
        ? stages.find((item) => item.index === hoveredStageIndex)
        : null;

    return stages.map((item) => {
      let currentColor = "#9ca3af"; // default color

      if (hoveredStage) {
        // When hovering, update color for stages before or equal to the hovered one
        if (item.index <= hoveredStage.index) {
          currentColor = hoveredStage.color;
        }
      } else if (selectedStage) {
        // Otherwise, use the selected stage color for stages before or equal to the selected one
        if (item.index <= selectedStage.index) {
          currentColor = selectedStage.color;
        }
      }
      return { ...item, currentColor };
    });
  }, [selectedStageID, stages, hoveredStageIndex]);

  const transitionToStage = (destinationStage:StageDto) => {
    transition(destinationStage);
  };

  return (
    <div className="flex space-x-1 rounded-sm pt-3">
      {data.map((stage) => (
        <div
          key={stage.id}
          style={{
            borderColor: stage.color,
            backgroundColor: stage.currentColor,
          }}
          className="px-2 py-1 text-gray-100 rounded-sm border-b-2 w-32 cursor-pointer transition-colors duration-200"
          onMouseEnter={() => setHoveredStageIndex(stage.index)}
          onMouseLeave={() => setHoveredStageIndex(null)}
          onClick={() => transitionToStage(stage)}
        >
          <span className="text-sm font-medium">{stage.name}</span>
        </div>
      ))}
    </div>
  );
}
