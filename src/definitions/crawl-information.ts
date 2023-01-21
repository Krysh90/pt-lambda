import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'

export interface CrawlInformation {
  address: string
  dexPrices: DexPrices
  prices: PriceTicker[]
  poolPairs: PoolPairData[]
}

export type DexPrices = Record<string, TokenPrice>

export interface TokenPrice {
  token: { id: string; symbol: string }
  denominationPrice: string
}
