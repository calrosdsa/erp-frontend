import { useTranslation } from "react-i18next";
import { UserAuthForm } from "./components/user-signin-form";

const SignInClient = ({}: {}) => {
  let { t } = useTranslation();

  return (
    <>
      <UserAuthForm/> 
    </>
  );
};

export default SignInClient;
