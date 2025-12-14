import { NextResponse } from "next/server"
import { StrategyDetails } from "@/types/Strategy"

// Données mockées des stratégies
const strategies: StrategyDetails[] = [
  {
    id: "1",
    title: "Stratégie “Sécurité”",
    description:
      "Préserver la valeur de liquidités disponibles tout en générant un rendement modéré, sans exposition au marché crypto.",
    details:
      "Vos stablecoins sont déposés sur un protocole de lending EVM éprouvé. Ils sont prêtés à des emprunteurs surcollatéralisés, ce qui génère un rendement variable mais historiquement stable.",
    apr: 3,
    risk: 1,
    icon: "🛡️",
    horizon: "Court à moyen terme (3 à 12 mois)",
    active: true,
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
