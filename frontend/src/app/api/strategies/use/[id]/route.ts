import { NextResponse } from "next/server"
import { Strategy } from "@/types/Strategy"

// Données mockées des stratégies
const strategies: Strategy[] = [
  {
    id: "1",
    title: "Stratégie Conservative",
    description: "Stratégie à faible risque avec rendements stables",
    apr: 8,
    icon: "🛡️",
  },
  {
    id: "2",
    title: "Stratégie Balanced",
    description: "Équilibre entre risque et rendement",
    apr: 10,
    icon: "⚖️",
  },
  {
    id: "3",
    title: "Stratégie Aggressive",
    description: "Rendements élevés avec risque contrôlé",
    apr: 15,
    icon: "🚀",
  },
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await new Promise((resolve) => setTimeout(resolve, 200))

  const strategy = strategies.find((s) => s.id === id)

  if (!strategy) {
    return NextResponse.json(
      { error: "Stratégie non trouvée" },
      { status: 404 }
    )
  }

  return NextResponse.json(strategy)
}
