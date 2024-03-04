import request from 'supertest'
import { it, expect, describe, beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        username: 'John Doe',
      })
      .expect(201)
  })

  it('should be able to connect a user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        username: 'John Doe',
      })
      .expect(201)

    const connectUserResponse = await request(app.server)
      .post('/users/login')
      .send({
        username: 'John Doe',
      })
      .expect(200)

    const cookies = connectUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining('sessionId')
    ]))
  })
})
