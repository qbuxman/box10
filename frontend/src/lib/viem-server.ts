import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { hardhat } from 'viem/chains'

// Account du distributeur (côté serveur uniquement)
const distributorAccount = privateKeyToAccount(
    process.env.DISTRIBUTOR_PRIVATE_KEY as `0x${string}`
)

export const walletClientDistributor = createWalletClient({
    account: distributorAccount,
    chain: hardhat,
    transport: http()
})