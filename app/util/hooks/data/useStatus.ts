import { State } from "~/gen/common";

export const useStatus = ({ status }: { status: State }) => {
  const isCompleted = status == State.COMPLETED;
  const isCancelled = status == State.CANCELLED;
  const toBill = status == State.TO_BILL;
  const isSubmitted = status == State.SUBMITTED
  const toReceive = status == State.TO_RECEIVE;
  const enabledOrder = !isCompleted && !isCancelled;
  return {
      isCompleted,
      toBill,
      toReceive,
      isCancelled,
      isSubmitted,
      enabledOrder,
   };
};
