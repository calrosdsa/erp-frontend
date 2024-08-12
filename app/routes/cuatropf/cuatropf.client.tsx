import React, { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useTranslation } from "react-i18next";
import { CountrySelectItem } from "~/types/app";
import FormCuatropf from "./components/FormCuatropf";
import FormCuatropfDetail from "./components/FormDetail";

const CuatropfClient = ({}: {}) => {
  const [country, setCountry] = useState<CountrySelectItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  // const cardButton = useRef<HTMLButtonElement | null>(null)
  let { t, i18n } = useTranslation();


  return (
    <>
      <script
        type="text/javascript"
        onLoad={() => {
          // document.addEventListener("DOMContentLoaded", eventCardListener);
        }}
      ></script>


      <div className="min-h-screen">

          <header className="py-3 flex justify-between px-2">
            <div className="flex gap-2 items-center">
              <button className="bg-primary p-2 rounded-full">
                <BadgeRoundedIcon />
              </button>
              <h1 className="text-lg font-bold">Cuatropf</h1>
            </div>

            {/* <div className="flex gap-2 items-center">
              <LanguageSelect defaultLanguage={i18n.language} />
            </div> */}
          </header>

      <div
        className="relative z-1 w-full grid md:grid-cols-2 transition-width duration-300 backdrop-blur-md 
      bg-white/20 dark:bg-gray-900/40"
      >
        <FormCuatropfDetail/>



        <div className="flex flex-col w-full px-4">
          <FormCuatropf />
          <footer className="py-3">
            <p className="text-xs text-center">
              © Cuatropf {new Date().getFullYear()}
            </p>
          </footer>
        </div>
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
