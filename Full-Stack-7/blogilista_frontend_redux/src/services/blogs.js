import axios from 'axios'

const baseUrl = '/api/blogs'

let token = undefined

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAllBlogs = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getBlog = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}
const addBlog = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, blog, config)
    return response.data
}

const removeBlog = async (id) => {
    const config = {
        headers: { Authorization: token }
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

const modifyBlog = async (blog) => {
    const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
    return response.data
}

export default {
    setToken,
    getAllBlogs,
    getBlog,
    addBlog,
    removeBlog,
    modifyBlog
}
