import React from "react";
import { GroupedItem } from "./TreeDescendents";
import { CornerDownRight, FolderIcon } from "lucide-react";
import Typography, { labelF, subtitle } from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { routes } from "~/util/route";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface TreeNodeProps extends GroupedItem {}

const TreeNode: React.FC<TreeNodeProps> = ({
  uuid,
  name,
  is_group,
  depth,
  children,
}) => {
    const r = routes
    
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div 
    //   className="flex space-x-2 py-2 items-center "
      className={cn(
        "flex space-x-2 py-2 items-center ",
        // path === item.href && "bg-muted font-bold hover:bg-muted"
      )}
      >
        {is_group ? <FolderIcon size={17} /> : <CornerDownRight size={17} />}       
            <Link to={r.toSupplierGroup(name,uuid)} className=" underline">
          <Typography fontSize={labelF}>{name}</Typography>
            </Link>
      </div>
      {is_group && children && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.uuid}
              uuid={child.uuid}
              name={child.name}
              is_group={child.is_group}
              depth={child.depth}
              children={child.children}
              parent_uuid={child.parent_uuid}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;

// import React from "react";
// import { GroupedItem } from "./TreeDescendents";
// import { CornerDownRight, FolderIcon } from "lucide-react";
// import Typography, { subtitle } from "@/components/typography/Typography";

// // Define TreeNodeProps using the GroupedItem interface
// interface TreeNodeProps extends GroupedItem {}

// const TreeNode: React.FC<TreeNodeProps> = ({
//   uuid,
//   name,
//   is_group,
//   depth,
//   children,
// }) => {
//   return (
//     <div style={{ marginLeft: depth * 20 }}>
//   <div className="flex space-x-2 py-2 items-center">
//     {is_group ? <FolderIcon size={17} />:<CornerDownRight size={17}/>}
//     <Typography fontSize={subtitle}>{name}</Typography>
//   </div>
//       {is_group && children && (
//         <div>
//           {children.map((child) => (
//             <TreeNode
//               key={child.uuid}
//               uuid={child.uuid}
//               name={child.name}
//               is_group={child.is_group}
//               depth={child.depth}
//               children={child.children}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TreeNode;
