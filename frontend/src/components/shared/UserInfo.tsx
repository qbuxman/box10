import { TransactionEvent } from "@/types/TransactionEvent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle, User2, Gift } from "lucide-react"
import { formatUnits } from "viem"

const UserInfo = ({
  transactionEvents,
}: {
  transactionEvents: TransactionEvent[]
}) => {
  const getTokenInfo = (type: string) => {
    if (type === "Deposit" || type === "Withdraw") {
      return { decimals: 6, symbol: "USDC" }
    }
    // Affichage limité à 1 décimal pour plus de simplicité pour l'utilisateur
    return { decimals: 0, symbol: "BOX10" }
  }

  const getIcon = (type: string) => {
    if (type === "Deposit") {
      return <ArrowDownCircle className="w-6 h-6 text-green-500" />
    } else if (type === "Withdraw") {
      return <ArrowUpCircle className="w-6 h-6 text-red-500" />
    } else {
      return <Gift className="w-6 h-6 text-amber-500" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#234C6A]">
          <User2 className="text-white text-2xl" />
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">Mon Compte</h1>
        <p className="text-lg text-[#456882]">Historique de vos transactions</p>
      </div>

      {/* Transactions List */}
      {transactionEvents.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#234C6A]">
            Transactions ({transactionEvents.length})
          </h2>
          <div className="grid gap-4">
            {transactionEvents.map((e: TransactionEvent) => {
              const tokenInfo = getTokenInfo(e.type)
              return (
                <Card
                  key={crypto.randomUUID()}
                  className="border-2 border-[#E3E3E3] hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(e.type)}
                        <span className="text-[#234C6A]">{e.type}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-sm border-[#234C6A] text-[#234C6A]"
                      >
                        {formatUnits(e.amount, tokenInfo.decimals)}{" "}
                        {tokenInfo.symbol}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-[#234C6A]">Compte</p>
                        <p className="font-mono text-xs truncate text-[#456882]">
                          {e.account}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-[#234C6A]">Bloc</p>
                        <p className="text-[#456882]">
                          #{e.blockNumber.toString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#234C6A]">
                        Transaction Hash
                      </p>
                      <p className="font-mono text-xs truncate text-[#456882]">
                        {e.transactionHash}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <Card className="border-2 border-[#E3E3E3]">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-[#456882]">
              Aucune transaction trouvée pour le moment.
            </p>
            <p className="text-sm mt-2 text-[#456882]">
              Vos dépôts et retraits Aave apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserInfo
