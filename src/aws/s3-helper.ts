import { S3 } from 'aws-sdk'
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
    console.log('putting to s3: ' + JSON.stringify(params))
    await this.s3
      .putObject(params, (err, data) => {
        if (err) {
          console.error('error writing object: ' + err)
        } else {
          console.log('wrote object: ' + JSON.stringify(data))
        }
      })
      .promise()
  }
}
