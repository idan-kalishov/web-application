import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import initApp from '../index';
import Post from '../models/Post';

describe('Post Controller Tests', () => {
  let mockPostId: string = '';

  let app: Application;

  beforeAll(async () => {
    app = await initApp();
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    // Clear the database before each test
    await Post.deleteMany({});

    // Create a mock post for tests
    const post = await Post.create({
      title: 'Mock Post',
      content: 'This is a mock post.',
      owner: 'User123',
    });
    mockPostId = post._id as any;
  });

  afterEach(async () => {
    // Clean up after tests
    await Post.deleteMany({});
  });

  test('POST /posts - should create a new post', async () => {
    const newPost = {
      title: 'New Post',
      content: 'This is a new post.',
      owner: 'User456',
    };

    const response = await request(app).post('/posts').send(newPost);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.owner).toBe(newPost.owner);
  });

  test('GET /posts - should fetch all posts', async () => {
    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /posts/:post_id - should fetch a post by ID', async () => {
    const response = await request(app).get(`/posts/${mockPostId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(mockPostId.toString());
  });

  test('GET /posts?sender=:sender - should fetch posts by sender', async () => {
    const response = await request(app).get('/posts?sender=User123');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].owner).toBe('User123');
  });

  test('PUT /posts/:post_id - should update a post', async () => {
    const updatedData = {
      title: 'Updated Post',
      content: 'This is an updated post.',
    };

    const response = await request(app).put(`/posts/${mockPostId}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.content).toBe(updatedData.content);
  });

  test('DELETE /posts/:post_id - should delete a post', async () => {
    const response = await request(app).delete(`/posts/${mockPostId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted successfully.');

    const deletedPost = await Post.findById(mockPostId);
    expect(deletedPost).toBeNull();
  });
});
