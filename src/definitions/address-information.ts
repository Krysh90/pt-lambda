export interface AddressInformation {
  timestamp: string
  blockHeight: number
  address: string
  addressNetTokens: Token[]
  addressTokens: Token[]
  collateral: Token[]
  loans: Token[]
  prices: PriceInformation[]
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
}
