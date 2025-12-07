"use client"
import { useState } from "react"
import { claimToken } from "@/utils/claimToken"
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
import { useReadContract } from "wagmi"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"

export function ClaimToken() {
  const [loading, setLoading] = useState(false)
  const [recipientForBoxToken, setRecipientForBoxToken] = useState("")
  const [amountToSend, setAmountToSend] = useState<number>(0)
  const [activityId, setActivityId] = useState("")
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "availableSupply",
  })

  const sendToken = async () => {
    if (!recipientForBoxToken) {
      alert("Please connect your wallet")
      return
    }

    setLoading(true)

    await claimToken(
      recipientForBoxToken as `0x${string}`,
      amountToSend,
      activityId
    )
      .then((response) => {
        if (response.success) {
          toast.success(
            `${amountToSend} BOX10 ont été envoyés à l'adresse ${recipientForBoxToken} !`
          )
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="w-[45%] mx-auto">
      <p>Balance du contrat : {balance ? Number(balance) : 0} BOX10</p>
      <div className="flex flex-col items-center justify-center mt-8 gap-4">
        <Select onValueChange={(e) => setActivityId(e)}>
          <SelectTrigger className="w-[180px] border-gray-700 w-full">
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
        <input
          type="number"
          value={amountToSend}
          className="border border-gray-700 p-2 rounded-lg w-full"
          onChange={(e) => {
            setAmountToSend(Number(e.target.value))
          }}
        />
        <input
          type="text"
          value={recipientForBoxToken}
          className="border border-gray-700 p-2 rounded-lg w-full"
          placeholder="Renseigner l'adresse du destinataire"
          onChange={(e) => {
            setRecipientForBoxToken(e.target.value)
          }}
        />
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={sendToken}
          variant="outline"
          disabled={loading || !recipientForBoxToken.trim() || amountToSend < 1}
          className="bg-sky-500 hover:bg-sky-400 cursor-pointer text-white hover:text-white "
        >
          {loading ? "Envoi en cours..." : "Envoyer les tokens"}
        </Button>
      </div>
    </div>
  )
}

export default ClaimToken
