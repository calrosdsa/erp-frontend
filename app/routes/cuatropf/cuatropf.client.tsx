import React, { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
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
import { Button } from "@/components/ui/button";
import FormCuatropf from "./components/FormCuatropf";

const CuatropfClient = ({}: {}) => {
  let scriptLoaded = false;
  const [country, setCountry] = useState<CountrySelectItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  // const cardButton = useRef<HTMLButtonElement | null>(null)
  let { t, i18n } = useTranslation();

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
    console.log(`Language changed to ${i18n.language}`);
    // Do something here when the language changes
  }, [i18n.language]);

  useEffect(() => {
    if (!scriptLoaded) {
      console.log("sdaskdmskam");
      scriptLoaded = true;
      eventCardListener();
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

      <div
        className="relative z-1 w-full grid md:grid-cols-2 transition-width duration-300 backdrop-blur-md 
      bg-white/20 dark:bg-gray-900/40"
      >
        <div>dasdasdas</div>

        <div className="flex flex-col min-h-screen w-full px-4">
          <header className="py-3 flex justify-between">
            <div className="flex gap-2 items-center">
              <button className="bg-primary p-2 rounded-full">
                <BadgeRoundedIcon />
              </button>
              <h1 className="text-lg font-bold">Cuatropf</h1>
            </div>

            <div className="flex gap-2 items-center">
              <LanguageSelect defaultLanguage={i18n.language} />
              <ColorSchemeToggle />
            </div>
          </header>

          <FormCuatropf />

          <footer className="py-3">
            <p className="text-xs text-center">
              © Cuatropf {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>

      {/* <div
        className="
          fixed
          inset-0
          md:left-1/2
          transition-all
          duration-300
          bg-cover
          bg-center
          bg-no-repeat
          bg-[url('https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2')]
          dark:bg-[url('https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2')]
        "
        style={{
          backgroundColor: "var(--background-level1)",
        }}
      ></div> */}
    </>
  );
};

export default CuatropfClient;
