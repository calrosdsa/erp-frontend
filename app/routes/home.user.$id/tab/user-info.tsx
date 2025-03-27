import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayValue } from "@/components/ui/custom/display-info";
import { z } from "zod";
import { components } from "~/sdk";

export default function ProfileInfo({ profile }: { profile: components["schemas"]["ProfileDto"] }) {
  return (
    <div className="grid lg:grid-cols-6 w-full gap-3">
      <Card className=" lg:col-span-2 ">
        <CardContent className="grid place-content-center p-2">
          <Avatar className=" h-56 w-56">
            {/* <AvatarImage
              className=" h-56 w-56"
              src={profile.}
              alt={profile.fullname}
            /> */}
            <AvatarFallback className=" h-56 w-56">
              {profile.given_name.charAt(0)}.{profile.family_name.charAt(0)}.
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
      <Card className=" lg:col-span-4">
        <CardHeader>
          <CardTitle>Informacion del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <DisplayValue label="Nombre" value={profile.given_name} />
          <DisplayValue label="Apellido" value={profile.family_name} />
          <DisplayValue label="Email" value={profile.email} />
          <DisplayValue label="Numero de Telefono" value={profile.phone_number} />


        </CardContent>
      </Card>
    </div>
  );
}
