"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Send } from "lucide-react"
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { formatUnits } from "viem"

export function ClaimToken({
  isCriticalDistributor,
}: {
  isCriticalDistributor?: boolean
}) {
  const [recipientForBoxToken, setRecipientForBoxToken] = useState("")
  const [amountToSend, setAmountToSend] = useState<number>(0)
  const [activityId, setActivityId] = useState("")

  const { data: balance, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "availableSupply",
  })

  const { data: largeDistributionThreshold } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "LARGE_DISTRIBUTION_THRESHOLD",
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `${amountToSend} BOX10 ont été envoyés à l'adresse ${recipientForBoxToken} !`
      )
      refetch()
      // Reset form
      setRecipientForBoxToken("")
      setAmountToSend(0)
      setActivityId("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      toast.error(`Erreur: ${error.message}`)
    }
  }, [error])

  const sendToken = () => {
    if (!recipientForBoxToken) {
      toast.error("Veuillez renseigner une adresse.")
      return
    }

    if (!activityId) {
      toast.error("Veuillez sélectionner une activité.")
      return
    }

    if (
      !isCriticalDistributor &&
      amountToSend >
        Number(formatUnits(largeDistributionThreshold as bigint, 18))
    ) {
      toast.error("Vous n'avez pas les droits pour envoyer ce montant.")
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "distribute",
      args: [recipientForBoxToken as `0x${string}`, amountToSend, activityId],
    })
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <Send className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">
          Réclamer des tokens
        </h1>
        <p className="text-lg text-[#456882]">
          Balance du contrat : {balance ? Number(balance) : 0} BOX10
        </p>
      </div>

      {/* Claim Token Card */}
      <Card className="border">
        <CardHeader className="bg-[#234C6A]">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-white" />
            <div>
              <CardTitle className="text-white text-xl">
                Envoyer des BOX10
              </CardTitle>
              <CardDescription className="text-white/80">
                Sélectionnez une activité et envoyez des tokens
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="activity-select"
                className="text-sm font-medium"
                style={{ color: "#234C6A" }}
              >
                Activité réalisée
              </label>
              <Select
                onValueChange={(e) => setActivityId(e)}
                value={activityId}
              >
                <SelectTrigger
                  id="activity-select"
                  className="w-full border-2"
                  style={{ borderColor: "#E3E3E3" }}
                >
                  <SelectValue placeholder="Choisir un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Activité réalisée</SelectLabel>
                    <SelectItem value="read-article">Article lu</SelectItem>
                    <SelectItem value="quiz">Quiz effectué</SelectItem>
                    <SelectItem value="strategy-used">
                      Utilisation d'une stratégie
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount-input"
                className="text-sm font-medium"
                style={{ color: "#234C6A" }}
              >
                Montant à envoyer{" "}
                {!isCriticalDistributor
                  ? `(${largeDistributionThreshold ? formatUnits(largeDistributionThreshold as bigint, 18) : 0} BOX10 maximum)`
                  : ""}
              </label>
              <Input
                id="amount-input"
                type="number"
                value={amountToSend}
                onChange={(e) => setAmountToSend(Number(e.target.value))}
                placeholder="0"
                className="border-2"
                max={
                  !isCriticalDistributor && largeDistributionThreshold
                    ? Number(
                        formatUnits(largeDistributionThreshold as bigint, 18)
                      )
                    : undefined
                }
                style={{ borderColor: "#E3E3E3" }}
              />
            </div>

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
                value={recipientForBoxToken}
                onChange={(e) => setRecipientForBoxToken(e.target.value)}
                placeholder="0x..."
                className="border-2"
                style={{ borderColor: "#E3E3E3" }}
              />
            </div>
          </div>

          <Button
            onClick={sendToken}
            disabled={
              isLoading || !recipientForBoxToken.trim() || amountToSend < 1
            }
            className="w-full text-white font-medium transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#456882" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isPending
                  ? "Confirmation en attente..."
                  : "Transaction en cours..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Envoyer les tokens
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClaimToken
