<p align="center">
  <img src="/public/img/campfire_logo.png" alt="Campfire Store API"/>
</p>
<br/>

**Campfire | Store API** is a demo project of an API for an online shop.

The API provides access to the shop's products, category system and simple user management, allows you to add products to the cart and place orders.

## API features

1. API documentation is powered by [Swagger UI](https://swagger.io/tools/swagger-ui/) and available on `/` or `/api/v1/api-docs/`.
2. Protected routes require authorization with JWT. Some routes are additionally restricted by roles.
3. Supports internationalization with multiple currencies and text localization. Use query parameters `language` and `currency` to tweak the responses.
4. Supports uploading a user's photo and multiple product images.
5. API requests are limited per IP.
6. Protected against parameter pollution and NoSQL query injection.
7. Supports CORS and secure HTTP headers.

## Project structure

The main goal of this project was to create a small and simple API for an online shop using **Node.js** and the **Express** framework.

### Build and start

Navigate to the project root and install the project dependencies with the command:

```
 npm install
```

For development, `nodemon` is used. Install it globally with the command:

```
 npm install -g nodemon
```

or as a development dependency:

```
 npm install --save-dev nodemon
```

After successful installation, copy `./config.env.template` in to `./config.env` and configure personal properties there.
The app requires connection to an instance of MongoDB. Create your own instance and set `DATABASE_USERNAME`, `DATABASE_PASSWORD` and `DATABASE` URL in the `./config.env` file.

With the `./dev-tools/data/import-test-data.js` script you can import sample data in to your database. Use command:

```
 node .\dev-tools\data\import-test-data.js --import
```

To clear the DB, use:

```
 node .\dev-tools\data\import-test-data.js --delete
```

To re-create data in the DB, use:

```
 node .\dev-tools\data\import-test-data.js --recreate
```

To start the app, use:

```
 npm start
```

To start the app in production environment, use:

```
 npm run start:prod
```

### Assets

1. Swagger UI theme is Flatop from [swagger-ui-themes](https://github.com/ostranme/swagger-ui-themes)
2. All product pictures are real and are the property of their manufacturers.
3. The API logo and favicon are designed spicifically for this project and belong to Konstantin Starostin. Please do not copy them.
