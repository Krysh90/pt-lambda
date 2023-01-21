import { Status } from './definitions/status'
import { CrawlInformation } from './definitions/crawl-information'
import { AddressCrawler } from './crawler/address.crawler'
import { WhaleClient } from './ocean/whale-client'
import { gatherPrices, uniqueConcat } from './definitions/address-information.utils'
import { AddressInformation } from './definitions/address-information'

export async function main(info: CrawlInformation): Promise<Status> {
  const client = new WhaleClient()
  const tokenInfos = await AddressCrawler.create(info.address, client).start()
  const prices = gatherPrices(
    info.prices,
    info.dexPrices,
    uniqueConcat(tokenInfos.addressTokens, tokenInfos.collateral, tokenInfos.loans),
  )
  const addressInfo: AddressInformation = {
    blockHeight: await client.getBlockHeight(),
    timestamp: new Date().toISOString(),
    ...tokenInfos,
    addressNetTokens: [], // TODO
    prices: prices ?? [],
  }
  console.log(JSON.stringify(addressInfo))
  return { statusCode: 200 }
}
