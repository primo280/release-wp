"use client"

import { useCallback, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { updateUserSchema } from "@/api/me/schemas"
import { useAccount } from "@/hooks/account"
import { env } from "@/lib/env"
import { TDictionary } from "@/lib/langs"
import { trpc } from "@/lib/trpc/client"
import { logger } from "@djalon/lib"
import { zodResolver } from "@hookform/resolvers/zod"

import FormField from "../ui/form"
import NeedSavePopup from "../ui/need-save-popup"

import GenerateTotp from "./totp/generate"
import UpdateAvatar from "./avatar"
import { UpdateAccountDr } from "./update-account.dr"

//? Put only the fields you can update withou password confirmation
const nonSensibleSchema = updateUserSchema

type INonSensibleForm = z.infer<ReturnType<typeof nonSensibleSchema>>

export default function UpdateAccount({
  sessionHasVerifiedEmail,
  dictionary,
}: {
  sessionHasVerifiedEmail: boolean
  dictionary: TDictionary<typeof UpdateAccountDr>
}) {
  const utils = trpc.useUtils()

  const { update } = useSession()
  const account = useAccount()

  const hasVerifiedEmail = env.NEXT_PUBLIC_ENABLE_MAILING_SERVICE
    ? account.data?.user.emailVerified === undefined
      ? sessionHasVerifiedEmail
      : account.data.user.emailVerified
    : true

  const updateUserMutation = trpc.me.updateUser.useMutation({
    onSuccess: async (data) => {
      logger.debug("User updated")
      await update()
      utils.me.getAccount.invalidate()
      form.reset({
        username: data.user.username ?? "",
      })
    },
  })

  const [isNotSensibleInformationsUpdated, setIsNotSensibleInformationsUpdated] = useState<boolean>(false)

  const form = useForm<INonSensibleForm>({
    resolver: zodResolver(nonSensibleSchema(dictionary)),
    values: {
      username: account.data?.user.username || "",
    },
  })

  const resetForm = useCallback(() => {
    form.reset({
      username: account.data?.user.username ?? "",
    })
  }, [account.data?.user, form])

  if (form.formState.isDirty && !isNotSensibleInformationsUpdated) {
    setIsNotSensibleInformationsUpdated(true)
  } else if (!form.formState.isDirty && isNotSensibleInformationsUpdated) {
    setIsNotSensibleInformationsUpdated(false)
  }

  async function onUpdateNonSensibleInforation(data: INonSensibleForm) {
    if (!hasVerifiedEmail) return
    updateUserMutation.mutate(data)
  }

  return (
    <div className="relative mt-2 flex flex-col gap-4">
      <div className="mt-3 flex flex-row items-center gap-3">
        <UpdateAvatar account={account} dictionary={dictionary} />
        <div className="flex flex-1 flex-col gap-2">
          <form onSubmit={form.handleSubmit(onUpdateNonSensibleInforation)} className="grid gap-2">
            <FormField
              form={form}
              name="username"
              label={dictionary.profilePage.profileDetails.username.label}
              type="text"
              autoComplete="off"
              isDisabled={updateUserMutation.isPending || account.isLoading || !hasVerifiedEmail}
            />
            <NeedSavePopup
              show={isNotSensibleInformationsUpdated}
              onReset={resetForm}
              isSubmitting={updateUserMutation.isPending}
              text={dictionary.needSavePopup}
              dictionary={dictionary}
            />
          </form>
        </div>
      </div>
      <GenerateTotp account={account} dictionary={dictionary} />
      {!hasVerifiedEmail && (
        <div className="absolute -inset-2 z-10 !m-0 flex items-center justify-center backdrop-blur-sm">
          <p className="text-center text-sm font-semibold text-muted-foreground">
            {dictionary.errors.emailNotVerified}
          </p>
        </div>
      )}
    </div>
  )
}
