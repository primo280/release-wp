// components/dashboard/Profile.tsx
import React from "react"

interface ProfileProps {
  nom: string
  entreprise?: string
}

const Profile: React.FC<ProfileProps> = ({ nom, entreprise }) => {
  const obtenirInitiales = (nom: string) => {
    return nom
      .split(" ")
      .map((partie) => partie[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const initiales = obtenirInitiales(nom)

  return (
    <div className="flex flex-col items-center border-b border-blue-600/30 p-6">
      <div className="mb-2 flex size-20 items-center justify-center rounded-full bg-white">
        <div className="text-2xl font-bold text-blue-800">{initiales}</div>
      </div>
      <div className="text-xl font-medium">{nom}</div>
      {entreprise && <div className="text-gray-200">{entreprise}</div>}
    </div>
  )
}

export default Profile
