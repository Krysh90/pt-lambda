import { PoolPairData, DexPricesResult } from '@defichain/whale-api-client/dist/api/poolpairs'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import BigNumber from 'bignumber.js'
import { PriceInformation, Token } from './address-information'

export function toToken({
  id,
  amount,
  symbolKey,
  isLPS,
  additionalInformation,
}: {
  id: string
  amount: string
  symbolKey: string
  isLPS: boolean
  additionalInformation?: string
}): Token {
  return { id: id, amount, symbol: symbolKey, isLiquidityMiningPair: isLPS, additionalInformation }
}

export function sumOrAddToken(a: Token[], b: Token[]): Token[] {
  const result = a
  for (const bToken of b) {
    const aToken = a.find((t) => t.id === bToken.id)
    if (aToken) {
      aToken.amount = BigNumber.sum(aToken.amount, bToken.amount).toNumber().toFixed(8)
    } else {
      result.push(bToken)
    }
  }
  return result
}

export function uniqueConcat(...tokens: Token[][]): Token[] {
  return tokens.reduce((prev, curr) => {
    const combined = prev.concat(curr)
    const combinedIds = combined.map((t) => t.id)
    return combined.filter((item, pos) => combinedIds.indexOf(item.id) === pos)
  })
}

export function gatherPrices(
  prices: PriceTicker[],
  dexPrices: DexPricesResult,
  tokens?: Token[],
): PriceInformation[] | undefined {
  return tokens
    ?.filter((t) => !t.isLiquidityMiningPair)
    .map((t) => ({ symbol: t.symbol, usd: findPrice(prices, dexPrices, t.symbol) ?? '0' }))
    .filter((info) => info.usd != null)
}

function findPrice(prices: PriceTicker[], dexPrices: DexPricesResult, symbol: string): string | undefined {
  if (symbol === 'DUSD') return dexPrices.dexPrices['DUSD'].denominationPrice
  return prices.find((t) => t.price.token === symbol)?.price.aggregated.amount
}

export function netTokensFor(tokens: Token[], poolPairs: PoolPairData[]): Token[] {
  const lmTokens = tokens.filter((t) => t.isLiquidityMiningPair)
  return sumOrAddToken(
    tokens.filter((t) => !t.isLiquidityMiningPair),
    lmTokens
      .map((lm) =>
        getNetTokens(
          new BigNumber(lm.amount),
          poolPairs.find((pair) => pair.id === lm.id),
        ),
      )
      .reduce((acc, item) => sumOrAddToken(acc, item), []),
  )
}

function getNetTokens(amount: BigNumber, poolPair?: PoolPairData): Token[] {
  if (!poolPair) return []
  return [
    {
      id: poolPair.tokenA.id,
      symbol: poolPair.tokenA.symbol,
      amount: amount.dividedBy(poolPair.totalLiquidity.token).multipliedBy(poolPair.tokenA.reserve).toString(),
      isLiquidityMiningPair: false,
    },
    {
      id: poolPair.tokenB.id,
      symbol: poolPair.tokenB.symbol,
      amount: amount.dividedBy(poolPair.totalLiquidity.token).multipliedBy(poolPair.tokenB.reserve).toString(),
      isLiquidityMiningPair: false,
    },
  ]
}
