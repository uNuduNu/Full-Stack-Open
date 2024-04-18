const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs === undefined){
        return 0
    }

    let sum = 0
    blogs.forEach(blog => {
        sum += blog.likes
    })

    return sum
}

const favoriteBlog = (blogs) => {
    if (blogs === undefined || blogs.length === 0){
        return undefined
    }

    let favorite = undefined

    blogs.forEach(blog => {
        if (favorite === undefined || favorite.likes < blog.likes){
            favorite = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })

    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs === undefined || blogs.length === 0){
        return undefined
    }

    let blogsByAuthor = new Map()

    blogs.forEach( blog => {
        blogsByAuthor.set(blog.author, blogsByAuthor.get(blog.author) === undefined ? 1 : blogsByAuthor.get(blog.author) + 1)
    })

    let mostBlogsAuthor = undefined
    for (const blog of blogsByAuthor) {
        if (mostBlogsAuthor === undefined || mostBlogsAuthor.blogs < blog[1]){
            mostBlogsAuthor = {
                author: blog[0],
                blogs: blog[1]
            }
        }
    }

    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    if (blogs === undefined || blogs.length === 0){
        return undefined
    }

    let blogsByAuthor = new Map()

    blogs.forEach( blog => {
        blogsByAuthor.set(blog.author, blogsByAuthor.get(blog.author) === undefined ? blog.likes : blogsByAuthor.get(blog.author) + blog.likes)
    })

    let mostLikesAuthor = undefined
    for (const blog of blogsByAuthor) {
        if (mostLikesAuthor === undefined || mostLikesAuthor.likes < blog[1]){
            mostLikesAuthor = {
                author: blog[0],
                likes: blog[1]
            }
        }
    }

    return mostLikesAuthor
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}