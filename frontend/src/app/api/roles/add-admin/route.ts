import { NextRequest, NextResponse } from "next/server"
import { isAddress } from "viem"
import { addAdminRole } from "@/lib/roles"

interface AddAdminRequest {
  userAddress: string
}

export async function POST(req: NextRequest) {
  try {
    const body: AddAdminRequest = await req.json()
    const { userAddress } = body

    if (!isAddress(userAddress)) {
      return NextResponse.json({ error: "Adresse invalide" }, { status: 400 })
    }

    const result = await addAdminRole(userAddress as `0x${string}`)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
    })
  } catch (error: any) {
    console.error("API add-admin error:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"
