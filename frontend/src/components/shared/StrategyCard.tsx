import type { Strategy } from "@/types/Strategy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
  return (
    <Card
      className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer h-full border-2"
      style={{ borderColor: "#E3E3E3" }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#234C6A]">
          <span>{strategy.icon}</span>
          <span>{strategy.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm" style={{ color: "#456882" }}>
          {strategy.description}
        </p>
        <p className="font-medium" style={{ color: "#234C6A" }}>
          APR : <span className="font-bold">{strategy.apr}</span> %
        </p>
      </CardContent>
    </Card>
  )
}

export default StrategyCard
