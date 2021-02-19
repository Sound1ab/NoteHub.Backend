import { DynamoManager } from '../aws/DynamoManager'

export class ConfigurationManager {
  private dynamoManager: DynamoManager

  constructor() {
    const tableName = process.env.USER_CONFIGURATION_TABLE

    if (!tableName) {
      throw new Error('No tablename set')
    }

    this.dynamoManager = new DynamoManager(tableName)
  }

  public async readConfiguration() {
    const { data } = await this.dynamoManager.read(id)
    return data
  }
}
