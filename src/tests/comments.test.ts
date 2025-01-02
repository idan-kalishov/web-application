import request from 'supertest';
import mongoose from 'mongoose';
import initApp  from '../index'; 
import CommentModel from '../models/commentsModel';
import Post from '../models/Post';
import { Application } from 'express';

const mockPostId = new mongoose.Types.ObjectId();
let app: Application;  

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Comments Controller Tests', () => {
  afterEach(async () => {
    await CommentModel.deleteMany();
    await Post.deleteMany();
  });

  test('GET /comments - should return all comments', async () => {
    await CommentModel.create({
      user: 'John Doe',
      message: 'This is a test comment',
      postId: mockPostId,
    });

    const response = await request(app).get('/comments');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].user).toBe('John Doe');
  });

  test('GET /comments/:comment_id - should return a comment by ID', async () => {
    const comment = await CommentModel.create({
      user: 'Jane Doe',
      message: 'Another test comment',
      postId: mockPostId,
    });

    const response = await request(app).get(`/comments/${comment._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Another test comment');
  });

  test('POST /comments - should create a new comment', async () => {
    await Post.create({
      _id: mockPostId,
      title: 'Test Post',
      content: 'This is a test post',
      owner: 'User123',
    });
  
    const newComment = {
      user: 'John Doe',
      message: 'This is a new comment',
      postId: mockPostId,
    };
  
    const response = await request(app).post('/comments').send(newComment);
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('This is a new comment');
  
    const updatedPost = await Post.findById(mockPostId);
  
    console.log('Updated Post Comments:', updatedPost?.comments);
    console.log('Response Body ID:', response.body._id);
  
    expect(updatedPost?.comments.map(String)).toContain(response.body._id);
});
  

  test('PUT /comments/:comment_id - should update a comment by ID', async () => {
    const comment = await CommentModel.create({
      user: 'Jane Doe',
      message: 'Old comment message',
      postId: mockPostId,
    });

    const updatedData = {
      message: 'Updated comment message',
    };

    const response = await request(app).put(`/comments/${comment._id}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Updated comment message');
  });

  test('DELETE /comments/:comment_id - should delete a comment by ID', async () => {
    const post = await Post.create({
        _id: mockPostId,
        title: 'Test Post',
        content: 'This is a test post',
        owner: 'User123',
    });

    const comment = await CommentModel.create({
      user: 'Jane Doe',
      message: 'Comment to delete',
      postId: mockPostId,
    });

    const response = await request(app).delete(`/comments/${comment._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Comment deleted successfully');

    const updatedPost = await Post.findById(mockPostId);
    expect(updatedPost).not.toBeNull();  
    expect(updatedPost?.comments).not.toContain(comment._id);  
});

});
