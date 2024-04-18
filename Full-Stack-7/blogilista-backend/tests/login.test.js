const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')

const api = supertest(app)

describe('Login tests', () => {

    beforeEach(async () => {
        await helper.setupDB()
    })

    test('login succeeds with valid username and password and token is received', async () => {
        const loginInfo = {
            username: 'username',
            password: 'secret',
        }

        const response = await api
            .post('/api/login')
            .send(loginInfo)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const credentials = response.body
        assert.strictEqual(loginInfo.username, credentials.username)
        assert(credentials.token !== undefined)
    })

    test('login fails with invalid username', async () => {
        const loginInfo = {
            username: 'usrname',
            password: 'secret',
        }

        await api
            .post('/api/login')
            .send(loginInfo)
            .expect(401)
    })

    test('login fails with invalid password', async () => {
        const loginInfo = {
            username: 'username',
            password: 'scret',
        }

        await api
            .post('/api/login')
            .send(loginInfo)
            .expect(401)
    })

    after(async () => {
        await helper.closeDB()
    })
})
