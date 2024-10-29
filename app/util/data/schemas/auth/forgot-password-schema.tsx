import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
});
