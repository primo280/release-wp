import { RegisterUserAuthForm } from "@/components/auth/register-user-auth-form"
import { RegisterUserAuthFormDr } from "@/components/auth/register-user-auth-form.dr"
import { authRoutes } from "@/constants/auth"
import { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"

import { PrivacyAcceptanceDr } from "../privacy-acceptance.dr"
import { AuthProvidersDr } from "../providers.dr"

export default async function SignUpPage({
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
        login: true,
        signUpPage: {
          createAnAccount: true,
          enterEmail: true,
        },
        auth: {
          orContinueWith: true,
        },
      },
      AuthProvidersDr,
      PrivacyAcceptanceDr,
      RegisterUserAuthFormDr
    )
  )

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
     <div className="hidden min-h-screen bg-green-500 bg-[url('/bg-login.webp')] bg-cover bg-center lg:block"></div>

     
      
      <div className="flex items-center justify-center bg-black px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{dictionary.signUpPage.createAnAccount}</h1>
            <p className="text-sm text-gray-400">{dictionary.signUpPage.enterEmail}</p>
          </div>

          <RegisterUserAuthForm dictionary={dictionary} isMinimized searchParams={searchParams} locale={lang} />

          <div className="text-center text-sm text-gray-400">
            Vous avez déjà un compte ?{" "}
            <a href={authRoutes.signIn[0]} className="font-semibold text-green-400 hover:underline">
              {dictionary.login}
            </a>
          </div>
        </div>
      </div>
    </main> 


  )
}
