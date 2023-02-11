import { DexPricesResult, PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'

export interface CrawlInformation {
  address: string
  dexPrices: DexPricesResult
  prices: PriceTicker[]
  poolPairs: PoolPairData[]
  bucket: BucketInfo
}

export interface TokenPrice {
  token: { id: string; symbol: string }
  denominationPrice: string
}

export interface BucketInfo {
  name: string
  path: string
}
