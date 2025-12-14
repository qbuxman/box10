import { TransactionEvent } from "@/types/TransactionEvent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownCircle, ArrowUpCircle, User2 } from "lucide-react"
import { formatUnits } from "viem"

const UserInfo = ({
  transactionEvents,
  balances,
}: {
  transactionEvents: TransactionEvent[]
  balances: any
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <User2 className="text-white text-2xl" />
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "#234C6A" }}>
          Mon Compte
        </h1>
        <p className="text-lg" style={{ color: "#456882" }}>
          Historique de vos transactions Aave
        </p>
      </div>

      {/* Transactions List */}
      {transactionEvents.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold" style={{ color: "#234C6A" }}>
            Transactions ({transactionEvents.length})
          </h2>
          <div className="grid gap-4">
            {transactionEvents.map((e: TransactionEvent) => (
              <Card
                key={crypto.randomUUID()}
                className="border-2 hover:shadow-md transition-shadow duration-200"
                style={{ borderColor: "#E3E3E3" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {e.type === "Deposit" ? (
                        <ArrowDownCircle
                          className="w-6 h-6"
                          style={{ color: "#22c55e" }}
                        />
                      ) : (
                        <ArrowUpCircle
                          className="w-6 h-6"
                          style={{ color: "#ef4444" }}
                        />
                      )}
                      <span style={{ color: "#234C6A" }}>{e.type}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-sm"
                      style={{ borderColor: "#234C6A", color: "#234C6A" }}
                    >
                      {formatUnits(e.amount, 6)} USDC
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium" style={{ color: "#234C6A" }}>
                        Compte
                      </p>
                      <p
                        className="font-mono text-xs truncate"
                        style={{ color: "#456882" }}
                      >
                        {e.account}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#234C6A" }}>
                        Bloc
                      </p>
                      <p style={{ color: "#456882" }}>
                        #{e.blockNumber.toString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#234C6A" }}
                    >
                      Transaction Hash
                    </p>
                    <p
                      className="font-mono text-xs truncate"
                      style={{ color: "#456882" }}
                    >
                      {e.transactionHash}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-2" style={{ borderColor: "#E3E3E3" }}>
          <CardContent className="py-12 text-center">
            <p className="text-lg" style={{ color: "#456882" }}>
              Aucune transaction trouvée pour le moment.
            </p>
            <p className="text-sm mt-2" style={{ color: "#456882" }}>
              Vos dépôts et retraits Aave apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserInfo
