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

export class DynamoManager {
  private readonly TableName: string

  constructor(tableName: string) {
    this.TableName = tableName
  }

  public async create(id: string, values: Record<string, string>) {
    const timestamp = new Date().getTime()

    const params = {
      Item: {
        createdAt: timestamp,
        id,
        updatedAt: timestamp,
        ...values,
      },
      TableName: this.TableName,
    }

    try {
      const response = await dynamoDb.put(params).promise()
      return response
    } catch (error) {
      throw new Error(`DynamoDB put error: ${error}`)
    }
  }

  public async read(id: string) {
    const params = {
      Key: {
        id,
      },
      TableName: this.TableName,
    }

    try {
      const response = await dynamoDb.get(params).promise()
      return response
    } catch (error) {
      throw new Error(`DynamoDB read error: ${error}`)
    }
  }

  public async delete(id: string) {
    const params = {
      Key: {
        id,
      },
      TableName: this.TableName,
    }

    try {
      const response = await dynamoDb.delete(params).promise()
      return response
    } catch (error) {
      throw new Error(`DynamoDB delete error: ${error}`)
    }
  }
}
