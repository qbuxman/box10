import { publicClient, walletClient } from "./client"
import { parseUnits, formatUnits } from "viem"
import PoolArtifact from "@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json"

// Adresses des contrats Aave v3
// Sepolia
const USDC_ADDRESS_SEPOLIA =
  "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" as const
const POOL_ADDRESS_SEPOLIA =
  "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as const
const POOL_DATA_PROVIDER_SEPOLIA =
  "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31" as const

// Mainnet (pour fork local)
const USDC_ADDRESS_MAINNET =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const
const POOL_ADDRESS_MAINNET =
  "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" as const
const POOL_DATA_PROVIDER_MAINNET =
  "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3" as const

// Config selon l'environnement
const isLocal = process.env.NEXT_PUBLIC_ENV === "development"
const USDC_ADDRESS = isLocal ? USDC_ADDRESS_MAINNET : USDC_ADDRESS_SEPOLIA
const POOL_ADDRESS = isLocal ? POOL_ADDRESS_MAINNET : POOL_ADDRESS_SEPOLIA
const POOL_DATA_PROVIDER_ADDRESS = isLocal
  ? POOL_DATA_PROVIDER_MAINNET
  : POOL_DATA_PROVIDER_SEPOLIA

// ABI du Pool Aave v3
const POOL_ABI = PoolArtifact.abi

// ABI minimal pour ERC20 approve et balanceOf
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const

