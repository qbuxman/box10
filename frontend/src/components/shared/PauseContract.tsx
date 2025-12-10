"use client"
import { Pause } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { toast } from "sonner"
import { useEffect } from "react"

const PauseContract = () => {
  const { writeContract, data: hash, isPending, isSuccess } = useWriteContract()

  const { data: isContractPaused, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "paused",
  })

  const setPause = () => {
    if (isContractPaused) {
      toast.error("Le contrat est déjà en pause")
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "pause",
    })

    if (isSuccess) {
      console.log(hash)
      refetch()
      toast.success("Le contrat a bien été mise en pause.")
    }
  }

  const unsetPause = async () => {
    if (!isContractPaused) {
      toast.error("Le contrat n'est pas en pause")
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "unpause",
    })

    if (isSuccess) {
      refetch()
      toast.success("Le contrat n'est plus en pause.")
    }
  }

  useEffect(() => {
    refetch()
  }, [isSuccess, refetch])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#234C6A]">
          <Pause className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">
          Gestion des pauses
        </h1>
        <p className="text-lg text-[#456882]">
          Activez ou desactivez la mise en pause de votre contrat
        </p>
        {isContractPaused ? (
          <Alert>
            <AlertDescription>
              Le contrat est actuellement en pause
            </AlertDescription>
          </Alert>
        ) : (
          ""
        )}
      </div>
      <Card className="border">
        <CardContent className="pt-6 space-y-4">
          {isContractPaused ? (
            <Button
              className="w-full font-medium transition-all hover:opacity-90 cursor-pointer"
              variant="outline"
              onClick={unsetPause}
              disabled={isPending}
            >
              Annuler la mise en pause
            </Button>
          ) : (
            <Button
              className="w-full text-white font-medium transition-all hover:opacity-90 cursor-pointer bg-red-500"
              onClick={setPause}
              disabled={isPending}
            >
              Mettre en pause
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PauseContract
