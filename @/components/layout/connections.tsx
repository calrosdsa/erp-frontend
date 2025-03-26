import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from 'lucide-react'
import { Link } from '@remix-run/react'
import { components } from '~/sdk'
import { route } from '~/util/route'




export default function Connections({ data,q }: {
    data: components["schemas"]["PartyConnections"][]
    q?:Record<string,string | undefined>
}) {
  const r = route
  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* <CardTitle>{title}</CardTitle> */}
      </CardHeader>
      <CardContent className=' detail-grid'>
        {data.map((connection, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{connection.connections}</Badge>
              <Link to={r.to(connection.href,q)} 
              className="font-medium hover:underline">{connection.entity}</Link>
              {/* <span className="text-sm text-muted-foreground">({connection.party_type})</span> */}
            </div>
            {/* <Button asChild variant="link" size="sm">
              <Link to={r.to(connection.href,{
                ...(connection.connections == 1) ? {
                  id:connection.party_id.toString(),
                }:{
                  ...q
                }
              })}>View</Link>
            </Button> */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}



// import { ConnectionModule } from "~/types/connections";
// import Typography, { subtitle } from "../typography/Typography";
// import { Badge } from "../ui/badge";
// import IconButton from "../custom-ui/icon-button";
// import { PlusIcon } from "lucide-react";
// import { Link } from "@remix-run/react";

// export default function Connections({
//   connections,
// }: {
//   connections: ConnectionModule[];
// }) {
//   return (
//     <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//       {connections.map((item, idx) => {
//         if (item.connections.length == 0) {
//           return;
//         }
//         return (
//           <div key={idx}>
//             <Typography fontSize={subtitle}>{item.title}</Typography>

//             <div className=" flex flex-col space-y-2 py-2 px-0">
//               {item.connections.map((t, idx) => {
//                 return (
//                   <div key={idx} className="flex space-x-2">
//                     <Badge variant={"outline"} className="flex space-x-2 h-9">
//                       {t.count && (
//                         <Badge
//                           variant={"outline"}
//                           className=" rounded-full h-7 w-7"
//                         >
//                           {t.count}
//                         </Badge>
//                       )}
//                       <Link to={t.href} className="link">
//                         {t.entity}
//                       </Link>
//                     </Badge>
//                     {t.newHref && (
//                       <Link to={t.newHref}>
//                         <IconButton icon={PlusIcon} size="md" />
//                       </Link>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
