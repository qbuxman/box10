"use client"
import { Strategy } from "@/types/Strategy"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { depositUSDC, getAaveBalance } from "@/utils/aave"
import { useAccount } from "wagmi"

const StrategyDetail = ({ strategy }: { strategy: Strategy }) => {
  const { isConnected } = useAccount()
  const [amountToSend, setAmountToSend] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userBalanceInPool, setUserBalanceInPool] = useState("0")

  useEffect(() => {
    if (isConnected) getUserBalance()
  }, [isConnected, amountToSend])

  const getUserBalance = async () => {
    const response = await getAaveBalance()
    if (response.success && response.balance)
      setUserBalanceInPool(response.balance)
  }

  const sendToken = async () => {
    try {
      setIsLoading(true)
      const result = await depositUSDC(amountToSend.toString())

      if (result.success) {
        toast.success(
          `Le depot de vos ${amountToSend} USDC s'est correctement déroulé !\n\n Hash de la transaction : ${result.txHash}`
        )
        setAmountToSend("")
      } else {
        console.error(result.error)
        toast.error("Une erreur est survenue lors du dépôt")
      }
    } catch (error) {
      console.error(error)
      toast.error(
        (error as Error).message ||
          "Une erreur est survenue lors de la transaction"
      )
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
          <Send className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">{strategy.title}</h1>
        <p className="text-lg text-[#456882]">{strategy.description}</p>
      </div>

      <Card className="border mt-4">
        <CardHeader className="bg-[#234C6A]">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-white" />
            <div>
              <CardTitle className="text-white text-xl">
                Envoyer des USDC
              </CardTitle>
              <CardDescription className="text-white/80">
                Sélectionnez un montant d'USDC à envoyer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div>
              Vous avez déjà envoyé {userBalanceInPool} USDC dans la pool
            </div>
            <div className="space-y-2">
              <label
                htmlFor="amount-input"
                className="text-sm font-medium"
                style={{ color: "#234C6A" }}
              >
                Montant à envoyer
              </label>
              <Input
                id="amount-input"
                type="number"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                placeholder="0"
                className="border-2"
                style={{ borderColor: "#E3E3E3" }}
              />
            </div>
          </div>

          <Button
            onClick={sendToken}
            disabled={isLoading || amountToSend.length === 0}
            className="w-full text-white font-medium transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "#456882" }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLoading
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

export default StrategyDetail
