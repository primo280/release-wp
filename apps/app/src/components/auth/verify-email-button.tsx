"use client"

import { Session } from "next-auth"
import { BadgeCheck } from "lucide-react"
import { toast } from "react-toastify"

import { useAccount } from "@/hooks/account"
import { TDictionary } from "@/lib/langs"
import { trpc } from "@/lib/trpc/client"
import { logger } from "@djalon/lib"
import { Button } from "@nextui-org/button"

import { VerifyEmailButtonDr } from "./verify-email-button.dr"

export default function VerifyEmailButton({
  session,
  dictionary,
}: {
  session: Session
  dictionary: TDictionary<typeof VerifyEmailButtonDr>
}) {
  const account = useAccount()
  const hasVerifiedEmail = session.user.emailVerified || !!account.data?.user.emailVerified

  const resendVerificationEmailMutation = trpc.me.sendVerificationEmail.useMutation({
    onSuccess: () => {
      toast(dictionary.emailVerificationSentDescription)
    },
  })

  const handleResendVerificationEmail = () => {
    if (!session.user.email) {
      logger.error("No email found in session")
      return
    }
    resendVerificationEmailMutation.mutate({
      email: session.user.email,
    })
  }

  if (hasVerifiedEmail) {
    return (
      <p className="flex w-max flex-1 items-center space-x-2 font-medium text-primary">
        <BadgeCheck className="inline-block size-5" />
        <span>{dictionary.emailAlreadyVerified}</span>
      </p>
    )
  }

  return (
    <Button
      onClick={handleResendVerificationEmail}
      isLoading={resendVerificationEmailMutation.isPending}
      className="flex-1 md:w-max"
      variant="flat"
      color="primary"
    >
      {dictionary.resendVerificationEmail}
    </Button>
  )
}
