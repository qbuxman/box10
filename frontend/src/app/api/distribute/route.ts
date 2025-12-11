import { NextRequest, NextResponse } from "next/server"
import { isAddress } from "viem"

interface DistributeRequest {
  userAddress: `0x${string}`
  rewardAmount: number
  activityId: string
}

export async function POST(req: NextRequest) {
  try {
    const { distributeRewards } = await import("@/lib/distributor")

    const body: DistributeRequest = await req.json()
    const { userAddress, activityId, rewardAmount } = body

    if (!isAddress(userAddress)) {
      return NextResponse.json(
        { error: "Invalid user address" },
        { status: 400 }
      )
    }

    const result = await distributeRewards(
      userAddress as `0x${string}`,
      rewardAmount,
      activityId
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      txHash: result.txHash,
      amount: rewardAmount,
    })
  } catch (error: any) {
    console.error("API distribute error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"
