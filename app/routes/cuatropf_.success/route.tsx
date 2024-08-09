import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { CheckIcon } from "lucide-react";
import { ClientOnly } from "remix-utils/client-only";

export default function CuatropfSuccess() {
  return (
    <ClientOnly>
      {() => {
        return (
          <div className=" flex justify-center items-center h-screen">
          <Card className=" max-w-sm">
            <CardHeader>
              <CardTitle>Subscription process completed.</CardTitle>
              <CardDescription>Your subscription process is complete. An email with your credentials has
                 been sent so you can sign in to the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className=" flex justify-center">
              <CheckIcon
              className="text-green-500"
              color="green"
              size={50}
              />
            </CardContent>
            <CardFooter>
              <Link to={"/signin"} className="w-full">
              <Button className="w-full">Sign In</Button>
              </Link>
            </CardFooter>
          </Card>
          </div>
        );
      }}
    </ClientOnly>
  );
}
