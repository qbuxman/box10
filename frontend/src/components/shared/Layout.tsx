"use client"
import Header from "./Header"
import Footer from "./Footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    router.back()
  }

  // Ne pas afficher le bouton retour sur la page d'accueil
  const showBackButton = pathname !== "/"

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 mt-6 px-4 md:px-8 lg:px-12 xl:px-16 mb-12">
        {showBackButton && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4 cursor-pointer"
          >
            <ArrowLeft />
            Retour
          </Button>
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
