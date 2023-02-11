import { AWSError, Lambda } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
import { CrawlInformation } from '../definitions/crawl-information'

export class LambdaHelper {
  private readonly lambda: Lambda

  constructor() {
    this.lambda = new Lambda()
  }

  async execute(payload: CrawlInformation): Promise<PromiseResult<Lambda.InvocationResponse, AWSError>> {
    let params = {
      FunctionName: 'pt-track',
      InvocationType: 'Event',
      LogType: 'None',
      Payload: JSON.stringify(payload),
    }

    console.log(`invoking crawler for ${payload.address}`)

    return this.lambda.invoke(params).promise()
  }
}
