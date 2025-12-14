import { NextResponse } from "next/server"

export async function GET() {
  // Simuler un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json([
    {
      id: "1",
      title: "Stratégie “Sécurité”",
      description:
        "Préserver la valeur de liquidités disponibles tout en générant un rendement modéré, sans exposition au marché crypto.",
      apr: 3,
      risk: 1,
      icon: "🛡️",
      active: true,
    },
    {
      id: "2",
      title: "Stratégie “Sécurité Plus”",
      description:
        "Obtenir un rendement légèrement supérieur au lending classique, sans gestion active.",
      apr: 5,
      risk: 2,
      icon: "⚖️",
      active: false,
    },
    {
      id: "3",
      title: "Stratégie 'Performance Stable'",
      description:
        "Chercher un rendement stable supérieur aux stablecoins classiques, en acceptant une structure plus complexe.",
      apr: 6,
      risk: 3,
      icon: "🚀",
      active: false,
    },
  ])
}
