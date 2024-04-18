const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')

const api = supertest(app)

describe('API tests for users with one user in the db', () => {
    beforeEach(async () => {
        await helper.setupDB()
    })

    test('user creation succeeds if username and password are valid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = { username: 'testUser', name: 'Etu Suku', password: 'onsevain' }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('user creation fails if username is not unique', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({ username:'username', name:'user', password: 'password' })

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('expected `username` to be unique'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails if username is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({ name:'user', password: 'password' })

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('`username` must exist and contain atleast 3 characters'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails if username is less than 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({ username:'us', name:'user', password: 'password' })

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('`username` must exist and contain atleast 3 characters'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails if password is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({ username:'username2', name:'user' })

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('password must exist and contain atleast 3 characters'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails if password is less than 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({ username:'username2', name:'user', password: 'pa' })

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('password must exist and contain atleast 3 characters'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    after(async () => {
        await helper.closeDB()
    })
})

