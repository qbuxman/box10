export const claimToken = async (
  recipient: `0x${string}`,
  amount: number,
  activityId: string
) => {
  console.log("ici")
  const response = await fetch("/api/distribute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userAddress: recipient,
      rewardAmount: amount,
      activityId: activityId,
    }),
  })

  return await response.json()
}
