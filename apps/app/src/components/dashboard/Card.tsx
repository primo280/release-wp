"use client "

import React from "react"

interface CardProps {
  title: string
  value: number
  description: string
  icon: string
}

const Card: React.FC<CardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/3 lg:w-1/4">
      <div className="flex items-center space-x-4">
        <div className="text-4xl text-green-600">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold text-gray-800">{value}</div>
    </div>
  )
}

export default Card
