import { NextResponse } from 'next/server'
import {LearnCategory} from "@/types/LearnCategory";

export async function GET(): Promise<NextResponse<LearnCategory[]>> {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json([
        {
            id: 1,
            title: 'Blockchain',
            description: 'Des ressources pour en apprendre plus sur le fonctionnement de la blockchain.',
            families: [{ id: 1, label: 'blockchain' }, { id: 2, label: 'crypto' }],
            icon: '⛓️📦',
            path: 'blockchain'
        },
        {
            id: 2,
            title: 'Finance décentralisée',
            description: 'Stratégie à faible risque avec rendements stables',
            families: [{ id: 3, label: 'DeFi' }, { id: 2, label: 'crypto' }],
            icon: '🦄',
            path: 'defi'
        },
        {
            id: 3,
            title: 'Finance traditionnelle',
            description: 'Stratégie à faible risque avec rendements stables',
            families: [{ id: 4, label: 'bourse' }, { id: 5, label: 'fiat' }],
            icon: '📉',
            path: 'tradfi'
        },
        {
            id: 4,
            title: 'Plateforme d\'échange',
            description: 'Stratégie à faible risque avec rendements stables',
            families: [{ id: 4, label: 'bourse' }, { id: 5, label: 'fiat' }, { id: 6, label: 'dex'}, { id: 7, label: 'cex'}],
            icon: '🤝',
            path: 'exchanges'
        },
    ])
}