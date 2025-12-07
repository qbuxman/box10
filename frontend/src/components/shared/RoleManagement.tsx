import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { checkDistributorRole } from "@/lib/roles"

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
        toast.error("Cette adresse a déjà ce rôle.")
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

  return (
    <>
      <h1 className={"text-3xl font-bold text-center mb-6"}>
        👮‍♂️ Gestion des rôles
      </h1>

      <h2>Rôle "Distributeur"</h2>
      <div>
        <h3>Ajouter le rôle</h3>
        <div>
          <Input
            value={addressToAddRole}
            onChange={(e) => setAddressToAddRole(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={!addressToAddRole || isLoading}
            onClick={addRoleToAddress}
          >
            Ajouter le rôle à cette adresse
          </Button>
        </div>
      </div>
    </>
  )
}

export default RoleManagement
