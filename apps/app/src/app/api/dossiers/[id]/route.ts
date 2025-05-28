// app/api/dossiers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"

import { dossiers } from "@/app/lib/dossierStore" // Importer depuis le store

// GET - Récupérer un dossier spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const dossier = dossiers.find((d) => d.id === id)

  if (!dossier) {
    return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
  }

  return NextResponse.json(dossier)
}

// PUT - Mettre à jour un dossier
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (typeof data !== "object" || data === null) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const index = dossiers.findIndex((d) => d.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
    }

    // Mettre à jour le dossier mais garder la date de création originale
    dossiers[index] = {
      ...dossiers[index],
      ...data,
      id, // Conserver l'ID original
      dateCreation: dossiers[index].dateCreation, // Conserver la date de création originale
    }

    return NextResponse.json(dossiers[index])
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du dossier" }, { status: 400 })
  }
}

// DELETE - Supprimer un dossier
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const index = dossiers.findIndex((d) => d.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
  }

  dossiers.splice(index, 1)
  return NextResponse.json({ message: "Dossier supprimé avec succès" })
}
