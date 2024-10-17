import { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Typography, { subtitle } from "../typography/Typography";


export default function AccordationLayout({title,children,className}:{
    children:ReactNode
    title:string
    className?:string
}){
    return (
        <div className={className}>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <Typography fontSize={subtitle}>{title}</Typography>
                  </AccordionTrigger>
                  <AccordionContent>
                    {children}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
        </div>
    )
}