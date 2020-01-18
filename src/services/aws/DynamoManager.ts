import { DynamoDB } from 'aws-sdk'

const options =
  process.env.NODE_ENV === 'none'
    ? {
        accessKeyId: 'DEFAULT_ACCESS_KEY',
        endpoint: 'http://localhost:8000',
        region: 'localhost',
        secretAccessKey: 'DEFAULT_SECRET',
      }
    : {}

const dynamoDb = new DynamoDB.DocumentClient(options)

const TableName = process.env.DYNAMODB_TABLE

export class DynamoManager {
  public async create(id: string, values: Record<string, string>) {
    const timestamp = new Date().getTime()

    if (!TableName) {
      throw new Error('No tablename set')
    }

    const params = {
      Item: {
        createdAt: timestamp,
        id,
        updatedAt: timestamp,
        ...values,
      },
      TableName,
    }

    console.log('params', params)

    try {
      const response = await dynamoDb.put(params).promise()
      return response
    } catch (error) {
      throw new Error(`DynamoDB put error: ${error}`)
    }
  }
}
