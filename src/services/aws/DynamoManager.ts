import { DynamoDB } from 'aws-sdk'

const options =
  process.env.NODE_ENV === 'none'
    ? {
        accessKeyId: process.env.SERVERLESS_APP_ACCESS_KEY_ID!,
        endpoint: 'http://localhost:8000',
        region: 'localhost',
        secretAccessKey: process.env.SERVERLESS_APP_SECRET_ACCESS_KEY!,
      }
    : {}

const dynamoDb = new DynamoDB.DocumentClient(options)

export class DynamoManager {
  private readonly TableName: string

  constructor(tableName: string) {
    this.TableName = tableName
  }

  public async create(id: string, values?: Record<string, any>) {
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

  public async put(id: string, values: Record<string, any>) {
    const timestamp = new Date().getTime()

    const params = {
      Item: {
        ...values,
        id,
        updatedAt: timestamp,
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

  public async update(
    id: string,
    updateExpression: string,
    expressionAttributeNames: Record<string, any>,
    expressionAttributeValues: Record<string, any>
  ) {
    const params = {
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Key: {
        id,
      },
      ReturnValues: 'ALL_NEW',
      TableName: this.TableName,
      UpdateExpression: updateExpression,
    }

    try {
      const response = await dynamoDb.update(params).promise()
      return response
    } catch (error) {
      throw new Error(`DynamoDB update error: ${error}`)
    }
  }
}
