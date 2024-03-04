import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

const databaseUrl = env.DATABASE_CLIENT === 'sqlite'
  ? { 
      filename: env.DATABASE_URL,
    }
  : env.DATABASE_URL

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseUrl,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)
