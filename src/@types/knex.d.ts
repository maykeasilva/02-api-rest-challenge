import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id: string
      username: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      date: string
      hour: string
      is_on_diet: boolean
    }
  }
}
