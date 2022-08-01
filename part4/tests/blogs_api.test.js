const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
});

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
});

test('a valid blog can be added', async () => {
    const newBlog = {
        id: "62e5401f0897005bfd48cf4a",
        title: "Test Title",
        author: "Pulcinella",
        url: "http://ThisIsAFakeURL.com",
        likes: 9999,
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs');
    const responseMap = response.body.map(res => res) 

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(responseMap).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                title: "Test Title",
                author: "Pulcinella",
                url: "http://ThisIsAFakeURL.com",
                likes: 9999,
            })
        ])
    );
})

test('_id is returned as id', async () => {
    const response = await api.get('/api/blogs')
    for (let blog of response.body) {
        expect(blog.id).toBeDefined();
    };
});

test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0];
    
    await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map(blog => blog)
    expect(contents).not.toEqual(blogToDelete);
})

test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
        id: blogToUpdate.id,
        title: "Modified Title",
        author: "Arlecchino",
        url: "http://ThisIsATrueURL.com",
        likes: 7777,
    };


    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
        expect(blogsAtEnd[0]).toEqual(updatedBlog);
});

afterAll(() => {
  mongoose.connection.close()
})
