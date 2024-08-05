import React, { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { IndexHtmlTransform } from "vite";
import ColorSchemeToggle from "~/components/shared/button/ColorSchemeToggle";
import GoogleIcon from "~/components/shared/icon/GoogleIcon";
import { useActionData, useFetcher } from "@remix-run/react";
import { action, handle } from "./route";
import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/joy";
import CountrySelect from "~/components/shared/select/CountrySelect";
import LanguageSelect from "~/components/shared/select/LanguageSelect";
import { CountrySelectItem } from "~/types/app";

const CuatropfClient = ({}: {}) => {
  let scriptLoaded = false
  const fetcher = useFetcher<typeof action>();
  const [country,setCountry] = useState<CountrySelectItem |null>(null)
  const [phoneNumber,setPhoneNumber] = useState("")
  // const cardButton = useRef<HTMLButtonElement | null>(null)
  let { t,i18n } = useTranslation();
  console.log("LOAD");

  const appId = "sandbox-sq0idb-Yos_ndIm__nrRJpcbjQPow";
  const locationId = "L93EC3RZHBZ25";

  async function initializeCard(payments: any) {
    const card = await payments.card();
    await card.attach("#card-container");

    return card;
  }

  async function createPayment(token: any, verificationToken: any) {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
      verificationToken,
      idempotencyKey: window.crypto.randomUUID(),
    });

    const paymentResponse = await fetch("/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (paymentResponse.ok) {
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
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
    console.log("load ------")
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
      event:SubmitEvent,
      card: any
    ) {
      event.preventDefault();
      try {
        // disable the submit button as we await tokenization and make a payment request.
        const token = await tokenize(card);
        const verificationToken = await verifyBuyer(payments, token);
        const paymentResults = await createPayment(
          token,
          verificationToken
        );
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
    
  }

  useEffect(() => {
    console.log(`Language changed to ${i18n.language}`);
    // Do something here when the language changes
  }, [i18n.language]);

  useEffect(() => {
    if(!scriptLoaded){
      console.log("sdaskdmskam")
      scriptLoaded =true
      eventCardListener()
    }
    // document.addEventListener("load", eventCardListener);
    // return () =>{  
    //   window.removeEventListener("load",eventCardListener);
    // }
   
    //   cardButton.addEventListener("click", async function (event) {
    //     console.log("clicking");
    //   });
    //   return () => {
    //     window.removeEventListener("click",async function (event) {
    //       console.log("clicking");
    //     });
    //   };
    // }
  }, []);

  return (
    <>
      <script
        type="text/javascript"
        onLoad={() => {
          // document.addEventListener("DOMContentLoaded", eventCardListener);
        }}
      ></script>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": {
              "--Form-maxWidth": "800px",
              "--Transition-duration": "0.4s", // set to `none` to disable transition
            },
          }}
        />
        <Box
          sx={(theme) => ({
            width: { xs: "100%", md: "50vw" },
            transition: "width var(--Transition-duration)",
            transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "flex-end",
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255 255 255 / 0.2)",
            [theme.getColorSchemeSelector("dark")]: {
              backgroundColor: "rgba(19 19 24 / 0.4)",
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100dvh",
              width: "100%",
              px: 2,
            }}
          >
            <Box
              component="header"
              sx={{
                py: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                <IconButton variant="soft" color="primary" size="sm">
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">Cuatropf</Typography>
              </Box>

              <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                <LanguageSelect
                defaultLanguage={i18n.language}
                />
              <ColorSchemeToggle />
              </Box>
            </Box>
            <Box
              component="main"
              sx={{
                my: "auto",
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 550,
                mx: "auto",
                borderRadius: "sm",
                "& form": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                },
                [`& .MuiFormLabel-asterisk`]: {
                  visibility: "hidden",
                },
              }}
            >
              <Stack gap={4} sx={{ mt: 2 }}>
                <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
                  <Typography level="title-lg">
                    {t("form.clientDetails")}
                  </Typography>
                </Box>
                <fetcher.Form
                id="submit-form"
                  method="post"
                >
                <Grid container spacing={2} columns={16} sx={{ flexGrow: 1 }}>
                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.givenName")}</FormLabel>
                      <Input type="text" name="givenName" />
                    </FormControl>
                  </Grid>
                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.familyName")}</FormLabel>
                      <Input type="text" name="familyName" />
                    </FormControl>
                  </Grid>

                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.companyName")}</FormLabel>
                      <Input type="text" name="companyName" />
                    </FormControl>
                  </Grid>

                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.email")}</FormLabel>
                      <Input type="email" name="email" />
                    </FormControl>
                  </Grid>

                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.country")}</FormLabel>
                      <CountrySelect setCountry={(e)=>setCountry(e)}/>
                      {/* <Input type="text" name="country" /> */}
                    </FormControl>
                  </Grid>

                  <Grid xs={16} sm={8}>
                    <FormControl required>
                      <FormLabel>{t("form.phoneNumber")}</FormLabel>
                      <Input type="text" name="phoneNumber" onChange={(e)=>setPhoneNumber(e.target.value)}
                      value={country != null ? `+${country.phone} ${phoneNumber}` :phoneNumber }
                      />
                    </FormControl>
                  </Grid>

                </Grid>

                {fetcher.data != undefined &&
                  fetcher.data.error != undefined && (
                    <Typography
                      level="body-xs"
                      textAlign="start"
                      textColor={"danger.400"}
                    >
                      {fetcher.data.error.detail}
                    </Typography>
                  )}

                <Stack gap={4} sx={{ mt: 2 }}>
                  {/* <Button
                      type="submit"
                      fullWidth
                      loading={fetcher.state == "submitting"}
                    >
                      Continuar
                    </Button> */}

                    <div id="card-container" className="h-14"></div>
                    <Button id="card-button" type="submit">
                      Pay $1.00
                    </Button>
                  <div id="payment-status-container"></div>
                </Stack>
                  </fetcher.Form>
                {/* </fetcher.Form> */}
              </Stack>
            </Box>

            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" textAlign="center">
                © Cuatropf {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={(theme) => ({
            height: "100%",
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            left: { xs: 0, md: "50vw" },
            transition:
              "background-image var(--Transition-duration), left var(--Transition-duration) !important",
            transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
            backgroundColor: "background.level1",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
            [theme.getColorSchemeSelector("dark")]: {
              backgroundImage:
                "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
            },
          })}
        />
     
    </>
  );
};

export default CuatropfClient;
