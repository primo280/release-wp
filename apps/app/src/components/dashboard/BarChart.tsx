"use client"

import React, { useEffect, useRef } from "react"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart: React.FC = () => {
  const chartRef = useRef(null)

  const data = {
    labels: ["Appartement", "Maison", "Studio", "Duplex"],
    datasets: [
      {
        label: "Chambres disponibles",
        data: [10, 8, 5, 2], // Données à mettre à jour dynamiquement
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Chambres disponibles par type de logement",
      },
    },
    animations: {
      y: {
        duration: 1000,
        easing: "easeOutBounce",
      },
    },
  }

  useEffect(() => {}, [])

  return <Bar ref={chartRef} data={data} options={options} />
}

export default BarChart
