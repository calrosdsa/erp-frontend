import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function SquarePlugin() {
  const { t } = useTranslation();
  return (
    <div>
      <Form className="grid gap-y-3 max-w-sm">
        <FormControl required>
          <FormLabel>{t("applicationId")}</FormLabel>
          <Input type="text" name="applicationId" />
        </FormControl>

        <FormControl required>
          <FormLabel>{t("accessToken")}</FormLabel>
          <Input type="password" name="accessToken" />
        </FormControl>

        <FormControl required>
          <FormLabel>{t("locationId")}</FormLabel>
          <Input type="text" name="locationId" />
        </FormControl>

        <Button type="submit">{t("form.submit")}</Button>
      </Form>
    </div>
  );
}
