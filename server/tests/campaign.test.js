const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/whatsapp_tool_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Campaign API', () => {
  it('should create a new campaign', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .send({ name: 'Test Campaign', message: 'Hello from the campaign' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Campaign');
  });
});
