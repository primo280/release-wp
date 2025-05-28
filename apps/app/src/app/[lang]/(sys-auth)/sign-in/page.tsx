import { LoginUserAuthForm } from "@/components/auth/login-user-auth-form"
import { LoginUserAuthFormDr } from "@/components/auth/login-user-auth-form.dr"
import { authRoutes } from "@/constants/auth"
import { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

import { PrivacyAcceptanceDr } from "../privacy-acceptance.dr"
import { AuthProvidersDr } from "../providers.dr"

export default async function SignInPage({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    lang: Locale
  }
}) {
  const dictionary = await getDictionary(
    lang,
    dictionaryRequirements(
      {
        signInPage: {
          loginToYourAccount: true,
          enterDetails: true,
        },
        toSignUp: true,
        auth: {
          orContinueWith: true,
        },
      },
      AuthProvidersDr,
      PrivacyAcceptanceDr,
      LoginUserAuthFormDr
    )
  )
  //const session = await auth()

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <button className="absolute right-4 top-4 rounded border p-2 text-gray-400 transition-colors duration-200 hover:bg-green-700 md:right-8 md:top-8">
        <a href={authRoutes.signUp[0]}>{dictionary.toSignUp}</a>
      </button>

      <div className="hidden min-h-screen bg-green-500 bg-[url('/bg-login.webp')] bg-cover bg-center lg:block"></div>

      <div className="flex flex-col items-center justify-center lg:p-8">
        <div className="w-full max-w-md rounded-lg p-10 shadow-xl">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-white">{dictionary.signInPage.loginToYourAccount}</h1>
            <p className="text-lg text-gray-400">{dictionary.signInPage.enterDetails}</p>
          </div>

          <div className="mt-6 space-y-6">
            <LoginUserAuthForm dictionary={dictionary} searchParams={searchParams} />

            <div className="flex flex-row items-center justify-center gap-x-1">
              <div className="h-px w-16 bg-gray-600" />
              <span className="text-sm uppercase text-gray-400">ou continuez avec</span>
              <div className="h-px w-16 bg-gray-600" />
            </div>

            <button className="flex w-full items-center justify-center gap-x-2 rounded border border-green-700 bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm">
              <FcGoogle size={20} />
              <span className="text-white"> Continuer avec Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            En cliquant sur Inscription, vous acceptez nos{" "}
            <a href="#" className="font-semibold text-green-500 hover:underline">
              Conditions dutilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="font-semibold text-green-500 hover:underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
import { FcGoogle } from "react-icons/fc"