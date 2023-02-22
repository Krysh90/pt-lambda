import { Status } from './definitions/status'
import { CrawlInformation } from './definitions/crawl-information'
import { AddressCrawler } from './crawler/address.crawler'
import { WhaleClient } from './ocean/whale-client'
import { gatherPrices, netTokensFor, uniqueConcat } from './definitions/address-information.utils'
import { AddressInformation } from './definitions/address-information'
import { S3Helper } from './aws/s3-helper'

export async function main(info: CrawlInformation): Promise<Status> {
  const client = new WhaleClient()

  const tokenInfos = await AddressCrawler.create(info.address, info.isLOCKUserAddress, info.tokens, client).start()
  const prices = gatherPrices(
    info.prices,
    info.dexPrices,
    uniqueConcat(tokenInfos.addressTokens, tokenInfos.collateral, tokenInfos.loans),
  )
  const date = new Date().toISOString()
  const addressInfo: AddressInformation = {
    address: info.address,
    blockHeight: await client.getBlockHeight(),
    timestamp: date,
    ...tokenInfos,
    addressNetTokens: netTokensFor(tokenInfos.addressTokens, info.poolPairs),
    prices: prices ?? [],
  }
  const day = date.substring(0, 10)
  const s3 = new S3Helper(info.bucket)
  await s3.upload(addressInfo, `${info.address}/${day}.json`)
  return { statusCode: 200 }
}
