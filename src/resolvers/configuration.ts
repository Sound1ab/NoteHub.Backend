import {
  Configuration,
  MutationUpdateConfigurationArgs,
  Node_Type,
} from '../resolvers-types'

import { ConfigurationManager } from '../services/configuration/ConfigurationManager'
import { IContext } from '../server'
import { JwtManager } from '../services'
import { JwtMissingError } from '../errors'

const jwtManager = new JwtManager()

export const ConfigurationMutations = {
  async updateConfiguration(
    _: any,
    { input: configuration }: MutationUpdateConfigurationArgs,
    { jwt }: IContext
  ): Promise<Configuration> {
    if (!jwt) {
      throw JwtMissingError
    }

    const {
      body: { login },
    } = jwtManager.getJwtValues(jwt)

    const configurationManager = new ConfigurationManager(login)

    return configurationManager.updateConfiguration(configuration)
  },
}
