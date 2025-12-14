"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BadgeDollarSign,
  ChartAreaIcon,
  GraduationCap,
  Lightbulb,
  LockOpen,
  Package,
  User2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { checkDistributorRole, checkAdminRole } from "@/lib/roles"

const HomePage = () => {
  const { address, isConnected } = useAccount()
  const [isDistributor, setIsDistributor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkConnectedUserRoles = async () => {
      if (address && isConnected) {
        const isAdmin_ = await checkAdminRole(address)
        setIsAdmin(isAdmin_)
        const isDistributor_ = await checkDistributorRole(address)
        setIsDistributor(isDistributor_)
      } else {
        setIsAdmin(false)
        setIsDistributor(false)
      }
    }
    checkConnectedUserRoles()
  }, [isConnected, address])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <span className="text-white text-2xl">
            <Package />
          </span>
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "#234C6A" }}>
          Bienvenue dans La Boîte à 10%
        </h1>
        <p className="text-lg" style={{ color: "#456882" }}>
          Découvrez comment investir simplement et efficacement
        </p>
      </div>

      {/* Objectif */}
      <Card className="border-2" style={{ borderColor: "#E3E3E3" }}>
        <CardHeader>
          <CardTitle
            className="text-2xl flex items-center gap-2"
            style={{ color: "#234C6A" }}
          >
            <span>🎯</span> Objectif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg" style={{ color: "#456882" }}>
            Proposer des stratégies accessibles, diversifiées et capables
            d’atteindre 10 % ou plus selon votre profil.
          </p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold" style={{ color: "#234C6A" }}>
          Vous pouvez commencer votre investissement simplement :
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer border-2 h-full"
            style={{ borderColor: "#E3E3E3" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#234C6A]">
                <span>👉</span> Vous avez des USDC ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: "#456882" }}>
                Utilisez-les dès maintenant !
              </p>
            </CardContent>
          </Card>
          <Card
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer border-2 h-full"
            style={{ borderColor: "#E3E3E3" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#234C6A]">
                <span>👉</span> Vous avez des euros ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: "#456882" }}>
                Grâce à <strong>Transak</strong>, vous achetez des USDC en 2
                minutes, puis vous les investissez dans nos stratégies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link href="/strategies">
          <Button
            size="lg"
            className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
          >
            <ChartAreaIcon className="mr-2" />
            Voir les stratégies
          </Button>
        </Link>
        <Link href="/learn">
          <Button
            size="lg"
            className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
          >
            <GraduationCap className="mr-2" />
            Se former
          </Button>
        </Link>
        <Link href="/quiz">
          <Button
            size="lg"
            className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
          >
            <Lightbulb className="mr-2" />
            Tester ses connaissances
          </Button>
        </Link>
        <Link href="/account">
          <Button
            size="lg"
            className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
          >
            <User2 className="mr-2" />
            Mon compte
          </Button>
        </Link>
        {isDistributor && (
          <Link href="/distribute">
            <Button
              size="lg"
              className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
            >
              <BadgeDollarSign className="mr-2" />
              Envoyer des jetons
            </Button>
          </Link>
        )}
        {isAdmin && (
          <>
            <Link href="/admin/settings/roles">
              <Button
                size="lg"
                className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
              >
                <LockOpen className="mr-2" />
                Gestion des rôles
              </Button>
            </Link>
            <Link href="/admin/settings/pause">
              <Button
                size="lg"
                className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-[#456882]"
              >
                <LockOpen className="mr-2" />
                Gestion des pauses
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
