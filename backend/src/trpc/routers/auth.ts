import { router, publicProcedure } from "../trpc.ts";
import * as authService from "../../routes/auth/auth.service.ts";
import { TRPCError } from "@trpc/server";
import * as auth from "../../auth.ts";
import * as validation from '../../routes/auth/auth.validation.ts';


export const authRouter = router({
  login: publicProcedure
    .input(validation.loginSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.req.ip) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't get request IP",
        });
      }

      const sessionData = {
        ip: ctx.req.ip,
      };

      const userToken = await authService.login(
        input,
        sessionData.ip
      );

      ctx.res.cookie("user_token", userToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });

      return;
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.cookie("user_token", "", {
      expires: new Date(0),
      path: "/",
    });
    return;
  }),
signup: publicProcedure
    .input(validation.signupSchema)
    .mutation(async ({ input }) => {
        return authService.signup(input);
    }),
  checkPhone: publicProcedure
    .input(validation.checkPhoneSchema)
    .mutation(async ({ input }) => {
        return authService.checkPhone(input);
    }),
  resetPasswordToken: publicProcedure
    .input(validation.resetPasswordTokenSchema)
    .mutation(async ({ input }) => {
        return authService.resetPasswordToken(input);
    }),
resetPassword: publicProcedure
  .input(validation.resetPasswordSchema)
  .mutation(async ({ input }) => {
    const tokenPayload = auth.verifyToken(input.resetToken);

    if (tokenPayload.purpose !== "reset-password") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid reset token",
      });
    }

    await authService.resetPassword(input, tokenPayload.id);

    return;
  })
});