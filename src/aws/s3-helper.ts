import { S3 } from 'aws-sdk'
import { Address } from '../definitions/address'
import { BucketInfo } from '../definitions/crawl-information'

export class S3Helper {
  private readonly s3: S3
  private readonly bucket: string
  private readonly path: string

  constructor({ name, path }: BucketInfo) {
    this.s3 = new S3()
    this.bucket = name
    this.path = path
  }

  async upload(data: Object, filename: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: this.path + filename,
      ACL: 'public-read',
      Body: JSON.stringify(data),
    }
    console.log(`putting ${params.Key} to s3`)
    await this.s3
      .putObject(params, (err, data) => {
        if (err) {
          console.error('error writing object: ' + err)
        } else {
          console.log(`wrote ${params.Key} successfully`)
        }
      })
      .promise()
  }

  async listAddresses(): Promise<Address[]> {
    const params = {
      Bucket: this.bucket,
      Key: 'addresses.json',
    }
    return await this.s3
      .getObject(params, (err, data) => {
        if (err) {
          console.error('error get objects: ' + err)
        } else {
          console.log(`got ${params.Key} successfully`)
        }
      })
      .promise()
      .then((data) => JSON.parse(data.Body?.toString() ?? '[]') ?? [])
  }
}
