import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 200))

    return NextResponse.json([
        {
            title: 'Stratégie Conservative',
            description: 'Stratégie à faible risque avec rendements stables',
            apr: 8,
            icon: '🛡️'
        },
        {
            title: 'Stratégie Balanced',
            description: 'Équilibre entre risque et rendement',
            apr: 10,
            icon: '⚖️'
        },
        {
            title: 'Stratégie Aggressive',
            description: 'Rendements élevés avec risque contrôlé',
            apr: 15,
            icon: '🚀'
        }
    ])
}