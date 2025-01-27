import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "@remix-run/react";
import { Check, TriangleAlert } from "lucide-react";
import type { PathsWithMethod } from "openapi-typescript-helpers";
import { components, paths } from "~/sdk";

function mapSearchParamsToObject(url: string): Record<string, string> {
  const urlObj = new URL(url); // Create a URL object from the given URL string
  const searchParams = new URLSearchParams(urlObj.search); // Extract search parameters

  // Initialize an empty object to store the key-value pairs
  const paramsObject: Record<string, string> = {};

  // Iterate over the search parameters and map them to the object
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  return paramsObject;
}

export const useExporter = () => {
  const [searchParams] = useSearchParams();
  async function exportExcel(
    path: PathsWithMethod<paths, "post">,
    fileName?: string
  ) {
    const { update } = toast({
      title: "DOWNLOAD FILE",
      action: <Icons.spinner />,
      duration: Infinity,
    });
    try {
      const paramsObject: Record<string, string> = {};

      // Iterate over the search parameters and map them to the object
      searchParams.forEach((value, key) => {
        paramsObject[key] = value;
      });

      const response = await fetch("/api/exporter", {
        method: "POST",
        body: JSON.stringify({
          path: path,
          data: JSON.stringify(paramsObject),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Fail to export data");
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

  async function exportPdf(
    path: PathsWithMethod<paths, "post">,
    data:components["schemas"]["ExportDocumentData"],
    fileName?: string
  ) {
    const { update } = toast({
      title: "DOWNLOAD FILE",
      action: <Icons.spinner />,
      duration: Infinity,
    });
    try {

      const response = await fetch("/api/pdf", {
        method: "POST",
        body: JSON.stringify({
          path: path,
          data: data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Fail to export data");
      }
      //   const response = await fetch("/api");
      const blob = await response.blob();
      // // Use the Blob (e.g., create a download link)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ? fileName + ".pdf" : "document.pdf"; // Set a filename if desired
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
  


  // async function exportExcel(body?: any, fileName?: string) {
  //   const { id, dismiss, update } = toast({
  //     title: "DOWNLOAD FILE",
  //     action: <Icons.spinner />,
  //     duration: Infinity,
  //   });
  //   try {
  //     const response = await fetch("/api/exporter", {
  //       method: "POST",
  //       body: JSON.stringify(body),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log(response.status);
  //     if (!response.ok) {
  //       throw new Error("Fail to export data");
  //     }
  //     //   const response = await fetch("/api");
  //     const blob = await response.blob();
  //     // // Use the Blob (e.g., create a download link)
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName ? fileName + ".xlsx" : "Book1.xlsx"; // Set a filename if desired
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url); // Clean up the URL
  //     update(
  //       toast({
  //         title: "Successfully exported data",
  //         action: <Check size={16} />,
  //       })
  //     );
  //   } catch (errr) {
  //     update(
  //       toast({
  //         title: "Fail to export data",
  //         action: <TriangleAlert size={16} />,
  //       })
  //     );
  //   }
  // }
  return {
    exportExcel,
    exportPdf,
    // exportD,
  };
};
