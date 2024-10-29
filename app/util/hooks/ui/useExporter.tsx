import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";
import { Check, TriangleAlert } from "lucide-react";

export const useExporter = () => {
  async function exportExcel(body?: any, fileName?: string) {
    const { id, dismiss, update } = toast({
      title: "DOWNLOAD FILE",
      action: <Icons.spinner />,
      duration: Infinity,
    });
    try {
      const response = await fetch("/api/exporter", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.status)
      if(!response.ok){
        throw new Error("Fail to export data")
      }
      //   const response = await fetch("/api");
      const blob = await response.blob();
      // // Use the Blob (e.g., create a download link)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ? fileName + ".xlsx" : "Book1.xlsx"; // Set a filename if desired
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the URL
      update(
        toast({
          title: "Successfully exported data",
          action: <Check size={16} />,
        })
      );
    } catch (errr) {
      update(
        toast({
          title: "Fail to export data",
          action: <TriangleAlert size={16} />,
        })
      );
    }
  }
  return {
    exportExcel,
  };
};
