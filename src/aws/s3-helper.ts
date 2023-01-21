import { S3 } from 'aws-sdk'

export class S3Helper {
  private readonly s3: S3
  private readonly path = process.env.S3_PATH ?? ''

  constructor() {
    this.s3 = new S3()
  }

  async upload(data: Object, filename: string): Promise<void> {
    const params = {
      Bucket: process.env.S3_BUCKET!,
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
