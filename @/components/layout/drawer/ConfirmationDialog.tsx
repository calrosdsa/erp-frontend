import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { create } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
}: TopConfirmationDialogProps) {
  const { payload } = useConfirmationDialog();
  const handleConfirm = () => {
    payload?.onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (payload?.onCancel) {
      payload?.onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange} >
      <AlertDialogContent className="fixed top-20 left-1/2 -translate-x-1/2 m-auto w-full max-w-sm sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 ">
            {payload?.title || "Por favor, confirma antes de proceder."}
          </AlertDialogTitle>
          {payload?.description && (
            <AlertDialogDescription className="p-2 border rounded-md">
              {payload?.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogDescription className="sm:justify-start">
          <div className="flex flex-col-reverse sm:flex-row w-full sm:justify-between gap-2">
            <AlertDialogCancel onClick={handleCancel}>
              {payload?.cancelLabel || "Cancelar"}
            </AlertDialogCancel>
            {!payload?.hideConfirmButton && (
              <AlertDialogAction onClick={handleConfirm}>
                {payload?.confirmLabel || "Confirmar"}
              </AlertDialogAction>
            )}
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface Payload {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  hideConfirmButton?: boolean;
}

interface ConfirmationDialogStore {
  payload?: Payload;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpenDialog: (opts: Payload) => void;
}

export const useConfirmationDialog = create<ConfirmationDialogStore>((set) => ({
  isOpen: false,
  onOpenChange: (e) =>
    set(() => ({
      isOpen: e,
    })),
  onOpenDialog: (e) =>
    set(() => ({
      payload: e,
      isOpen: true,
    })),
}));
