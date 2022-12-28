import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import BigNumber from 'bignumber.js'
import { PriceInformation, Token } from './address-information'
import { DexPrices } from './crawl-information'

export function toToken({
  id,
  amount,
  symbolKey,
  isLPS,
}: {
  id: string
  amount: string
  symbolKey: string
  isLPS: boolean
}): Token {
  return { id: id, amount, symbol: symbolKey, isLiquidityMiningPair: isLPS }
}

export function sumOrAddToken(a: Token[], b: Token[]): Token[] {
  const result = a
  for (const bToken of b) {
    const aToken = a.find((t) => t.id === bToken.id)
    if (aToken) {
      result.push({ ...aToken, amount: BigNumber.sum(aToken.amount, bToken.amount).toString() })
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
  dexPrices: DexPrices,
  tokens?: Token[],
): PriceInformation[] | undefined {
  return tokens
    ?.filter((t) => !t.isLiquidityMiningPair)
    .map((t) => ({ symbol: t.symbol, usd: findPrice(prices, dexPrices, t.symbol) ?? '0' }))
    .filter((info) => info.usd != null)
}

function findPrice(prices: PriceTicker[], dexPrices: DexPrices, symbol: string): string | undefined {
  if (symbol === 'DUSD') return dexPrices['DUSD'].denominationPrice
  return prices.find((t) => t.price.token === symbol)?.price.aggregated.amount
}
