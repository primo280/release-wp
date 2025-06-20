import * as bip39 from "bip39"
import { randomUUID } from "crypto"
import * as OTPAuth from "otpauth"
import { z } from "zod"

import {
  desactivateTotpSchema,
  generateTotpSecretResponseSchema,
  recover2FASchema,
  signUpSchema,
  verifyTotpSchema,
} from "@/api/auth/schemas"
import { emailVerificationExpiration, lastLocaleExpirationInSeconds, otpWindow, rolesAsObject } from "@/constants"
import { logoUrl } from "@/constants/medias"
import { hash } from "@/lib/bcrypt"
import { env } from "@/lib/env"
import { Locale } from "@/lib/i18n-config"
import { _getDictionary } from "@/lib/langs"
import { sendMail } from "@/lib/mailer"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { ApiError, ensureLoggedIn, generateRandomSecret, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { logger } from "@djalon/lib"
import VerifyEmail from "@djalon/transactional/emails/verify-email"
import { Prisma } from "@prisma/client"
import { render } from "@react-email/render"

import { signUpResponseSchema } from "../me/schemas"

export const register = async ({ input }: apiInputFromSchema<typeof signUpSchema>) => {
  const { email, password, username } = input
  try {
    if (env.DISABLE_REGISTRATION === true) {
      return ApiError("registrationDisabled")
    }
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        lastLocale: input.locale,
      },
      include: {
        profilePicture: true,
      },
    })
    await redis.setex(`lastLocale:${user.id}`, lastLocaleExpirationInSeconds, input.locale)

    //* Send verification email
    if (env.NEXT_PUBLIC_ENABLE_MAILING_SERVICE === true) {
      const token = randomUUID()
      await prisma.userEmailVerificationToken.create({
        data: {
          identifier: user.id,
          token: token,
          expires: new Date(Date.now() + emailVerificationExpiration),
        },
      })
      const verificationLink = `${env.VERCEL_URL ?? env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
      const locale = input.locale as Locale
      const dictionary = await _getDictionary("transactionals", locale, {
        hey: true,
        verifyEmail: true,
        footer: true,
        thanksForSigninUpCompleteRegistration: true,
        verifyYourEmailAddress: true,
        verifyYourEmailAddressToCompleteYourRegistration: true,
      })
      const element = VerifyEmail({
        verificationLink,
        actionText: dictionary.verifyEmail,
        contentTitle: dictionary.thanksForSigninUpCompleteRegistration,
        footerText: dictionary.footer,
        heyText: dictionary.hey,
        logoUrl,
        name: user.name ?? "",
        previewText: dictionary.verifyYourEmailAddressToCompleteYourRegistration,
        supportEmail: env.SUPPORT_EMAIL ?? "",
        titleText: dictionary.verifyYourEmailAddress,
      })
      const text = render(element, {
        plainText: true,
      })
      const html = render(element)

      await sendMail({
        to: email.toLowerCase(),
        subject: dictionary.verifyYourEmailAddress,
        text,
        html,
      })
    } else {
      logger.debug("Email verification disabled, skipping email sending on registration")
    }

    const data: z.infer<ReturnType<typeof signUpResponseSchema>> = { user }
    return data
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error.meta
        if (!meta) return ApiError("accountAlreadyExists")
        if ((meta.target as Array<string>).includes("email")) {
          return ApiError("email.exist")
        } else if ((meta.target as Array<string>).includes("username")) {
          return ApiError("username.exist")
        }
      }
    }
    return handleApiError(error)
  }
}

export const generateTotpSecret = async ({ ctx: { session } }: apiInputFromSchema<typeof undefined>) => {
  ensureLoggedIn(session)
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    })
    if (!user) return ApiError("userNotFound")
    if (env.NEXT_PUBLIC_IS_DEMO && user.role === rolesAsObject.admin) return ApiError("demoAdminCannotHaveOtpSecret")
    if (user.otpSecret && user.otpVerified) return ApiError("otpSecretAlreadyExists")
    const secret = generateRandomSecret()
    let mnemonic = bip39.generateMnemonic()
    let it = 0
    //? Check if mnemonic doesnt contain two words that are the same
    while (mnemonic.split(" ").length !== new Set(mnemonic.split(" ")).size) {
      mnemonic = bip39.generateMnemonic()
      it++
      if (it > 100) throw new Error("Could not generate a valid mnemonic")
    }
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        otpSecret: secret,
        otpMnemonic: mnemonic,
      },
    })
    if (!user.email) return ApiError("unknownError")
    const totp = new OTPAuth.TOTP({
      issuer: "djalon",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret,
    })
    const response: z.infer<ReturnType<typeof generateTotpSecretResponseSchema>> = {
      success: true,
      url: totp.toString(),
      mnemonic,
    }
    return response
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export const verifyTotp = async ({ input, ctx: { session } }: apiInputFromSchema<typeof verifyTotpSchema>) => {
  ensureLoggedIn(session)
  try {
    const { token } = verifyTotpSchema().parse(input)
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    })
    if (!user) return ApiError("userNotFound")
    if (!user.otpSecret) return ApiError("otpSecretNotFound")
    const totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: user.otpSecret,
    })
    const isValid =
      totp.validate({
        token,
        window: otpWindow,
      }) !== null
    if (user.otpVerified === false && isValid) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          otpVerified: true,
        },
      })
    }
    if (!isValid) return ApiError("otpInvalid")
    return { success: true }
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export const desactivateTotp = async ({
  ctx: { session },
  input,
}: apiInputFromSchema<typeof desactivateTotpSchema>) => {
  ensureLoggedIn(session)
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    })
    if (!user) return ApiError("userNotFound")
    if (!user.otpSecret) return ApiError("otpSecretNotFound")
    const totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: user.otpSecret,
    })
    const isValid =
      totp.validate({
        token: input.token,
        window: otpWindow,
      }) !== null
    if (!isValid) return ApiError("otpInvalid")
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        otpSecret: "",
        otpMnemonic: "",
        otpVerified: false,
      },
    })
    return { success: true }
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export const recover2FA = async ({ input }: apiInputFromSchema<typeof recover2FASchema>) => {
  try {
    const { email, mnemonic } = recover2FASchema().parse(input)
    const tries = await redis.get(`recover2FA:${email.toLowerCase()}`)
    if (tries && Number(tries) > 5) return ApiError("tooManyAttempts")
    await redis.setex(`recover2FA:${email.toLowerCase()}`, 60 * 60, Number(tries) + 1) //? 1 hour
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    })
    if (!user) return ApiError("invalidCredentials")
    if (!user.otpSecret) return ApiError("invalidCredentials")
    const isValid = mnemonic === user.otpMnemonic
    if (!isValid) return ApiError("invalidCredentials")
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otpSecret: "",
        otpMnemonic: "",
        otpVerified: false,
      },
    })
    return { success: true }
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
