import { Button } from "@/components/ui/button";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemColumns } from "./components/itemColumns";


const ItemsClient = () =>{
    const { t } = useTranslation()
    const {data}= useLoaderData<typeof loader>()
    return(
        <div>
            <Link to={"./create_item"}>
            <Button>
                {t("create_item")}
            </Button>
            </Link>

            <div className="py-2">
                <DataTable
                data={data?.pagination_result.results || []}
                columns={itemColumns()}
                />
            </div>

        </div>
    )
}

export default ItemsClient;