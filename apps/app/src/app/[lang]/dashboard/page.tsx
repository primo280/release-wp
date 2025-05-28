import React from "react"

import BarChart from "@/components/dashboard/BarChart"
import Card from "@/components/dashboard/Card"

export default function DashboardPage() {
  // Exemple de données de chambres disponibles
  const chambreData = [
    { title: "Appartements", value: 10, description: "Nombre d'appartements disponibles", icon: "🏢" },
    { title: "Maisons", value: 8, description: "Nombre de maisons disponibles", icon: "🏠" },
    { title: "Studios", value: 5, description: "Nombre de studios disponibles", icon: "📦" },
    { title: "Duplex", value: 2, description: "Nombre de duplex disponibles", icon: "🏘️" },
  ]

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Bienvenue dans le Dashboard</h1>
      <p className="mb-6 text-xl text-gray-600">Voici les infos principales de la plateforme.</p>

      {/* Section des cartes */}
      <div className="mb-6 flex flex-wrap gap-6">
        {chambreData.map((data) => (
          <Card
            key={data.title}
            title={data.title}
            value={data.value}
            description={data.description}
            icon={data.icon}
          />
        ))}
      </div>

      {/* Section du graphique */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <BarChart />
      </div>
    </div>
  )
}
