import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { getSession } from "~/sessions";
import ProfileClient from "./profile.client";
import { Role } from "~/types/enums";
import { z } from "zod";
import { updateClientSchema } from "~/util/data/schemas/client/client-schema";
import { components } from "~/sdk";
import { updateProfileSchema } from "~/util/data/schemas/account/profile-schema";

type ActionData = {
  action: string;
  updateClient: z.infer<typeof updateProfileSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "update-client": {
      const d = data.updateClient;
      const res = await client.PUT("/user/profile/me", {
        body: {
          profile: {
            given_name: d.givenName,
            family_name: d.familyName,
            phone_number: d.phoneNumber,
          },
        },
      });
      console.log("UPDATE CLIENT ACTION", res.error);
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail;
      }
      break;
    }
  }
  return json({
    error,
    message,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const clientR = apiClient({ request });
  const session = await getSession(request.headers.get("Cookie"));

  const res = await clientR.GET("/user/profile/me");
  return json({
    profile: res.data?.result.entity,
  });
};

export default function Profile() {
  return (
    <div>
      <ProfileClient />
    </div>
  );
}
