"use client"
import ClaimToken from "@/components/shared/ClaimToken"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { checkCriticalDistributorRole, checkDistributorRole } from "@/lib/roles"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

const Distribute = () => {
  const { address, isConnected } = useAccount()

  const [isDistributor, setIsDistributor] = useState(false)
  const [isCriticalDistributor, setIsCriticalDistributor] = useState(false)

  useEffect(() => {
    const checkConnectedUserRoles = async () => {
      if (address && isConnected) {
        const isDistributor_ = await checkDistributorRole(address)
        setIsDistributor(isDistributor_)
        const isCriticalDistributor_ =
          await checkCriticalDistributorRole(address)
        setIsCriticalDistributor(isCriticalDistributor_)
      } else {
        setIsDistributor(false)
        setIsCriticalDistributor(false)
      }
    }
    checkConnectedUserRoles()
  }, [isConnected, address])

  return (
    <>
      {isDistributor || isCriticalDistributor ? (
        <ClaimToken isCriticalDistributor={isCriticalDistributor} />
      ) : (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            <p>
              Vous n'avez pas les droits nécessaires pour accéder à cette page
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default Distribute
