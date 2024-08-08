import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { action } from "../route";
import { useFetcher, useLocation, useSearchParams } from "@remix-run/react";
import Typography, { sm, title } from "@/components/typography/Typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CountrySelect from "~/components/shared/select/CountrySelect";
import { useEffect } from "react";
import { components } from "~/sdk";


type SquareMetadata = {
  objectId:string
  itemGroupUuid:string
  type: "SUBSCRIPTION"
  cardRequest:{
    locationId:string
    sourceId:string
    idempotencyKey:string
  }
}

export default function FormCuatropf() {
  let scriptLoaded = false;
  const fetcher = useFetcher<typeof action>();
  let { t, i18n } = useTranslation();
  const formSchema = z.object({
    givenName: z.string().min(5),
    familyName: z.string().min(5),
    companyName: z.string().min(5),
    email: z.string().email(),
    country: z.object({
      code: z.string(),
      label: z.string(),
      phone: z.string(),
    }),
    phoneNumber: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      givenName: "Jorge",
      familyName: "Miranda",
      companyName: "Teclu",
      email: "jorgemiranda0180@gmail.com",
      phoneNumber: "+1-212-555-4240",
      country:{
        phone:"",
        code:"",
        label:"",
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log(form.getValues());
  }

  const appId = "sandbox-sq0idb-Yos_ndIm__nrRJpcbjQPow";
  const locationId = "L93EC3RZHBZ25";

  async function initializeCard(payments: any) {
    const card = await payments.card();
    await card.attach("#card-container");

    return card;
  }

  async function createPayment(token: any, verificationToken: any) {
    console.log("CREATEPAYMENT")
    const params = new URL(window.location.href)
    const metadata:SquareMetadata = {
      cardRequest:{
        locationId,
        sourceId: token,
        idempotencyKey: window.crypto.randomUUID(),
      },
      objectId:params.searchParams.get("objectId") || "",
      itemGroupUuid:params.searchParams.get("uuid") || "",
      type:"SUBSCRIPTION"
    };

    console.log(form.getValues(),metadata);

    const body:components["schemas"]["CuatropfSubscriptionRequestBody"] = {
      metadata:JSON.stringify(metadata),
      ...form.getValues(),
      plugins:[{
        Plugin:"square"
      }]
    }


    fetcher.submit(body,{
      method:"POST",
      action:`/cuatropf?companyUuid=${params.searchParams.get("companyUuid") || ""}`,
      encType:"application/json"
    })

    // const paymentResponse = await fetch("/payment", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body,
    // });

    // if (paymentResponse.ok) {
    //   return paymentResponse.json();
    // }

    // const errorBody = await paymentResponse.text();
    // throw new Error(errorBody);
  }

  async function tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === "OK") {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }

      throw new Error(errorMessage);
    }
  }

  async function verifyBuyer(payments: any, token: any) {
    const verificationDetails = {
      amount: "1.00",
      billingContact: {
        givenName: "John",
        familyName: "Doe",
        email: "john.doe@square.example",
        phone: "3214563987",
        addressLines: ["123 Main Street", "Apartment 1"],
        city: "London",
        state: "LND",
        countryCode: "GB",
      },
      currencyCode: "GBP",
      intent: "CHARGE",
    };

    const verificationResults = await payments.verifyBuyer(
      token,
      verificationDetails
    );
    return verificationResults.token;
  }

  // status is either SUCCESS or FAILURE;
  function displayPaymentResults(status: any) {
    const statusContainer = document.getElementById(
      "payment-status-container"
    ) as HTMLElement;
    if (status === "SUCCESS") {
      statusContainer.classList.remove("is-failure");
      statusContainer.classList.add("is-success");
    } else {
      statusContainer.classList.remove("is-success");
      statusContainer.classList.add("is-failure");
    }

    statusContainer.style.visibility = "visible";
  }

  const eventCardListener = async () => {
    console.log("load ------");
    if (!window.Square) {
      throw new Error("Square.js failed to load properly");
    }

    let payments: any;
    try {
      payments = window.Square.payments(appId, locationId);
    } catch {
      const statusContainer = document.getElementById(
        "payment-status-container"
      ) as HTMLElement;
      statusContainer.className = "missing-credentials";
      statusContainer.style.visibility = "visible";
      return;
    }

    let card;
    try {
      card = await initializeCard(payments);
    } catch (e) {
      console.error("Initializing Card failed", e);
      return;
    }

    const submitForm = document.getElementById(
      "submit-form"
    ) as HTMLFormElement;

    async function handlePaymentMethodSubmission(
      event: SubmitEvent,
      card: any
    ) {
      event.preventDefault();
      try {
        // disable the submit button as we await tokenization and make a payment request.
        const token = await tokenize(card);
        const verificationToken = await verifyBuyer(payments, token);
        const paymentResults = await createPayment(token, verificationToken);
        displayPaymentResults("SUCCESS");

        console.debug("Payment Success", paymentResults);
      } catch (e: any) {
        displayPaymentResults("FAILURE");
        console.error(e.message);
      }
    }

    submitForm.addEventListener("submit", async function (event) {
      console.log("clicking");
      await handlePaymentMethodSubmission(event, card);
    });
  };

  useEffect(() => {
    if (!scriptLoaded) {
      console.log("sdaskdmskam");
      scriptLoaded = true;
      eventCardListener();
    }
  }, []);

  return (
    <div className="h-full">
      <div className="space-y-8 max-w-xl mx-auto pt-20">
        <Typography fontSize={title}>{t("form.clientDetails")}</Typography>
        <Form {...form}>
          <fetcher.Form
            id="submit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="givenName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.givenName")}</FormLabel>
                      <FormControl>
                        <Input {...field} name="givenName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.familyName")}</FormLabel>
                      <FormControl>
                        <Input {...field} name="familyName" />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />


              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.companyName")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="companyName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.email")}</FormLabel>
                    <FormControl>
                      <Input {...field} name="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CountrySelect form={form} label={t("form.country")} />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field}  name="phoneNumber" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

           
            </div>

            {fetcher.data != undefined && fetcher.data != undefined && (
              <Typography
                fontSize={sm}
                textAlign="start"
                textColor={"danger.400"}
              >
                {fetcher.data.err?.detail}
              </Typography>
            )}

            <div>
           
              <div id="card-container" className="h-32"></div>
              <Button
                id="card-button"
                type="submit"
                variant={"default"}
                className="w-full"
                loading={fetcher.state == "submitting"}
                
              >
                {t("form.pay")}
              </Button>
              <div id="payment-status-container"></div>
            </div>
          </fetcher.Form>
        </Form>
        {/* </fetcher.Form> */}
      </div>
    </div>
  );
}
