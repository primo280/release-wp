"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiAlertCircle, FiFolder, FiFolderPlus, FiHome, FiLogOut, FiSettings, FiUsers } from "react-icons/fi"

import Profile from "./profile"

const Sidebar = () => {
  const pathname = usePathname()

  const lang = pathname.split("/")[1] || "fr"

  const navItems = [
    { href: `/${lang}/dashboard`, label: "Tableau de bord", icon: <FiHome size={18} /> },
    { href: `/${lang}/dashboard/create_folder`, label: "Créer un nouveau dossier", icon: <FiFolderPlus size={18} /> },
    { href: `/${lang}/dashboard/list_folder`, label: "Liste des dossiers", icon: <FiFolder size={18} /> },
    { href: `/${lang}/dashboard/users`, label: "Gestion des utilisateurs", icon: <FiUsers size={18} /> },
    { href: `/${lang}/dashboard/settings`, label: "Paramètres", icon: <FiSettings size={18} /> },
  ]

  return (
    <aside className="flex h-full w-72 flex-col bg-green-700 text-white">
      <Profile nom="John Doe" entreprise="Fleurent ARCHITECTES" />
      <br />
      <br />
      <nav className="flex-1">
        <div className="border-b border-green-600/30">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`mx-2 my-1 flex cursor-pointer items-center rounded-md px-4 py-3 transition-all duration-200 ${
                  pathname === item.href ? "bg-white text-green-800" : "hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-green-600/30">
        <Link href={`/${lang}/logout`}>
          <div className="mx-2 my-1 flex cursor-pointer items-center rounded-md px-4 py-3 transition-all duration-200 hover:bg-white/20">
            <span className="mr-3">
              <FiLogOut size={18} />
            </span>
            Se déconnecter
          </div>
        </Link>
        <Link href={`/${lang}/report`}>
          <div className="mx-2 mb-4 flex cursor-pointer items-center rounded-md px-4 py-3 transition-all duration-200 hover:bg-white/20">
            <span className="mr-3">
              <FiAlertCircle size={18} />
            </span>
            Signaler un problème
          </div>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
