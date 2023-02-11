import { LambdaHelper } from './aws/lambda-helper'
import { S3Helper } from './aws/s3-helper'
import { CrawlInformation } from './definitions/crawl-information'
import { ManagerInformation } from './definitions/manager-information'
import { Status } from './definitions/status'
import { WhaleClient } from './ocean/whale-client'

export async function main(info?: ManagerInformation): Promise<Status> {
  const client = new WhaleClient()
  const bucket = { name: 'pt-track', path: 'addresses/' }

  const dexPrices = await client.getDexPrices()
  const prices = await client.getPrices()
  const poolPairs = await client.getPoolPairs()

  const s3 = new S3Helper(bucket)
  const addresses = info?.addresses ?? (await s3.listAddresses())

  await Promise.all(
    addresses.map((address) => {
      const crawlInfo: CrawlInformation = {
        address,
        bucket,
        dexPrices,
        prices,
        poolPairs,
      }

      const lambda = new LambdaHelper()
      return lambda.execute(crawlInfo)
    }),
  )

  console.log('all crawler invocations finished')

  return { statusCode: 200 }
}
