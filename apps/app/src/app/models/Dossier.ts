// app/models/Dossier.ts
export type TypeLogement = "Appartement" | "Maison" | "Studio" | "Duplex" | "Autre"

export interface Dossier {
  id: string
  adresse: string
  numeroAllee: string
  numeroPorte: string
  typeLogement: TypeLogement
  nomLocataire: string
  telephone: string
  email: string
  dateCreation: string // Format ISO pour stocker date et heure
}
