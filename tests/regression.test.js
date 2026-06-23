const request = require('supertest');
const app = require('../app');

const API = '/api/v1';

const TEST_USER = {
  email: 'alex.chen@explorernet.net',
  password: 'test1234',
  id: '66237f6401706e88a6f9a5e3',
};

const SAMPLE_PRODUCT_ID = '5c88fa8cf4afda39709c2955';

describe('Campfire Store API regression suite', () => {
  let authToken;

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

  test('unknown route returns 404', async () => {
    const response = await request(app)
      .get(`${API}/this-route-does-not-exist`)
      .expect(404);

    expect(response.body.status).toBe('failed');
    expect(response.body.message).toMatch(/can't find/i);
  });
});
