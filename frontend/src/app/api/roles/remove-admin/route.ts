import { NextRequest, NextResponse } from "next/server"
import { isAddress } from "viem"
import { removeAdminRole } from "@/lib/roles"

interface RemoveAdminRequest {
  userAddress: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RemoveAdminRequest = await req.json()
    const { userAddress } = body

    if (!isAddress(userAddress)) {
      return NextResponse.json({ error: "Adresse invalide" }, { status: 400 })
    }

    const result = await removeAdminRole(userAddress as `0x${string}`)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
    })
  } catch (error: any) {
    console.error("API remove-admin error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"
