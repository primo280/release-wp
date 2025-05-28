// app/api/dossiers/route.ts
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { dossiers } from "@/app/lib/dossierStore"
import { Dossier } from "@/app/models/Dossier"

export async function GET() {
  return NextResponse.json(dossiers)
}

// POST - Créer un nouveau dossier
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (typeof data !== "object" || data === null) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const nouveauDossier: Dossier = {
      id: uuidv4(), // Générer un ID unique
      adresse: (data as Dossier).adresse || "",
      numeroAllee: (data as Dossier).numeroAllee || "",
      numeroPorte: (data as Dossier).numeroPorte || "",
      typeLogement: (data as Dossier).typeLogement || "",
      nomLocataire: (data as Dossier).nomLocataire || "",
      telephone: (data as Dossier).telephone || "",
      email: (data as Dossier).email || "",
      dateCreation: new Date().toISOString(), // Ajouter la date et heure de création
    }

    dossiers.push(nouveauDossier)
    return NextResponse.json(nouveauDossier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du dossier" }, { status: 400 })
  }
}
