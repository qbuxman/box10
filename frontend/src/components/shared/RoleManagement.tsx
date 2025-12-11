import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { checkDistributorRole } from "@/lib/roles"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserPlus, Shield } from "lucide-react"

const RoleManagement = () => {
  const [addressToAddRole, setAddressToAddRole] = useState("")
  const [addressToRemoveRole, setAddressToRemoveRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addRoleToAddress = async () => {
    if (!addressToAddRole) {
      toast.error("Merci de renseigner une adresse.")
      return
    }

    setIsLoading(true)

    try {
      // Vérifier que l'adresse renseignée n'a pas déjà le rôle de distributeur
      const hasRole = await checkDistributorRole(
        addressToAddRole as `0x${string}`
      )

      if (hasRole) {
        toast.warning("Cette adresse a déjà ce rôle.")
        setIsLoading(false)
        return
      }

      // Appeler l'API route pour ajouter le rôle (côté serveur)
      const response = await fetch("/api/roles/add-distributor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAddress: addressToAddRole }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          `Rôle de distributeur ajouté avec succès pour l'adresse ${addressToAddRole}`
        )
        toast.info(`Transaction: ${data.txHash}`)
        setAddressToAddRole("")
      } else {
        toast.error(`Erreur: ${data.error}`)
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const removeRoleToAddress = async () => {
    if (!addressToRemoveRole) {
      toast.error("Merci de renseigner une adresse.")
      return
    }

    setIsLoading(true)

    try {
      // Vérifier que l'adresse renseignée n'a pas déjà le rôle de distributeur
      const hasRole = await checkDistributorRole(
        addressToRemoveRole as `0x${string}`
      )

      if (!hasRole) {
        toast.warning("Cette adresse n'a pas ce rôle.")
        setIsLoading(false)
        return
      }

      // Appeler l'API route pour ajouter le rôle (côté serveur)
      const response = await fetch("/api/roles/remove-distributor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAddress: addressToRemoveRole }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          `Rôle de distributeur retiré avec succès pour l'adresse ${addressToRemoveRole}`
        )
        toast.info(`Transaction: ${data.txHash}`)
        setAddressToRemoveRole("")
      } else {
        toast.error(`Erreur: ${data.error}`)
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "#234C6A" }}>
          Gestion des rôles
        </h1>
        <p className="text-lg" style={{ color: "#456882" }}>
          Administrez les permissions du système de distribution
        </p>
      </div>

      {/* Add Role Card */}
      <Card className="border">
        <CardHeader className="bg-[#234C6A]">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-white" />
            <div>
              <CardTitle className="text-white text-xl">
                Ajouter le rôle Distributeur
              </CardTitle>
              <CardDescription className="text-white/80">
                Attribuer les droits de distribution à une adresse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="address-input"
              className="text-sm font-medium"
              style={{ color: "#234C6A" }}
            >
              Adresse
            </label>
            <Input
              id="address-input"
              value={addressToAddRole}
              onChange={(e) => setAddressToAddRole(e.target.value)}
              placeholder="0x..."
              className="border-2"
              style={{
                borderColor: "#E3E3E3",
                color: "#234C6A",
              }}
            />
          </div>
          <Button
            disabled={!addressToAddRole || isLoading}
            onClick={addRoleToAddress}
            className="w-full text-white font-medium transition-all hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "#456882",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ajout en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Ajouter le rôle
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Remove Role Card */}
      <Card className="border">
        <CardHeader className="bg-[#234C6A]">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-white" />
            <div>
              <CardTitle className="text-white text-xl">
                Supprimer le rôle Distributeur
              </CardTitle>
              <CardDescription className="text-white/80">
                Retirer les droits de distribution à une adresse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="address-input"
              className="text-sm font-medium"
              style={{ color: "#234C6A" }}
            >
              Adresse
            </label>
            <Input
              id="address-input"
              value={addressToRemoveRole}
              onChange={(e) => setAddressToRemoveRole(e.target.value)}
              placeholder="0x..."
              className="border-2"
              style={{
                borderColor: "#E3E3E3",
                color: "#234C6A",
              }}
            />
          </div>
          <Button
            disabled={!addressToRemoveRole || isLoading}
            onClick={removeRoleToAddress}
            className="w-full text-white font-medium transition-all hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "#456882",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Suppression en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Supprimer le rôle
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoleManagement
