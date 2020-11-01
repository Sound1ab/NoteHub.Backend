import { S3 } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

const options =
  process.env.NODE_ENV === 'none'
    ? {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        endpoint: 'http://localhost:4569',
        region: 'localhost',
        s3ForcePathStyle: true,
        secretAccessKey: 'S3RVER',
      }
    : {}

const s3 = new S3(options)

export class S3Manager {
  private readonly Bucket: string

  constructor(bucket: string) {
    this.Bucket = bucket
  }

  public async createSignedUrl() {
    const params = {
      Bucket: this.Bucket,
      Key: uuidv4(),
    }

    try {
      const url = await s3.getSignedUrlPromise('putObject', params)
      return url
    } catch (error) {
      throw new Error(`S3 getSignedUrl error: ${error}`)
    }
  }
}
