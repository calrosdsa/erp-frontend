import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { ReactNode, useEffect, useState } from "react";
import { loader } from "./route";
import { DEFAULT_COMPANY_NAME } from "~/constant";
import { Boxes } from "lucide-react";
import { useTranslation } from "react-i18next";

const AuthClient = ({ children }: { children: ReactNode }) => {
  const { company } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  const location = useLocation()
  const [currentRoute,setCurrentRoute] = useState<string |undefined>(undefined)

  const getCurrnetRoute = (pathName:string) =>{
    const lastDotIndex = pathName.lastIndexOf("/")
    const str = pathName.slice(lastDotIndex+1)
    const translateRoute = t(str)
    setCurrentRoute(translateRoute)
  }
  useEffect(()=>{
    getCurrnetRoute(location.pathname)
  },[location.pathname])
  return (
    <>
      <div className="md:hidden">
        {/* <img
        src="/examples/authentication-light.png"
        width={1280}
        height={843}
        alt="Authentication"
        className="block dark:hidden"
      />
      <img
        src="/examples/authentication-dark.png"
        width={1280}
        height={843}
        alt="Authentication"
        className="hidden dark:block"
      /> */}
      </div>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
           {currentRoute}
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            {company && company.logo != "" ? (
              <img src={company.logo || ""} alt={company.name}  className="h-24 w-24 object-contain"/>
            ) : (
              <Boxes className="h-6 w-6" />
            )}
            {company ? company.name : DEFAULT_COMPANY_NAME}
          </div>
          <div className="relative z-20 mt-auto">
            {/* <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote> */}
          </div>
        </div>

        <div className="lg:p-8 relative h-full flex justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {/* <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div> */}

            {children}
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>

          {/* <div className="py-3 absolute bottom-3 ">
            <p className="text-xs text-center ">
              © {company ? company.name:DEFAULT_COMPANY_NAME} {new Date().getFullYear()}
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AuthClient;
