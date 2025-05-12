import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { useTranslation } from "react-i18next"

interface Action<T> {
  label: string
  onClick: (items: T[]) => void
  isEnabled: (items: T[]) => boolean
}

interface GenericActionsDropdownProps<T> {
  selectedItems: T[]
  actions: Action<T>[]
}

export function GenericActionsDropdown<T>({
  selectedItems,
  actions,
}: GenericActionsDropdownProps<T>) {
  const { t } = useTranslation()

  const enabledActions = useMemo(() => {
    return actions.map(action => ({
      ...action,
      enabled: action.isEnabled(selectedItems)
    }))
  }, [actions, selectedItems])

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
        Acciones <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {enabledActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(selectedItems)}
            disabled={!action.enabled}
          >
            {t(action.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// import React, { useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { components } from "~/sdk";
// import { State } from "~/gen/common";

// interface BookingActionsDropdownProps {
//   selectedBookings: components["schemas"]["BookingDto"][];
//   onComplete?: (state:State) => void;
//   onCancel?: (state:State) => void;
//   onDelete?: (state:State) => void;
// }

// export function ActionsDropdown({
//   selectedBookings,
//   onComplete,
//   onCancel,
//   onDelete,
// }: BookingActionsDropdownProps) {
//   const { t } = useTranslation();

//   const { canComplete, canCancel, canDelete } = useMemo(() => {
//     const allUnpaidOrPartiallyPaid = selectedBookings.every(
//       (booking) =>
//         booking.status === "UNPAID" || booking.status === "PARTIALLY_PAID"
//     );
//     const allCancelled = selectedBookings.every(
//       (booking) => booking.status === "CANCELLED"
//     );
//     const hasUnpaidPartiallyPaidOrCompleted = selectedBookings.some((booking) =>
//       ["UNPAID", "PARTIALLY_PAID", "COMPLETED",].includes(booking.status)
//     );

//     return {
//       canComplete: allUnpaidOrPartiallyPaid,
//       canCancel: hasUnpaidPartiallyPaidOrCompleted,
//       canDelete: allCancelled,
//     };
//   }, [selectedBookings]);

//   if (selectedBookings.length === 0) {
//     return null;
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size={"sm"}>
//           Acciones <ChevronDown className="ml-2 h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         {onComplete &&
//         <DropdownMenuItem onClick={()=>onComplete(State.COMPLETED)} disabled={!canComplete}>
//           Completar
//         </DropdownMenuItem>
//         }
//         {onCancel && 
//         <DropdownMenuItem onClick={()=>onCancel(State.CANCELLED)} disabled={!canCancel}>
//           Cancelar
//         </DropdownMenuItem>
//         }
//         {onDelete &&
//         <DropdownMenuItem onClick={()=>onDelete(State.DELETED)} disabled={!canDelete}>
//           Eliminar
//         </DropdownMenuItem>
//         }
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
