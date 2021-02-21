import {
  Configuration,
  Node_Type,
  UpdateConfigurationInput,
} from '../../resolvers-types'

import { DynamoManager } from '../aws/DynamoManager'
import { encodeNodeId } from '../../utils'

export class ConfigurationManager {
  private dynamoManager: DynamoManager
  private readonly id: string

  constructor(login: string) {
    const tableName = process.env.USER_CONFIGURATION_TABLE

    if (!tableName) {
      throw new Error('No tablename set')
    }

    this.dynamoManager = new DynamoManager(tableName)
    this.id = encodeNodeId(Node_Type.User, login)
  }

  public async updateConfiguration(configuration: UpdateConfigurationInput) {
    await this.dynamoManager.put(this.id, configuration)

    return { id: this.id, ...configuration }
  }

  public async createConfiguration() {
    return this.dynamoManager.create(this.id)
  }

  public async readConfiguration(): Promise<Configuration> {
    const result = await this.dynamoManager.read(this.id)

    if (!result?.Item) {
      await this.createConfiguration()
      return this.readConfiguration()
    }

    return {
      ...result.Item,
      connectedRepos: result.Item?.connectedRepos ?? [],
    } as Configuration
  }
}
