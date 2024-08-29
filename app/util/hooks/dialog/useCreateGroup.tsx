// import { useState } from "react";
// import AddItemGroupDialog from "~/routes/home.stock.item-groups_/components/add-item-group";

// export default function useCreateGroup() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const createGroupDialog = isDialogOpen && (
//     <AddItemGroupDialog
//       open={isDialogOpen}
//       onOpenChange={setIsDialogOpen}
//     />
//   );

//   return [createGroupDialog, setIsDialogOpen] as const;
// }