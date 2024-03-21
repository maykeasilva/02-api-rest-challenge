# Module challenge: Creating REST API with Node.js

In this challenge we will develop an API for daily diet control, the Daily Diet API. This project is part of the learning process and is not a production-ready application.

## Setup
- Clone the repository;
- Install dependencies (`npm install`);
- Copy `.env.example` file (`cp .env.example .env`);
- Setup SQLite (`npm run knex -- migrate:latest`);
- Run application (`npm run dev`);
- Test it! (I personally recommend testing with [Hoppscotch](https://hoppscotch.io/) or [Bruno API Client](https://www.usebruno.com/));

## HTTP

### POST `/users/register`

Create a new user.

#### Request body

```json
{
    "username": "John Doe"
}
```

### POST `/users/login`

Authenticate a user.

#### Request body

```json
{
    "username": "John Doe"
}
```

### POST `/meals`

Create a new meal.

#### Request body

```json
{
    "name": "New meal",
    "description": "Meal description",
    "date": "01/01/2024",
    "hour": "09:00",
    "is_on_diet": true
}
```

### GET `/meals`

List all meals.

#### Response body

```json
{
    "meals": [
        {
            "id": "590222f8-c270-4f91-807d-bbd469d3b8f1",
            "user_id": "5ddbb9b0-fdab-481c-8a25-c82fc6afda1c",
            "name": "Morning meal",
            "description": "Description of the morning meal",
            "date": "01/01/2024",
            "hour": "09:00",
            "is_on_diet": 1
        }
    ]
}
```

### GET `/meals/:mealId`

Return data from a single meal.

#### Response body

```json
{
    "meal": {
        "id": "590222f8-c270-4f91-807d-bbd469d3b8f1",
        "user_id": "5ddbb9b0-fdab-481c-8a25-c82fc6afda1c",
        "name": "Morning meal",
        "description": "Description of the morning meal",
        "date": "01/01/2024",
        "hour": "09:00",
        "is_on_diet": 1
    }
}
```

### GET `/meals/metrics`

Return user metrics.

#### Response body

```json
{
    "totalMeals": 1,
    "totalMealsOnDiet": 1,
    "totalMealsOffDiet": 0,
    "bestDietSequence": 1
}
```

### PUT `/meals/:mealId`

Updated a specific meal.

#### Request body

```json
{
    "name": "Updated meal",
    "description": "Updated meal description",
    "date": "01/01/2024",
    "hour": "09:00",
    "is_on_diet": true
}
```

### DELETE `/meals/:mealId`

Delete a meal.
