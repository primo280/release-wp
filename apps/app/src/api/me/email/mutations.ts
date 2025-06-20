import { randomUUID } from "crypto"
import { z } from "zod"

import { sendVerificationEmailSchema, verifyEmailResponseSchema, verifyEmailSchema } from "@/api/me/schemas"
import { emailVerificationExpiration, resendEmailVerificationExpiration } from "@/constants"
import { logoUrl } from "@/constants/medias"
import { env } from "@/lib/env"
import { i18n, Locale } from "@/lib/i18n-config"
import { _getDictionary } from "@/lib/langs"
import { sendMail } from "@/lib/mailer"
import { prisma } from "@/lib/prisma"
import { ApiError, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { logger } from "@djalon/lib"
import VerifyEmail from "@djalon/transactional/emails/verify-email"
import { render } from "@react-email/render"

export const sendVerificationEmail = async ({ input }: apiInputFromSchema<typeof sendVerificationEmailSchema>) => {
  try {
    const { silent, email: iEmail, user: iUser } = input
    const email = (iUser ? iUser.email?.toLowerCase() : iEmail?.toLowerCase()) ?? ""
    const user = iUser ?? (await prisma.user.findUnique({ where: { email } }))

    const token = randomUUID()

    if (!user) {
      logger.debug("User not found")
      return { email }
    }

    if (user.emailVerified) {
      if (silent) return { email }
      logger.debug("User email already verified")
      return ApiError("emailAlreadyVerified", "BAD_REQUEST")
    }

    const userEmailVerificationToken = await prisma.userEmailVerificationToken.findFirst({
      where: {
        identifier: user.id,
      },
    })
    if (userEmailVerificationToken) {
      //? If silent, return early
      if (silent) return { email }

      const isToRecent = userEmailVerificationToken.createdAt.getTime() + resendEmailVerificationExpiration > Date.now()
      if (isToRecent) {
        if (logger.allowDebug()) {
          const availableIn = Math.round(
            (userEmailVerificationToken.createdAt.getTime() + resendEmailVerificationExpiration - Date.now()) / 1000
          )
          logger.debug("Verification email already sent: ", availableIn, "seconds left")
        }
        return ApiError("emailAlreadySentPleaseTryAgainInFewMinutes", "BAD_REQUEST")
      }
      await prisma.userEmailVerificationToken.delete({
        where: {
          identifier: userEmailVerificationToken.identifier,
        },
      })
    }

    if (env.NEXT_PUBLIC_ENABLE_MAILING_SERVICE === true) {
      await prisma.userEmailVerificationToken.create({
        data: {
          identifier: user.id,
          token: token,
          expires: new Date(Date.now() + emailVerificationExpiration),
        },
      })
      const verificationLink = `${env.VERCEL_URL ?? env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
      const locale = (user.lastLocale as Locale | null) ?? i18n.defaultLocale
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
      logger.debug("Email verification disabled")
      if (silent) return { email }
      return ApiError("emailServiceDisabled", "PRECONDITION_FAILED")
    }

    return { email }
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export const verifyEmail = async ({ input }: apiInputFromSchema<typeof verifyEmailSchema>) => {
  try {
    const { token } = input

    const userEmailVerificationToken = await prisma.userEmailVerificationToken.findUnique({
      where: {
        token: token,
      },
    })
    if (!userEmailVerificationToken) {
      logger.debug("Token not found")
      return ApiError("tokenNotFound", "BAD_REQUEST")
    }

    await prisma.userEmailVerificationToken.delete({
      where: {
        identifier: userEmailVerificationToken.identifier,
      },
    })

    if (userEmailVerificationToken.expires.getTime() < Date.now()) {
      logger.debug("Token expired")
      return ApiError("tokenExpired", "BAD_REQUEST")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userEmailVerificationToken.identifier,
      },
    })
    if (!user) {
      logger.debug("User not found")
      return ApiError("userNotFound", "BAD_REQUEST")
    }

    if (user.emailVerified) {
      logger.debug("User email already verified")
      return ApiError("emailAlreadyVerified", "BAD_REQUEST")
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    const data: z.infer<ReturnType<typeof verifyEmailResponseSchema>> = {
      success: true,
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
