import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import { app } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Issue } from '../src/models/Issue.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.JWT_SECRET = 'test-secret';
  await mongoose.connect(mongo.getUri());
}, 300000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Issue.deleteMany({});
});

describe('Authentication', () => {
  it('POST /register returns JWT', async () => {
    const res = await request(app).post('/register').send({
      name: 'Test',
      email: 't@example.com',
      password: 'secret123',
      role: 'citizen',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('t@example.com');
  });

  it('POST /login returns token', async () => {
    await User.create({
      name: 'A',
      email: 'a@x.com',
      password: await bcrypt.hash('pw', 10),
      role: 'citizen',
    });
    const res = await request(app).post('/login').send({
      email: 'a@x.com',
      password: 'pw',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

async function authHeader(role = 'citizen') {
  const password = await bcrypt.hash('pw', 10);
  const email = role === 'admin' ? 'admin@test.com' : 'cit@test.com';
  const u = await User.create({
    name: 'U',
    email,
    password,
    role,
  });
  const login = await request(app).post('/login').send({ email, password: 'pw' });
  return { Authorization: `Bearer ${login.body.token}`, userId: u._id.toString() };
}

describe('Issues & RBAC', () => {
  it('citizen GET /issues sees only own', async () => {
    const h = await authHeader('citizen');
    const other = await User.create({
      name: 'O',
      email: 'o@test.com',
      password: await bcrypt.hash('p', 10),
      role: 'citizen',
    });
    await Issue.create({
      title: 'x',
      description: 'd',
      image: 'http://x/img.jpg',
      location: { latitude: 1, longitude: 2 },
      createdBy: other._id,
      statusHistory: [{ status: 'pending', at: new Date(), by: other._id }],
    });
    const mine = await Issue.create({
      title: 'mine',
      description: 'd',
      image: 'http://x/img2.jpg',
      location: { latitude: 1, longitude: 2 },
      createdBy: h.userId,
      statusHistory: [{ status: 'pending', at: new Date(), by: h.userId }],
    });
    const res = await request(app).get('/issues').set(h);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].issueId).toBe(mine.issueId);
  });

  it('admin GET /issues sees all', async () => {
    await authHeader('citizen');
    const admin = await authHeader('admin');
    const cit = await User.findOne({ email: 'cit@test.com' });
    await Issue.create({
      title: 'a',
      description: 'd',
      image: 'http://x/i.jpg',
      location: { latitude: 0, longitude: 0 },
      createdBy: cit._id,
      statusHistory: [{ status: 'pending', at: new Date(), by: cit._id }],
    });
    const res = await request(app).get('/issues').set(admin);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