// ABI pour PoolDataProvider
const POOL_DATA_PROVIDER_ABI = [
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveConfigurationData",
    outputs: [
      { name: "decimals", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "liquidationThreshold", type: "uint256" },
      { name: "liquidationBonus", type: "uint256" },
      { name: "reserveFactor", type: "uint256" },
      { name: "usageAsCollateralEnabled", type: "bool" },
      { name: "borrowingEnabled", type: "bool" },
      { name: "stableBorrowRateEnabled", type: "bool" },
      { name: "isActive", type: "bool" },
      { name: "isFrozen", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveCaps",
    outputs: [
      { name: "borrowCap", type: "uint256" },
      { name: "supplyCap", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveData",
    outputs: [
      { name: "unbacked", type: "uint256" },
      { name: "accruedToTreasuryScaled", type: "uint256" },
      { name: "totalAToken", type: "uint256" },
      { name: "totalStableDebt", type: "uint256" },
      { name: "totalVariableDebt", type: "uint256" },
      { name: "liquidityRate", type: "uint256" },
      { name: "variableBorrowRate", type: "uint256" },
      { name: "stableBorrowRate", type: "uint256" },
      { name: "averageStableBorrowRate", type: "uint256" },
      { name: "liquidityIndex", type: "uint256" },
      { name: "variableBorrowIndex", type: "uint256" },
      { name: "lastUpdateTimestamp", type: "uint40" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export const getAaveBalance = async () => {
  try {
    const [address] = await walletClient.requestAddresses()
    if (!address) throw new Error("Veuillez vous connecter à MetaMask.")

    // Récupérer l'adresse du aToken depuis le PoolDataProvider
    const reserveTokens = (await publicClient.readContract({
      address: POOL_DATA_PROVIDER_ADDRESS,
      abi: [
        {
          inputs: [{ name: "asset", type: "address" }],
          name: "getReserveTokensAddresses",
          outputs: [
            { name: "aTokenAddress", type: "address" },
            { name: "stableDebtTokenAddress", type: "address" },
            { name: "variableDebtTokenAddress", type: "address" },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "getReserveTokensAddresses",
      args: [USDC_ADDRESS],
    })) as [string, string, string]

    const aTokenAddress = reserveTokens[0]

    // Récupération du solde de l'utilisateur pour le token concerné
    const aTokenBalance = (await publicClient.readContract({
      address: aTokenAddress as `0x${string}`,
      abi: [
        {
          constant: true,
          inputs: [{ name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "", type: "uint256" }],
          type: "function",
        },
      ],
      functionName: "balanceOf",
      args: [address],
    })) as bigint

    return {
      success: true,
      balance: formatUnits(aTokenBalance, 6),
      aTokenAddress,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du solde Aave:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const depositUSDC = async (amount: string) => {
  try {
    const [address] = await walletClient.requestAddresses()

    if (!address) throw new Error("Veuillez vous connecter à MetaMask.")

    // Vérifier le solde ETH pour les frais de gas
    const balance = await publicClient.getBalance({ address })
    if (balance === BigInt(0)) {
      throw new Error(
        "Vous n'avez pas d'ETH pour payer les frais de transaction."
      )
    }

    // Récupérer les décimales réelles du token USDC
    const decimalsResult = (await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: [
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
      ],
      functionName: "decimals",
    })) as number

    const amountInWei = parseUnits(amount, decimalsResult)

    // Vérifier le solde USDC de l'utilisateur
    const usdcBalance = (await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address],
    })) as bigint

    if (usdcBalance < amountInWei) {
      throw new Error(
        `Solde USDC insuffisant. Vous avez ${formatUnits(usdcBalance, 6)} USDC mais tentez de déposer ${amount} USDC.`
      )
    }

    // Vérification que la réserve USDC est configurée sur la Pool (pour éviter une dépense de gas inutile)
    try {
      const reserveConfig = (await publicClient.readContract({
        address: POOL_DATA_PROVIDER_ADDRESS,
        abi: POOL_DATA_PROVIDER_ABI,
        functionName: "getReserveConfigurationData",
        args: [USDC_ADDRESS],
      })) as any

      // Est-ce que la reserve est active ?
      if (!reserveConfig[8]) {
        throw new Error("La réserve USDC n'est pas active sur cette Pool Aave.")
      }
      // Est-ce que la reserve est gelée ?
      if (reserveConfig[9]) {
        throw new Error("La réserve USDC est gelée sur cette Pool Aave.")
      }
    } catch (error: any) {
      console.error(
        "Erreur lors de la vérification de la configuration:",
        error
      )
      throw new Error(
        `Impossible de vérifier la configuration de la réserve USDC. ` +
          `L'adresse USDC (${USDC_ADDRESS}) n'est peut-être pas supportée par cette Pool.`
      )
    }

    // Vérifier le supply cap
    const [borrowCap, supplyCap] = (await publicClient.readContract({
      address: POOL_DATA_PROVIDER_ADDRESS,
      abi: POOL_DATA_PROVIDER_ABI,
      functionName: "getReserveCaps",
      args: [USDC_ADDRESS],
    })) as [bigint, bigint]

    // Récupérer les données actuelles de la réserve
    const reserveData = (await publicClient.readContract({
      address: POOL_DATA_PROVIDER_ADDRESS,
      abi: POOL_DATA_PROVIDER_ABI,
      functionName: "getReserveData",
      args: [USDC_ADDRESS],
    })) as any

    const totalSupplied = reserveData[2] // totalAToken

    // Vérifier si le dépôt dépasserait le cap
    // Note: Désactivé sur testnet car les données peuvent être incorrectes
    if (supplyCap > BigInt(0) && !isLocal) {
      const afterSupply = totalSupplied + amountInWei
      const availableCapacity = supplyCap - totalSupplied

      // Sur testnet, on ignore la vérification du cap si les données semblent aberrantes
      if (totalSupplied > supplyCap * BigInt(1000)) {
        console.warn(
          "Les données du supply cap semblent incorrectes, bypass de la vérification"
        )
      } else if (afterSupply > supplyCap) {
        throw new Error(
          `Le dépôt dépasserait le supply cap. ` +
            `Capacité disponible: ${formatUnits(availableCapacity, decimalsResult)} USDC. ` +
            `Vous tentez de déposer: ${amount} USDC.`
        )
      }
    }

    // Approve
    const approveTx = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [POOL_ADDRESS, amountInWei],
      account: address,
      gas: BigInt(100000),
    })

    await publicClient.waitForTransactionReceipt({ hash: approveTx })

    // Simuler la transaction pour supply avant de l'exécuter
    try {
      await publicClient.simulateContract({
        address: POOL_ADDRESS,
        abi: POOL_ABI,
        functionName: "supply",
        args: [USDC_ADDRESS, amountInWei, address, 0],
        account: address,
      })
    } catch (simError: any) {
      console.error("Erreur de simulation:", simError)
      throw new Error(
        `La transaction échouerait: ${simError.message || "Erreur inconnue"}`
      )
    }

    // 4. Exécuter le supply
    const depositTx = await walletClient.writeContract({
      address: POOL_ADDRESS,
      abi: POOL_ABI,
      functionName: "supply",
      args: [USDC_ADDRESS, amountInWei, address, 0],
      account: address,
      gas: BigInt(1000000),
    })

    await publicClient.waitForTransactionReceipt({ hash: depositTx })

    return { success: true, txHash: depositTx }
  } catch (error) {
    console.error("Erreur lors du dépôt :", error)
    return { success: false, error: (error as Error).message }
  }
}
