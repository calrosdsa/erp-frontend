import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Props {
    open:boolean
    onOpenChange:(e:boolean)=>void
    title?:string
    description?:string
    onContinue:()=>void
    loading:boolean
}
export default function CustomAlertDialog({
    open,onOpenChange,title,description,onContinue,loading
}:Props) {
    const { t }= useTranslation("common")
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title == undefined ? t("dialog.title"):title}</AlertDialogTitle>
          <AlertDialogDescription>
          {description == undefined ? t("dialog.description"):description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button onClick={onContinue} disabled={loading} className="w-20">
          {loading? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )
            :
            t("continue")
            }
            </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
