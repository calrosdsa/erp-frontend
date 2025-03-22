import { useTranslation } from "react-i18next";
import { Gender } from "~/types/app-types";


export const getGenders = ():Gender[] =>{
    const {t} = useTranslation("common")
    return [
        {
            name:t("gender.male"),
            code:"MALE",
        },
        {
            name:t("gender.female"),
            code:"FEMALE"
        },
        // {
        //     name:t("gender.transgender"),
        //     code:"TRANSGENDER"
        // },
        // {
        //     name:t("gender.noBinary"),
        //     code:"NO_BINARY"
        // },
    ]
}
// export const genders:Gender[] = [
//     {
//         name:"gender.male",
//         code:"MALE",
//     },
//     {
//         name:"gender.female",
//         code:"FEMALE"
//     },
//     {
//         name:"gender.trasgender",
//     }
// ]