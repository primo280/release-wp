"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { FaArrowLeft, FaBell, FaSearch } from "react-icons/fa"

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Extraire un titre lisible à partir du pathname
  const pageTitle =
    pathname
      .split("/")
      .filter(Boolean)
      .join(" / ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard"

  return (
    <nav className="flex flex-col bg-white p-4 shadow-md">
      <div className="mb-2 flex flex-wrap items-center justify-between">
        <div className="text-2xl font-bold text-green-700">{pageTitle}</div>

        <div className="relative mt-2 w-full sm:mt-0 sm:w-1/3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-md border border-gray-300 p-2 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        <div className="ml-4 mt-2 text-green-700 sm:mt-0">
          <FaBell size={24} />
        </div>
      </div>

      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm text-white transition-colors hover:bg-green-800"
        >
          <FaArrowLeft className="mr-2" />
          Retour
        </button>
      </div>
    </nav>
  )
}

export default Navbar
