import { DexPricesResult, PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import { TokenData } from '@defichain/whale-api-client/dist/api/tokens'

export interface CrawlInformation {
  address: string
  isLOCKUserAddress: boolean
  dexPrices: DexPricesResult
  prices: PriceTicker[]
  poolPairs: PoolPairData[]
  tokens: TokenData[]
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
