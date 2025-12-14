import type { Strategy } from "@/types/Strategy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  return (
    <Card className="hover:scale-[1.02] transition-transform duration-200 h-full border-2 border-[#E3E3E3]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#234C6A]">
          <span>{strategy.icon}</span>
          <span>{strategy.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[#456882]">{strategy.description}</p>
        <p className="font-medium text-[#234C6A]">
          APR estimé: <span className="font-bold">{strategy.apr}</span> %
        </p>
        <p className="font-medium text-[#234C6A]">
          Niveau de risque: <span className="font-bold">{strategy.risk}</span> /
          5
        </p>
      </CardContent>
    </Card>
  )
}

export default StrategyCard
