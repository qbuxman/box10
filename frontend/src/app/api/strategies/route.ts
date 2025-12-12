import { NextResponse } from "next/server"

export async function GET() {
  // Simuler un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json([
    {
        id: '1',
      title: "Stratégie Conservative",
      description: "Stratégie à faible risque avec rendements stables",
      apr: 8,
      icon: "🛡️",
    },
    {
        id: '2',
      title: "Stratégie Balanced",
      description: "Équilibre entre risque et rendement",
      apr: 10,
      icon: "⚖️",
    },
    {
        id: '3',
      title: "Stratégie Aggressive",
      description: "Rendements élevés avec risque contrôlé",
      apr: 15,
      icon: "🚀",
    },
  ])
}
