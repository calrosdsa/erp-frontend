import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";
import { Typography } from "../typography";

export default function AccordationLayout({
  title,
  children,
  className,
  containerClassName,
  open,
}: {
  children: ReactNode;
  title: string;
  className?: string;
  open?: boolean;
  containerClassName?: string;
}) {
  return (
    <div className={cn(containerClassName, "")}>
      <Accordion type="single" collapsible defaultValue={open ? "item-1":""}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Typography variant="subtitle2">{title}</Typography>
          </AccordionTrigger>
          <AccordionContent className={cn(className, "px-1")}>
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
