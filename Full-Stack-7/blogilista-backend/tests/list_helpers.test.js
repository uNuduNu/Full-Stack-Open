const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithManyBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

describe('Unit tests', () => {

    describe('total likes', () => {
        test('when list has only one blog equals the likes of that', () => {
            assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
        })

        test('when list has many blogs equals the likes of those', () => {
            assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 36)
        })

        test('list is empty', () => {
            assert.strictEqual(listHelper.totalLikes([]), 0)
        })

        test('list is undefined', () => {
            assert.strictEqual(listHelper.totalLikes(), 0)
        })
    })

    describe('favorite blogs', () => {
        test('when list has only one blog equals that', () => {
            const expected =
            {
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                likes: 5
            }

            const result = listHelper.favoriteBlog(listWithOneBlog)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.likes, expected.likes)
            assert.strictEqual(result.title, expected.title)
        })

        test('when list has many blogs equals the one with most likes', () => {
            const expected = {
                author: 'Edsger W. Dijkstra',
                likes: 12,
                title: 'Canonical string reduction'
            }

            const result = listHelper.favoriteBlog(listWithManyBlogs)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.likes, expected.likes)
            assert.strictEqual(result.title, expected.title)
        })

        test('list is empty', () => {
            assert.strictEqual(listHelper.favoriteBlog([]), undefined)
        })

        test('list is undefined', () => {
            assert.strictEqual(listHelper.favoriteBlog(), undefined)
        })
    })

    describe('most blogs', () => {
        test('when list has only one blog equals that', () => {
            const expected =
            {
                author: 'Edsger W. Dijkstra',
                blogs: 1
            }

            const result = listHelper.mostBlogs(listWithOneBlog)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.blogs, expected.blogs)
        })

        test('when list has many blogs equals the author with most', () => {
            const expected = {
                author: 'Robert C. Martin',
                blogs: 3
            }

            const result = listHelper.mostBlogs(listWithManyBlogs)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.blogs, expected.blogs)
        })

        test('list is empty', () => {
            assert.strictEqual(listHelper.mostBlogs([]), undefined)
        })

        test('list is undefined', () => {
            assert.strictEqual(listHelper.mostBlogs(), undefined)
        })
    })

    describe('most likes', () => {
        test('when list has only one blog equals of that', () => {
            const expected =
            {
                author: 'Edsger W. Dijkstra',
                likes: 5
            }

            const result = listHelper.mostLikes(listWithOneBlog)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.likes, expected.likes)
        })

        test('when list has many blogs equals the author with most likes', () => {
            const expected = {
                author: 'Edsger W. Dijkstra',
                likes: 17
            }

            const result = listHelper.mostLikes(listWithManyBlogs)

            assert.strictEqual(result.author, expected.author)
            assert.strictEqual(result.likes, expected.likes)
        })

        test('list is empty', () => {
            assert.strictEqual(listHelper.mostLikes([]), undefined)
        })

        test('list is undefined', () => {
            assert.strictEqual(listHelper.mostLikes(), undefined)
        })
    })
})
