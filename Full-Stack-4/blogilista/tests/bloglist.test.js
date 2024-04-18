const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')

const api = supertest(app)

describe('API / integration tests for blogs', () => {

    beforeEach(async () => {
        await helper.setupDB()
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs id field is id', async () => {
        const response = await api.get('/api/blogs')

        const ids = response.body.map(e => e.id)
        assert(ids.length === 2)
    })

    test('the first blog is about HTTP methods', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(e => e.title)
        assert(titles.includes('HTTP Methods'))
    })

    describe('adding blogs', async () => {
        test('succeeds with 201 valid data', async () => {
            const userToken = await helper.loginToDB()

            const newBlog = {
                title: 'A Valid Blog',
                author: 'EM M',
                url: 'www.validatorship.com',
                likes: '4563'
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfterPost = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)

            const titles = blogsAfterPost.map(b => b.title)
            assert(titles.includes('A Valid Blog'))
        })

        test('fails with 400 if title is missing', async () => {
            const userToken = await helper.loginToDB()

            const newBlog = {
                author: 'E M',
                url: 'a.valid.url',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)

            const blogsAfterPost = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
        })

        test('fails with 400 if url is missing', async () => {
            const userToken = await helper.loginToDB()

            const newBlog = {
                title: 'A Valid Blog',
                author: 'E M',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400)

            const blogsAfterPost = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
        })

        test('fails with 401 if token is missing', async () => {
            const newBlog = {
                title: 'A Valid Blog',
                author: 'E M',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsAfterPost = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
        })

        test('fails with 400 if token is not valid', async () => {
            const newBlog = {
                title: 'A Valid Blog',
                author: 'E M',
                likes: 2
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', 'Bearer notvalid')
                .expect(400)

            const blogsAfterPost = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length)
        })

        test('if no likes is given, it defaults to 0', async () => {
            const userToken = await helper.loginToDB()

            const newBlog = {
                title: 'A Valid Blog',
                author: undefined,
                url: 'a.valid.url',
                likes: undefined
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert(response.body.likes === 0)
        })
    })

    describe('deleting blogs', () => {
        test('blog is removed with 204 if it exists and is created by this user', async () => {
            let userToken = undefined
            userToken = await helper.loginToDB()

            const blogsAtStart = await helper.BlogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204)

            const blogsAfterDelete = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterDelete.length, blogsAtStart.length - 1)

            const ids = blogsAfterDelete.map(b => b.id)
            assert(!ids.includes(blogToDelete.id))
        })
    })

    describe('modifying blogs', () => {
        test('modifying existing blog succeeds with 20', async () => {
            const blogsAtStart = await helper.BlogsInDb()
            let blogToModify = blogsAtStart[0]

            blogToModify.likes += 10

            await api
                .put(`/api/blogs/${blogToModify.id}`)
                .send(blogToModify)
                .expect(201)

            const blogsAfterModify = await helper.BlogsInDb()

            assert.strictEqual(blogsAfterModify.length, blogsAtStart.length)
            assert.strictEqual(blogsAfterModify[0].id, blogToModify.id)
            assert.strictEqual(blogsAfterModify[0].likes, blogToModify.likes)
        })

        test('modifying nonexisting blog fails with 404', async () => {
            const nonexistingId = await helper.nonExistingId()

            const nonExistingBlog = {
                title: 'A Valid Blog',
                author: undefined,
                url: 'a.valid.url',
                likes: undefined,
                id: nonexistingId
            }

            await api
                .put(`/api/blogs/${nonExistingBlog.id}`)
                .send(nonExistingBlog)
                .expect(404)

            const blogsAfterModify = await helper.BlogsInDb()

            const ids = blogsAfterModify.map(b => b.id)
            assert(!ids.includes(nonexistingId))
        })
    })

    after(async () => {
        await helper.closeDB()
    })
})
