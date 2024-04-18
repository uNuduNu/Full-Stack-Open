const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'HTTP Methods',
        author: 'Bill Cosby',
        url: 'www.hmcosby.com',
        likes: '45',
        user: ''
    },
    {
        title: 'Other Methods',
        author: 'Ted Bundy',
        url: 'www.comeonnow.com',
        likes: '45643',
        user: ''
    }
]

const setupDB = async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)

    const user = new User({
        username: 'username',
        name: 'user',
        passwordHash: passwordHash,
        'blogs':[]
    })

    await user.save()

    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))

    blogObjects.forEach(b => { b.user = user._id })

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    user.blogs = user.blogs.concat(blogObjects.map(blog => blog._id))

    await user.save()

    return user._id
}

const loginToDB = async () => {
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
    return credentials.token
}

const closeDB = async () => {
    await mongoose.connection.close()
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', url: 'remove' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const BlogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = { setupDB, loginToDB, closeDB, initialBlogs, nonExistingId, BlogsInDb, usersInDb }