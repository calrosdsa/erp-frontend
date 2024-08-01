import { Button } from "@mui/joy";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";


const ItemsClient = () =>{
    const { t } = useTranslation()
    return(
        <div>
            <Link to={"./create_item"}>
            <Button>
                {t("create_item")}
            </Button>
            </Link>
        </div>
    )
}

export default ItemsClient;