import type * as client from '@botpress/client'
import type * as sdk from '@botpress/sdk'
import { z } from '@botpress/sdk'
import * as utils from '../utils'
import * as types from './typings'

export namespace from {
  export const sdk = (i: sdk.IntegrationDefinition): types.IntegrationDefinition => {
    return {
      id: null,
      name: i.name,
      version: i.version,
      user: {
        tags: i.user?.tags ?? {},
        creation: i.user?.creation ?? { enabled: false, requiredTags: [] },
      },
      configuration: i.configuration ? _mapSchema(i.configuration) : { schema: {} },
      configurations: i.configurations ? utils.records.mapValues(i.configurations, _mapSchema) : {},
      events: i.events ? utils.records.mapValues(i.events, _mapSchema) : {},
      states: i.states ? utils.records.mapValues(i.states, _mapSchema) : {},
      actions: i.actions
        ? utils.records.mapValues(i.actions, (a) => ({
            input: _mapSchema(a.input),
            output: _mapSchema(a.output),
          }))
        : {},
      channels: i.channels
        ? utils.records.mapValues(i.channels, (c) => ({
            conversation: {
              tags: c.conversation?.tags ?? {},
              creation: c.conversation?.creation ?? { enabled: false, requiredTags: [] },
            },
            message: {
              tags: c.message?.tags ?? {},
            },
            messages: utils.records.mapValues(c.messages, _mapSchema),
          }))
        : {},
      entities: i.entities ? utils.records.mapValues(i.entities, _mapSchema) : {},
    }
  }

  export const client = (i: client.Integration): types.IntegrationDefinition => {
    const { id, name, version, configuration, configurations, channels, states, events, actions, user, entities } = i
    return { id, name, version, configuration, configurations, channels, states, events, actions, user, entities }
  }

  const _mapSchema = <T extends { schema: z.ZodObject<any> }>(
    x: T
  ): utils.types.Merge<T, { schema: ReturnType<typeof utils.schema.mapZodToJsonSchema> }> => ({
    ...x,
    schema: utils.schema.mapZodToJsonSchema(x),
  })
}
