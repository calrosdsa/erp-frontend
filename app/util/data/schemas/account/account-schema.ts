import { z } from "zod";


export const updatePasswordSchema = z.object({
    password:z.string(),
    newPassword:z.string().min(8),
    confirmNewPassword:z.string().min(8),
})