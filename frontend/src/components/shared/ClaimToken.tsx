'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

export function ClaimToken({ recipient, amount, activityId }: { recipient: string, amount: number, activityId: string }) {
    const { address } = useAccount()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    console.log('claimToken', activityId)
    console.log('address', address)

    const handleComplete = async () => {
        if (!address) {
            alert('Please connect your wallet')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/distribute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: recipient,
                    rewardAmount: amount,
                    activityId: activityId
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Distribution failed')
            }

            setResult(data)
            alert(`Success! ${data.amount} BOX10 distributed. TX: ${data.txHash}`)

        } catch (error: any) {
            console.error(error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // @ts-ignore
    return (
        <div className="space-y-4 p-12">
            <input type="text"/>
            <button
                onClick={handleComplete}
                disabled={loading || !address}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer"
            >
                {loading ? 'Distributing...' : 'Complete Activity & Claim Reward'}
            </button>

            {result && (
                <div className="p-4 bg-green-100 rounded">
                    <p>✅ Reward distributed at address : {recipient}!</p>
                    <p className="text-sm">Amount: {amount} BOX10</p>
                </div>
            )}
        </div>
    )
}

export default ClaimToken;