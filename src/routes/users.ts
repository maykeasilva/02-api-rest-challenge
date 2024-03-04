import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const connectUserBodySchema = z.object({
      username: z.string(),
    })
    
    const { username } = connectUserBodySchema.parse(request.body)

    const user = await knex('users')
      .where('username', username)
      .first()

    if (!user) {
      return reply.status(404).send({
        message: 'User not found.',
      })
    }

    return reply
      .setCookie('sessionId', user.session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      .send()
  })

  app.post('/register', async (request, reply) => {
    const registerUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = registerUserBodySchema.parse(request.body)

    const checkUsername = await knex('users')
      .where('username', username)
      .first()

    if (checkUsername) {
      return reply.status(409).send({
        message: 'Username exists.',
      })
    }
 
    await knex('users').insert({
      id: randomUUID(),
      session_id: randomUUID(),
      username: username
    })

    return reply.status(201).send()
  })
}