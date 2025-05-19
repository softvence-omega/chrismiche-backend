import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required." }).email(),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

// const forgetPasswordValidationSchema = z.object({
//   body: z.object({
//     email: z.string({
//       required_error: "User email is required!",
//     }),
//   }),
// });

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    resetToken: z.string(),
    password: z.string().min(6),
  }),
});


export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
