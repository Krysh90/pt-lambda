export interface AddressInformation {
  timestamp: string
  blockHeight: number
  address: string
  addressNetTokens: Token[]
  addressTokens: Token[]
  collateral: Token[]
  loans: Token[]
  prices: PriceInformation[]
  lockTokens?: Token[]
}

export interface PriceInformation {
  symbol: string
  usd: string
}

export interface Token {
  id: string
  symbol: string
  isLiquidityMiningPair: boolean
  amount: string
  additionalInformation?: string
}
