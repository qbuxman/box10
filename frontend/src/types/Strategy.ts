export type Strategy = {
  id: string
  title: string
  description: string
  apr: number
  risk: number
  icon?: string
  active: boolean
}

export type StrategyDetails = Strategy & { details: string; horizon: string }
