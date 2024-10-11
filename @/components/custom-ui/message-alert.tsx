import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MessageAlertProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

export default function MessageAlert({
  title,
  message,
  variant = "default",
}: MessageAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    default: "",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  if (!isVisible) return null;

  return (
    <Alert
      className={`${variantStyles[variant]} rounded-lg my-1 relative`}
    >
      {title && (
        <AlertTitle className="text-lg font-semibold mb-2 pr-6">
          {title}
        </AlertTitle>
      )}
      <AlertDescription className="text-sm pr-6">{message}</AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1 right-1 text-current hover:bg-primary-foreground/10 p-1 h-auto"
        onClick={() => setIsVisible(false)}
        aria-label="Close message"
      >
        <X className="h-3 w-3" />
      </Button>
    </Alert>
  );
}
