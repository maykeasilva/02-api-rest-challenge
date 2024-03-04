import request from 'supertest'
import { it, expect, describe, beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Meals Routes', () => {
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

  it('should be able to create a new meal', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: 1,
      })
    ])
  })

  it('should be able to get specific meal', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: 1,
      })
    )
  })

  it('should be able to get user metrics', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'First meal',
        description: 'Description First meal',
        date: '31/01/2024',
        hour: '09:00',
        is_on_diet: true,
      })
      .expect(201)
    
    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Second meal',
        description: 'Description Second meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Third meal',
        description: 'Description Third meal',
        date: '31/01/2024',
        hour: '20:00',
        is_on_diet: false,
      })
      .expect(201)

    const getUserMetricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(getUserMetricsResponse.body).toEqual(
      expect.objectContaining({
        totalMeals: 3,
        totalMealsOnDiet: 2,
        totalMealsOffDiet: 1,
        bestDietSequence: 2,
      })
    )
  })

  it('should be able to update a meal', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Updated meal',
        description: 'Updated meal description',
        is_on_diet: false,
      })
      .expect(204)

    const listUpdatedMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUpdatedMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Updated meal',
        description: 'Updated meal description',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: 0,
      })
    ])
  })

  it('should be able to delete a meal', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Description new meal',
        date: '31/01/2024',
        hour: '12:00',
        is_on_diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(204)

    const listDeletedMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listDeletedMealsResponse.body.meals).toEqual([])
  })
})
