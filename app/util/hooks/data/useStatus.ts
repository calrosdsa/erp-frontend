import { State } from "~/gen/common";

export const useStatus = ({ status }: { status: State }) => {
  const isCompleted = status == State.COMPLETED;
  const isCancelled = status == State.CANCELLED;
  const toBill = status == State.TO_BILL;
  const enabledOrder = !isCompleted && !isCancelled;
  return {
      isCompleted,
      toBill,
      isCancelled,
      enabledOrder,
   };
};
