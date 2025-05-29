import { DependencyList, useEffect } from "react";
import { SetupToolbarOpts, useToolbar } from "./use-toolbar";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface DisplayMessageProps {
  toastID?: string | number;
  success?: string;
  error?: string;
  onShowMessage?: () => void;
  onSuccessMessage?: () => void;
  onErrorMessage?: () => void;
}

export const displayMessage = (props: DisplayMessageProps) => {
  if (props.error) {
    toast.error(props.error, {
      id: props.toastID,
    });
    if (props.onShowMessage) {
      props.onShowMessage();
    }
  }
  if (props.success) {
    toast.success(props.success as string, {
      id: props.toastID,
    });
    if (props.onSuccessMessage) {
      props.onSuccessMessage();
    }
    if (props.onShowMessage) {
      props.onShowMessage();
    }
  }
};

export const useDisplayMessage = (
  props: DisplayMessageProps,
  // props: DisplayMessageProps<T, K>,
  dependencyList: DependencyList = []
) => {
  // const { toast } = useToast();

  useEffect(() => {
    displayMessage(props);
    // Add your effect logic here
  }, dependencyList);
};
