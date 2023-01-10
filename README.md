# NC News API

Northcoders (NC) News API is a project built for the purpose of accessing application data programmatically. The intention is to mimic the building of a real world backend news service (such as reddit) which should provide this data to the front end architecture. The API is hosted through Azure App Service.

To take a look at the API endpoints and view them in action click [here](https://nc-news-api.azurewebsites.net/api/).

## Table of contents

- [Built with](#Built-with)
- [Installation](#installation)
- [Setting up environment variables](#setting-up-environment-variables)
- [Seeding the database](#seeding-the-database)
- [Running tests with Jest](#running-tests-with-jest)
- [Complete list of endpoints](#complete-list-of-endpoints)

## Built with

The technologies and packages used for this project are listed below:

- [node.js](https://nodejs.org/en/) v14.17.4 LTS
- [postgreSQL](https://www.postgresql.org/) v13.0.0

Project dependencies:

- [dotenv](https://www.npmjs.com/package/dotenv) v10.0.0
- [express](https://expressjs.com/) v4.17.1
- [pg](https://node-postgres.com/) v8.7.1
- [pg-format](https://www.npmjs.com/package/pg-format) v1.0.4

Dev dependencies:

- [jest](https://jestjs.io/) v27.06
- [jest-sorted](https://www.npmjs.com/package/jest-sorted) v1.0.12
- [supertest](https://www.npmjs.com/package/supertest) v6.1.4

## Installation

To run the API locally you will need to follow the steps below:

1. Ensure that you have installed:

- Node.js (download [here](https://nodejs.org/en/))
- Postgres (download [here](https://www.postgresql.org/))

2. Fork and Clone the repo
3. Open the repo and install the dependencies by running:

```
    npm install
```

**Optional**

4. In order to run the tests install the following dev dependencies:

```
  npm install -D jest jest-sorted supertest
```

5. Run tests:

```
  npm test
```

## Setting up enivronment variables

You will need to create two .env files for this project:

.env.test containing:

```
  DBNAME=nc_news_test
```

.env.development containing:

```
  DBNAME=nc_news
```

Make sure that these .env files are .gitignored.

## Seeding the database

Firstly, set up the database by running:

```
  npm run setup-dbs
```

Next, set up the connection the database and seed the databases with the data by running:

```
  npm run seed
```

To get a further insight into the seeding of the database you can look in the seed.js file which contains information on the table structures, data types and foreign key references.

## Complete list of endpoints

See below for a complete list of endpoints that are accessible on the server.
**Alternatively** an overview of endpoints, descriptions and examples are provided on the /api endpoint.

```
    GET /api
    GET /api/topics
    GET /api/articles
    GET /api/articles/:article_id
    PATCH /api/articles/:article_id
    GET /api/articles/:article_id/comments
    POST /api/articles/:article_id/comments
    PATCH /api/comments/:comment_id
    DELETE /api/comments/:comment_id
    GET /api/users
    GET /api/users/:username
```

## Examples

GET /api/articles/1

```
"article": {
        "article_id": 1,
        "author": "butter_bridge",
        "body": "I find this existence challenging",
        "created_at": "2020-07-09T20:11:00.000Z",
        "title": "Living in the shadow of a great man",
        "topic": "mitch",
        "votes": 100,
        "comment_count": "13"
      }
```
