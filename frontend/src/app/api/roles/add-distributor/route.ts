import { NextRequest, NextResponse } from "next/server"
import { isAddress } from "viem"
import { addDistributorRole } from "@/lib/roles"

interface AddDistributorRequest {
  userAddress: string
}

export async function POST(req: NextRequest) {
  try {
    // Debug: vérifier que la variable d'environnement est accessible
    console.log(
      "ADMIN_PRIVATE_KEY disponible:",
      !!process.env.ADMIN_PRIVATE_KEY
    )

    const body: AddDistributorRequest = await req.json()
    const { userAddress } = body

    if (!isAddress(userAddress)) {
      return NextResponse.json({ error: "Adresse invalide" }, { status: 400 })
    }

    const result = await addDistributorRole(userAddress as `0x${string}`)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
    })
  } catch (error: any) {
    console.error("API add-distributor error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"
