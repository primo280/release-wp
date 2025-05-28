"use client"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { TypeLogement } from "@/app/models/Dossier"

export default function CreerDossierPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    adresse: "",
    numeroAllee: "",
    numeroPorte: "",
    typeLogement: "Appartement" as TypeLogement,
    nomLocataire: "",
    telephone: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Appel à l'API pour créer un nouveau dossier
      const response = await fetch("/api/dossiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création du dossier")
      }

      const _nouveauDossier = await response.json()
      setSuccessMessage("Dossier créé avec succès!")

      // Rediriger vers la page de liste des dossiers
      router.push("/dashboard/liste-dossiers")
    } catch (err) {
      setError("Une erreur est survenue lors de la création du dossier.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Créer un nouveau dossier</h1>

      {error && <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>}

      {successMessage && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Adresse */}
            <div className="col-span-2">
              <label htmlFor="adresse" className="mb-1 block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                required
                value={formData.adresse}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* N° d'allée */}
            <div>
              <label htmlFor="numeroAllee" className="mb-1 block text-sm font-medium text-gray-700">
                N° d&apos;allée
              </label>
              <input
                type="text"
                id="numeroAllee"
                name="numeroAllee"
                value={formData.numeroAllee}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* N° de porte */}
            <div>
              <label htmlFor="numeroPorte" className="mb-1 block text-sm font-medium text-gray-700">
                N° de porte
              </label>
              <input
                type="text"
                id="numeroPorte"
                name="numeroPorte"
                value={formData.numeroPorte}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Type de logement */}
            <div>
              <label htmlFor="typeLogement" className="mb-1 block text-sm font-medium text-gray-700">
                Type de logement
              </label>
              <select
                id="typeLogement"
                name="typeLogement"
                value={formData.typeLogement}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
                <option value="Studio">Studio</option>
                <option value="Duplex">Duplex</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Nom complet du locataire */}
            <div className="col-span-2">
              <label htmlFor="nomLocataire" className="mb-1 block text-sm font-medium text-gray-700">
                Nom complet du locataire
              </label>
              <input
                type="text"
                id="nomLocataire"
                name="nomLocataire"
                required
                value={formData.nomLocataire}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="mb-1 block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                required
                value={formData.telephone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/liste-dossiers")}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Création en cours..." : "Créer le dossier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
