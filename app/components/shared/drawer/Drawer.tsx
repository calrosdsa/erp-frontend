import * as React from "react";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import { DialogContent, DialogTitle, ModalClose, Sheet } from "@mui/joy";
import { ModalBackdrop } from "@mui/joy/Modal/Modal";

// type Anchors = 'left' | 'top' | 'right' | 'bottom';

export default function DrawerLayout({
    open,close,children,title=""
}:{
    open:boolean
    close:()=>void
    children:React.ReactNode
    title:string
}) {
 


  

  return (
       <Drawer
       anchor={"top"}
       open={open}
       onClose={close}
       variant="plain"
       slotProps={{
         content: {
           sx: {
            bgcolor: 'transparent',
            p: { md: 3, sm: 0 },
            boxShadow: 'none',
            zIndex:70
           },
         },
         backdrop:{
            sx:{
                zIndex:60
            }
         }
       }}
     >
       <Sheet
         sx={{
           borderRadius: "md",
           p: 2,
           gap: 2,
           width:400,
           marginX:"auto",
           overflow: "auto",
         }}
       >
         <DialogContent sx={{ gap: 2 }}>
           <DialogTitle>{title}</DialogTitle>
           <ModalClose />
           {children}
         </DialogContent>
       </Sheet>
     </Drawer>
  );
}
