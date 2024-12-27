import { DependencyList, useEffect } from "react";
import { SetupToolbarOpts, useToolbar } from "./useToolbar";
import { useToast } from "@/components/ui/use-toast";

interface DisplayMessageProps {
  success?: string;
  error?: string;
  onShowMessage?: () => void;
  onSuccessMessage?: () => void;
}

export const useDisplayMessage = (
  props: DisplayMessageProps,
  // props: DisplayMessageProps<T, K>,
  dependencyList: DependencyList = []
) => {
  const { toast } = useToast();

  useEffect(() => {

    if (props.error) {
      toast({
        title: props.error,
      });
      if (props.onShowMessage) {
        props.onShowMessage();
      }
    }
    if (props.success) {
      toast({
        title: props.success as string,
      });
      if (props.onSuccessMessage) {
        props.onSuccessMessage();
      }
      if (props.onShowMessage) {
        props.onShowMessage();
      }
    }
    // Add your effect logic here
  }, dependencyList);
};
