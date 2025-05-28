import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { RegisterUserAuthForm } from "@/components/auth/register-user-auth-form"
import { RegisterUserAuthFormDr } from "@/components/auth/register-user-auth-form.dr"
import CardTitle from "@/components/ui/card"
import { authRoutes } from "@/constants/auth"
import { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/langs"
import { dictionaryRequirements } from "@/lib/utils/dictionary"
import { Button } from "@nextui-org/button"
import { Card, CardBody, CardHeader } from "@nextui-org/card"

export default async function SignupByCredentials({
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
        signUpPage: {
          createAnAccount: true,
        },
      },
      RegisterUserAuthFormDr
    )
  )

  //? If there is no email in the search params, redirect to the sign-up page
  if (!searchParams.email) {
    redirect(authRoutes.signUp[0])
  } 

  return (
   <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 relative">
  {/* Bouton retour en haut à gauche */}
  <Link href={{ pathname: authRoutes.signUp[0], query: { email: searchParams.email } }}>
    <Button
      className="absolute left-4 top-4 rounded-full bg-green-700 p-2 text-black hover:bg-green-600 transition"
      size="sm"
      aria-label="Retour"
    >
      <ChevronRight className="h-4 w-4 rotate-180" />
    </Button>
  </Link>

  {/* Carte contenant le formulaire */}
  <Card className="w-full max-w-md rounded-2xl bg-gray-900 p-8 text-white shadow-2xl ring-1 ring-gray-800">
    <CardHeader>
      <CardTitle className="text-3xl font-extrabold text-white mb-2">
        {dictionary.signUpPage.createAnAccount}
      </CardTitle>
    </CardHeader>

    <CardBody>
      <p className="mb-6 text-center text-white">
        {dictionary.signUpPage.enterEmail}
      </p>

      <RegisterUserAuthForm
        dictionary={dictionary}
        className="flex flex-col gap-6"
        searchParams={searchParams}
        locale={lang}
      />
    </CardBody>
  </Card>
</main>

  )
}
