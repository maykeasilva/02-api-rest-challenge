import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.get('/', async (request) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const { id: userId } = userSchema.parse(request.user)

    const meals = await knex('meals').where('user_id', userId).select('*')

    return { meals }
  })

  app.get('/:mealId', async (request) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const getMealParamsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { id: userId } = userSchema.parse(request.user)
    const { mealId } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id: mealId,
        user_id: userId,
      })
      .first()

    return { meal }
  })

  app.get('/metrics', async (request) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const { id: userId } = userSchema.parse(request.user)

    const totalMeals = await knex('meals').where('user_id', userId).select()

    const totalMealsOnDiet = await knex('meals')
      .where({
        user_id: userId,
        is_on_diet: true,
      })
      .count('id', { as: 'total' })
      .first()

    const totalMealsOffDiet = await knex('meals')
      .where({
        user_id: userId,
        is_on_diet: false,
      })
      .count('id', { as: 'total' })
      .first()

    const { bestDietSequence } = totalMeals.reduce((accumulator, meal) => {
        if (meal.is_on_diet) {
          accumulator.currentValue++
        } else {
          accumulator.currentValue = 0
        }

        if (accumulator.currentValue > accumulator.bestDietSequence) {
          accumulator.bestDietSequence = accumulator.currentValue
        }

        return accumulator
      }, { bestDietSequence: 0, currentValue: 0 }
    )

    return {
      totalMeals: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet?.total,
      totalMealsOffDiet: totalMealsOffDiet?.total,
      bestDietSequence,
    }
  })

  app.put('/:mealId', async (request, reply) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const getMealParamsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const updateMealsBodySchema = z.object({
      name: z.union([z.string(), z.undefined()]),
      description: z.union([z.string(), z.undefined()]),
      date: z.union([z.string(), z.undefined()]),
      hour: z.union([z.string(), z.undefined()]),
      is_on_diet: z.union([z.boolean(), z.undefined()]),
    })

    const { id: userId } = userSchema.parse(request.user)
    const { mealId } = getMealParamsSchema.parse(request.params)
    const { 
      name, 
      description, 
      date, 
      hour, 
      is_on_diet,
    } = updateMealsBodySchema.parse(request.body)

    if (!name && !description && !date && !hour && !is_on_diet) {
      return reply.status(400).send({
        message: 'At least one field is required.',
      })
    }

    const meal = await knex('meals')
      .where({
        id: mealId,
        user_id: userId,
      })
      .first()

    if (!meal) {
      return reply.status(404).send({
        message: 'Meal not found.',
      })
    }

    await knex('meals')
      .where('id', meal.id)
      .update({
        name: name ?? meal.name,
        description: description ?? meal.description,
        date: date ?? meal.date,
        hour: hour ?? meal.hour,
        is_on_diet: is_on_diet ?? meal.is_on_diet
      })

    return reply.status(204).send()
  })

  app.delete('/:mealId', async (request, reply) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const getMealParamsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { id: userId } = userSchema.parse(request.user)
    const { mealId } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id: mealId,
        user_id: userId,
      })
      .first()

    if (!meal) {
      return reply.status(404).send({
        message: 'Meal not found.',
      })
    }

    await knex('meals')
      .where('id', meal.id)
      .delete()

    return reply.status(204).send()
  })

  app.post('/', async (request, reply) => {
    const userSchema = z.object({
      id: z.string().uuid(),
      session_id: z.string().uuid(),
      username: z.string(),
    })

    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.string(),
      is_on_diet: z.boolean(),
    })

    const { id: userId } = userSchema.parse(request.user)
    const { 
      name, 
      description, 
      date, 
      hour, 
      is_on_diet,
    } = createMealsBodySchema.parse(request.body)

    
    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      date,
      hour,
      is_on_diet,
    })

    return reply.status(201).send()
  })
}
