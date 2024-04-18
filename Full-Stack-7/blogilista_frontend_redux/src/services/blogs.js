import axios from 'axios'

const baseUrl = '/api/blogs'

let token = undefined

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAllBlogs = () => {
    const promise = axios.get(baseUrl)
    return promise.then((response) => response.data)
}

const getBlog = (id) => {
    const promise = axios.get(`${baseUrl}/${id}`)
    return promise.then((response) => response.data)
}
const addBlog = (blog) => {
    const config = {
        headers: { Authorization: token }
    }
    const promise = axios.post(baseUrl, blog, config)
    return promise.then((response) => response.data)
}

const removeBlog = (id) => {
    const config = {
        headers: { Authorization: token }
    }

    const promise = axios.delete(`${baseUrl}/${id}`, config)
    return promise.then((response) => response.data)
}

const modifyBlog = (blog) => {
    const promise = axios.put(`${baseUrl}/${blog.id}`, blog)
    return promise.then((response) => response.data)
}

export default {
    setToken,
    getAllBlogs,
    getBlog,
    addBlog,
    removeBlog,
    modifyBlog
}
