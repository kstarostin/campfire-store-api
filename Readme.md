<p align="center">
  <img src="/public/img/campfire_store_api_logo.png" alt="Campfire Store API"/>
</p>
<br/>

**Campfire Store API** is a demo project of an API for an online store.

The API provides access to the store products, category system and simple user management, allows you to add products to the cart and place orders.

Check out the API visual documentation <a href="https://campfire-store-api.onrender.com/api/v1/api-docs/" target="_blank">here</a> or use the Postman collection `./dev-tools/campfire-store-api.postman_collection.json` with the environment file `./dev-tools/prod-env.campfire-store-api.postman_collection.json`.

## API features

1. API documentation is powered by [Swagger UI](https://swagger.io/tools/swagger-ui/) and available on `/` or `/api/v1/api-docs/`.
2. Protected routes require authorization with JWT. Some routes are additionally restricted by roles.
3. Supports internationalization with multiple currencies and text localization. Use request query parameters `language` and `currency` to tweak the responses.
4. Supports uploading a user's photo and multiple product images.
5. API requests are limited per IP.
6. Protected against parameter pollution and NoSQL query injection.
7. Supports CORS and secure HTTP headers.

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) cluster (free M0 tier works well for this demo)

## Project structure

The main goal of this project was to create a small and simple API for an online store using **Node.js** and **Express** framework.

### Configuration

Copy `./config.env.template` to `./config.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `DATABASE_USERNAME` | MongoDB Atlas username |
| `DATABASE_PASSWORD` | MongoDB Atlas password |
| `DATABASE` | Connection string **with** `<USERNAME>` and `<PASSWORD>` placeholders and the database name in the path, e.g. `mongodb+srv://<USERNAME>:<PASSWORD>@cluster.example.net/campfire-store?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret used to sign JWT tokens (required for login/signup) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `30d` |
| `JWT_COOKIE_EXPIRES_IN` | Cookie lifetime in days |

> **Important:** include the database name in the `DATABASE` URL (e.g. `/campfire-store`). Without it, Mongoose connects to the default `test` database, which will appear empty even when Atlas contains your data.

### Build and start

Install dependencies:

```
npm install
```

Import sample data into your database:

```
node dev-tools/data/import-test-data.js --import
```

Other data commands:

```
node dev-tools/data/import-test-data.js --delete
node dev-tools/data/import-test-data.js --recreate
```

Start the app in development (uses `nodemon`, included as a dev dependency):

```
npm start
```

On startup, the console prints clickable links to the app and Swagger docs, for example:

```
Open in browser: http://localhost:3000
API docs: http://localhost:3000/api/v1/api-docs
```

Start the app locally in production mode:

```
npm run start:prod
```

### Tests

A small regression test suite covers auth, public endpoints, i18n, and pagination. Tests use your `config.env` database and **reset it to the seed data** when they finish.

```
npm test
```

Requires `JWT_SECRET` and a working MongoDB connection in `config.env`.

### Deploy to Render

This project includes a [`render.yaml`](./render.yaml) blueprint for deploying to [Render](https://render.com) on the free tier.

1. Push the repository to GitHub or GitLab.
2. In the Render Dashboard, choose **New → Blueprint** and connect the repo.
3. When prompted, provide `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `DATABASE` (Atlas URI with `<USERNAME>` and `<PASSWORD>` placeholders). `JWT_SECRET` is generated automatically.
4. In MongoDB Atlas, allow network access from `0.0.0.0/0` (or Render's outbound IPs).
5. After the first deploy, seed the database if needed:

```
node dev-tools/data/import-test-data.js --import
```

Swagger will be available at `https://<your-service>.onrender.com/api/v1/api-docs`.

> Free Render services spin down after ~15 minutes of inactivity. The first request after sleep may take 30–60 seconds (cold start); warm requests are much faster.

### Assets

1. Swagger UI theme is Flattop by [Swagger UI Themes](https://ostranme.github.io/swagger-ui-themes/).
2. All product pictures are real and are the property of their manufacturers.
3. The sample customers photos provided by [unsplash.com](https://unsplash.com/).
4. The API logo and favicon are designed specifically for this project and belong to Konstantin Starostin. Please do not copy them.
