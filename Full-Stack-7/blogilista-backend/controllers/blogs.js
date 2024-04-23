const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!request.userId) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(request.userId)

    if (user === undefined) {
        return response.status(400).json({ error: 'user not found' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const addedBlog = await blog.save()
    await addedBlog.populate('user', { username: 1, name: 1 })

    user.blogs = user.blogs.concat(addedBlog._id)
    await user.save()

    response.status(201).json(addedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const body = request.body

    const blog = await Blog.findById(request.params.id)

    if (blog === undefined) {
        return response.status(400).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments.concat({ body: body.comment })

    await blog.save()

    response.status(201).json(blog.comments[blog.comments.length - 1])
})

blogsRouter.delete('/:id', async (request, response) => {

    if (!request.userId) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(request.userId)

    if (user === undefined) {
        return response.status(400).json({ error: 'user not found' })
    }

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === request.userId.toString()) {
        await Blog.findByIdAndDelete(request.params.id)

        user.blogs = user.blogs.filter(b => b !== request.params.id)
        await user.save()
    } else {
        return response.status(401).json({ error: 'added by another user' })
    }

    response.status(200).json({ id: request.params.id })
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        id: body.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' }).populate('user', { username: 1, name: 1 })
    if (updatedBlog === null) {
        response.status(404).end()
    }
    else
    {
        response.status(201).json(updatedBlog)
    }
})

module.exports = blogsRouter