const request = require('supertest');
const app = require('../app');

const API = '/api/v1';

const TEST_USER = {
  email: 'alex.chen@explorernet.net',
  password: 'test1234',
  id: '66237f6401706e88a6f9a5e3',
};

const ALEX_WISHLIST_ID = '6624c705acb7934041bea005';

const SAMPLE_PRODUCT_ID = '5c88fa8cf4afda39709c2955';
const GRAIL_PRODUCT_ID = '6635eaef6fbd7b858b6acb86';
const KAYAKS_ROOT_CATEGORY_ID = '661f8a811d571619fe96eec2';
const TOURING_KAYAKS_CATEGORY_ID = '661f8a8cf7b9265221dba8d2';
const GRAVEL_BIKES_CATEGORY_CODE = 'gravel-bikes';
const BAGS_AND_GEAR_CATEGORY_CODE = 'bags-and-gear';
const BICYCLES_ROOT_CATEGORY_ID = '661f8a9b6633eab0748e2638';
const BESTSELLER_BADGE_ID = '662b497f11aed4312b44a010';

const ADMIN_USER = {
  email: 'sarah.johnson@examplemail.com',
  password: 'test1234',
};

describe('Campfire Store API regression suite', () => {
  let authToken;
  let adminToken;

  test('app module loads', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  test('GET /languages returns seeded languages', async () => {
    const response = await request(app).get(`${API}/languages`).expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.documents.length).toBeGreaterThanOrEqual(2);

    const codes = response.body.data.documents.map((language) => language.code);
    expect(codes).toEqual(expect.arrayContaining(['en', 'de']));
  });

  test('GET /categories returns icon keys for storefront rendering', async () => {
    const response = await request(app)
      .get(`${API}/categories`)
      .query({ language: 'en' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBeGreaterThanOrEqual(32);
    expect(response.body.data.documents.length).toBeGreaterThanOrEqual(32);

    for (const category of response.body.data.documents) {
      expect(category.icon).toBeDefined();
    }

    const kayaks = response.body.data.documents.find(
      (category) => category.code === 'kayaks',
    );
    expect(kayaks.icon).toBe('sailboat');
  });

  test('GET /categories/:code resolves category by unique code', async () => {
    const response = await request(app)
      .get(`${API}/categories/${GRAVEL_BIKES_CATEGORY_CODE}`)
      .query({ language: 'en', currency: 'EUR' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.document.code).toBe(GRAVEL_BIKES_CATEGORY_CODE);
    expect(response.body.data.document.nameI18n.en).toBe('Gravel bikes');
  });

  test('GET /categories/bags-and-gear resolves renamed root category', async () => {
    const response = await request(app)
      .get(`${API}/categories/${BAGS_AND_GEAR_CATEGORY_CODE}`)
      .query({ language: 'en' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.document.code).toBe(BAGS_AND_GEAR_CATEGORY_CODE);
    expect(response.body.data.document.nameI18n.en).toBe('Bags & gear');
    expect(response.body.data.document.icon).toBe('backpack');
  });

  test('GET /categories/footwear returns sport-shoe icon', async () => {
    const response = await request(app)
      .get(`${API}/categories/footwear`)
      .query({ language: 'en' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.document.code).toBe('footwear');
    expect(response.body.data.document.icon).toBe('sport-shoe');
  });

  test('GET /categories/sleeping-bags returns empty product list', async () => {
    const response = await request(app)
      .get(`${API}/categories/sleeping-bags/products`)
      .query({ language: 'en', currency: 'EUR', page: 1, limit: 8 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBe(0);
    expect(response.body.data.documents).toEqual([]);
  });

  test('GET /categories/:code/products returns products for category code', async () => {
    const response = await request(app)
      .get(`${API}/categories/${GRAVEL_BIKES_CATEGORY_CODE}/products`)
      .query({ language: 'en', currency: 'EUR', page: 1, limit: 8 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBeGreaterThan(0);
    expect(response.body.data.documents.length).toBeGreaterThan(0);
  });

  test('GET /products returns seeded products', async () => {
    const response = await request(app).get(`${API}/products`).expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.documents.length).toBeGreaterThan(0);
  });

  test('POST /users/login succeeds with valid credentials', async () => {
    const response = await request(app)
      .post(`${API}/users/login`)
      .send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.data.document.email).toBe(TEST_USER.email);

    authToken = response.body.token;
  });

  test('POST /users/login rejects invalid credentials', async () => {
    const response = await request(app)
      .post(`${API}/users/login`)
      .send({
        email: TEST_USER.email,
        password: 'wrong-password',
      })
      .expect(401);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/incorrect email or password/i);
  });

  test('protected route rejects requests without a token', async () => {
    const response = await request(app).get(`${API}/users`).expect(401);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/log in/i);
  });

  test('protected route accepts a valid bearer token', async () => {
    const response = await request(app)
      .get(`${API}/users/${TEST_USER.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.document.email).toBe(TEST_USER.email);
  });

  test('user can read their own profile', async () => {
    const response = await request(app)
      .get(`${API}/users/${TEST_USER.email}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.document._id).toBe(TEST_USER.id);
  });

  test('regular user cannot list all users', async () => {
    const response = await request(app)
      .get(`${API}/users`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/permission/i);
  });

  test('GET /products?language=de returns localized product text', async () => {
    const response = await request(app)
      .get(`${API}/products/${SAMPLE_PRODUCT_ID}`)
      .query({ language: 'de' })
      .expect(200);

    const product = response.body.data.document;

    expect(product.descriptionI18n.de).toBeDefined();
    expect(product.descriptionI18n.en).toBeUndefined();
  });

  test('GET /products?limit=1 returns a single product', async () => {
    const response = await request(app)
      .get(`${API}/products`)
      .query({ limit: 1, page: 1 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.documents).toHaveLength(1);
  });

  test('GET /products returns price quick filters when meaningful', async () => {
    const response = await request(app)
      .get(`${API}/products`)
      .query({ language: 'en', currency: 'EUR', limit: 100 })
      .expect(200);

    const priceFilter = response.body.data.filters.find(
      (filter) => filter.name === 'priceI18n',
    );

    expect(priceFilter).toBeDefined();
    expect(Array.isArray(priceFilter.quickFilters)).toBe(true);
    expect(priceFilter.quickFilters.length).toBeGreaterThan(0);

    for (const quickFilter of priceFilter.quickFilters) {
      expect(quickFilter.max).toBeGreaterThan(0);
      expect(quickFilter.count).toBeGreaterThanOrEqual(1);
      expect(quickFilter.count).toBeLessThanOrEqual(
        Math.max(1, Math.floor(response.body.resultsTotal * 0.25)),
      );
    }
  });

  test('GET /products?filter applies under-price quick filter', async () => {
    const unfiltered = await request(app)
      .get(`${API}/products`)
      .query({ language: 'en', currency: 'EUR', limit: 100 })
      .expect(200);

    const priceFilter = unfiltered.body.data.filters.find(
      (filter) => filter.name === 'priceI18n',
    );
    const quickFilter = priceFilter.quickFilters[0];
    expect(quickFilter).toBeDefined();

    const filtered = await request(app)
      .get(`${API}/products`)
      .query({
        language: 'en',
        currency: 'EUR',
        limit: 100,
        filter: JSON.stringify({ 'priceI18n.EUR': { $lt: quickFilter.max } }),
      })
      .expect(200);

    expect(filtered.body.resultsTotal).toBe(quickFilter.count);
    expect(filtered.body.resultsTotal).toBeLessThan(unfiltered.body.resultsTotal);
    expect(
      filtered.body.data.filters.find((filter) => filter.name === 'priceI18n').quickFilters,
    ).toEqual(priceFilter.quickFilters);
  });

  test('GET /categories/:id/products returns products for root and leaf categories', async () => {
    const rootResponse = await request(app)
      .get(`${API}/categories/${KAYAKS_ROOT_CATEGORY_ID}/products`)
      .query({ language: 'en', currency: 'EUR', page: 1, limit: 8, sort: 'featureOrder' })
      .expect(200);

    expect(rootResponse.body.status).toBe('success');
    expect(rootResponse.body.resultsTotal).toBeGreaterThan(0);
    expect(rootResponse.body.data.documents.length).toBeGreaterThan(0);
    expect(rootResponse.body.data.filters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'manufacturer' }),
        expect.objectContaining({ name: 'priceI18n' }),
      ]),
    );

    const leafResponse = await request(app)
      .get(`${API}/categories/${TOURING_KAYAKS_CATEGORY_ID}/products`)
      .query({ language: 'en', currency: 'EUR', page: 1, limit: 8 })
      .expect(200);

    expect(leafResponse.body.status).toBe('success');
    expect(leafResponse.body.resultsTotal).toBeGreaterThan(0);
    expect(leafResponse.body.data.documents.length).toBeGreaterThan(0);
  });

  test('GET /categories/:id/products paginates root category products without duplicates', async () => {
    const collected = new Set();
    let page = 1;
    let pages = 1;

    do {
      const response = await request(app)
        .get(`${API}/categories/${BICYCLES_ROOT_CATEGORY_ID}/products`)
        .query({
          language: 'en',
          currency: 'EUR',
          page,
          limit: 8,
          sort: 'featureOrder',
        })
        .expect(200);

      if (page === 1) {
        pages = response.body.pages;
        expect(response.body.resultsTotal).toBeGreaterThan(8);
      }

      for (const document of response.body.data.documents) {
        expect(collected.has(document._id)).toBe(false);
        collected.add(document._id);
      }

      page += 1;
    } while (page <= pages);

    expect(collected.size).toBeGreaterThan(0);
  });

  test('GET /search without q returns an empty product list', async () => {
    const response = await request(app).get(`${API}/search`).expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.query).toBe('');
    expect(response.body.data.documents).toEqual([]);
    expect(response.body.resultsTotal).toBe(0);
  });

  test('GET /search?q=kayak finds products by name or category', async () => {
    const response = await request(app)
      .get(`${API}/search`)
      .query({ q: 'kayak', limit: 10 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.query).toBe('kayak');
    expect(response.body.resultsTotal).toBeGreaterThan(0);
    expect(response.body.data.documents.length).toBeGreaterThan(0);
  });

  test('GET /search?q=Cube finds products by manufacturer', async () => {
    const response = await request(app)
      .get(`${API}/search`)
      .query({ q: 'Cube', limit: 10 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBeGreaterThan(0);
    expect(
      response.body.data.documents.every(
        (product) => product.manufacturer === 'Cube',
      ),
    ).toBe(true);
  });

  test('GET /search rejects overly long queries', async () => {
    const response = await request(app)
      .get(`${API}/search`)
      .query({ q: 'a'.repeat(129) })
      .expect(400);

    expect(response.body.status).toBe('failed');
  });

  test('GET /badges returns seeded badges (public)', async () => {
    const response = await request(app).get(`${API}/badges`).expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.documents.length).toBeGreaterThanOrEqual(2);

    const codes = response.body.data.documents.map((badge) => badge.code);
    expect(codes).toEqual(expect.arrayContaining(['bestseller', 'new']));
  });

  test('GET /products/:id includes populated product badges', async () => {
    const response = await request(app)
      .get(`${API}/products/${SAMPLE_PRODUCT_ID}`)
      .expect(200);

    const product = response.body.data.document;

    expect(product.badges).toHaveLength(2);
    expect(product.badges[0].badge.code).toBe('bestseller');
    expect(product.badges[0].priority).toBe(1);
    expect(product.badges[0].badge.active).toBeUndefined();
    expect(product.badges[1].badge.code).toBe('new');
  });

  test('GET /products/:id includes category code on populated category', async () => {
    const response = await request(app)
      .get(`${API}/products/${GRAIL_PRODUCT_ID}`)
      .query({ language: 'en', currency: 'EUR' })
      .expect(200);

    expect(response.body.data.document.category.code).toBe(GRAVEL_BIKES_CATEGORY_CODE);
  });

  test('GET /products/:id/related returns same-category products excluding self', async () => {
    const response = await request(app)
      .get(`${API}/products/${GRAIL_PRODUCT_ID}/related`)
      .query({ language: 'en', currency: 'EUR', limit: 8 })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsFound).toBeGreaterThan(0);
    expect(response.body.data.documents.length).toBeGreaterThan(0);

    const ids = response.body.data.documents.map((product) => product._id);
    expect(ids).not.toContain(GRAIL_PRODUCT_ID);
    response.body.data.documents.forEach((product) => {
      expect(product.category.code).toBe(GRAVEL_BIKES_CATEGORY_CODE);
    });
  });

  test('GET /products/:id/related returns 404 for missing product', async () => {
    await request(app)
      .get(`${API}/products/507f1f77bcf86cd799439011/related`)
      .query({ language: 'en', currency: 'EUR' })
      .expect(404);
  });

  test('GET /users/:id/wishlists returns seeded wishlist for authenticated user', async () => {
    const response = await request(app)
      .get(`${API}/users/${TEST_USER.id}/wishlists`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBe(1);
    expect(response.body.data.documents[0]._id).toBe(ALEX_WISHLIST_ID);
    expect(response.body.data.documents[0].name).toBe('Wishlist');
  });

  test('GET /users/:id/wishlists/:wishlistId/entries returns seeded products', async () => {
    const response = await request(app)
      .get(`${API}/users/${TEST_USER.id}/wishlists/${ALEX_WISHLIST_ID}/entries`)
      .set('Authorization', `Bearer ${authToken}`)
      .query({ language: 'en', currency: 'EUR', sort: '-createdAt' })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.resultsTotal).toBe(3);

    const productIds = response.body.data.documents.map((entry) =>
      typeof entry.product === 'string' ? entry.product : entry.product._id,
    );
    expect(productIds).toEqual(
      expect.arrayContaining([GRAIL_PRODUCT_ID, SAMPLE_PRODUCT_ID]),
    );
  });

  test('POST /users/:id/wishlists/:wishlistId/entries rejects duplicate product', async () => {
    const response = await request(app)
      .post(`${API}/users/${TEST_USER.id}/wishlists/${ALEX_WISHLIST_ID}/entries`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ product: GRAIL_PRODUCT_ID })
      .expect(409);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/already in the wishlist/i);
  });

  test('POST /users/:id/wishlists rejects second wishlist for same user', async () => {
    const response = await request(app)
      .post(`${API}/users/${TEST_USER.id}/wishlists`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Another list' })
      .expect(400);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/one wishlist is allowed per user/i);
  });

  test('POST /badges without token returns 401', async () => {
    const response = await request(app)
      .post(`${API}/badges`)
      .send({
        code: 'test-badge',
        nameI18n: { en: 'Test', de: 'Test' },
        style: 'neutral',
        active: true,
      })
      .expect(401);

    expect(response.body.status).toBe('failed');
  });

  test('DELETE /badges/:id returns 409 when badge is assigned to products', async () => {
    const loginResponse = await request(app)
      .post(`${API}/users/login`)
      .send({
        email: ADMIN_USER.email,
        password: ADMIN_USER.password,
      })
      .expect(200);

    adminToken = loginResponse.body.token;

    const response = await request(app)
      .delete(`${API}/badges/${BESTSELLER_BADGE_ID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/assigned to/i);
  });

  test('unknown route returns 404', async () => {
    const response = await request(app)
      .get(`${API}/this-route-does-not-exist`)
      .expect(404);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/can't find/i);
  });
});
