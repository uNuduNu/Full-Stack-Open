import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'
import { setUser } from './userReducer'

const initialState = []

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        addBlog(state, action) {
            state.push(action.payload)
        },
        changeBlog(state, action) {
            const changedBlog = action.payload
            return state.map(b => b.id !== changedBlog.id ? b : changedBlog)
        },
        setBlogs(state, action) {
            return action.payload
        },
        deleteBlog(state, action) {
            const blogToRemoveId = action.payload
            return state.filter(b => b.id !== blogToRemoveId)
        }
    }
})

export const initializeBlogs = () => {
    return async dispatch => {
        try {
            const blogs = await blogService.getAllBlogs()
            dispatch(setBlogs(blogs))
        }
        catch(error) {
            if (error.response.data.error.includes('jwt') || error.response.data.error.includes('token expired')) {
                dispatch(
                    setNotification(['wrong credentials', error.message])
                )
                setUser('')
                blogService.setToken(undefined)
            } else {
                dispatch(
                    setNotification([
                        'failed to modify blog',
                        error.message
                    ])
                )
            }
        }
    }
}

export const createBlog = content => {
    return async dispatch => {
        try {
            const newBlog = await blogService.addBlog(content)
            dispatch(addBlog(newBlog))
        }
        catch(error) {
            if (error.response.data.error.includes('jwt') || error.response.data.error.includes('token expired')) {
                dispatch(
                    setNotification(['wrong credentials', error.message])
                )
                setUser('')
                blogService.setToken(undefined)
            } else {
                dispatch(
                    setNotification([
                        'failed to modify blog',
                        error.message
                    ])
                )
            }
        }
    }
}

export const addLike = blogToLike => {
    const addedLike = { ...blogToLike, likes: blogToLike.likes }

    return async dispatch => {
        try {
            const modifiedBlog = await blogService.modifyBlog(addedLike)
            dispatch(changeBlog(modifiedBlog))
        }
        catch(error) {
            if (error.response.data.error.includes('jwt') || error.response.data.error.includes('token expired')) {
                dispatch(
                    setNotification(['wrong credentials', error.message])
                )
                setUser('')
                blogService.setToken(undefined)
            } else {
                dispatch(
                    setNotification([
                        'failed to modify blog',
                        error.message
                    ])
                )
            }
        }
    }
}

export const removeBlog = blogToRemoveId => {
    return async dispatch => {

        try {
            await blogService.removeBlog(blogToRemoveId)
            dispatch(deleteBlog(blogToRemoveId))
        }
        catch(error) {
            if (error.response.data.error.includes('jwt') || error.response.data.error.includes('token expired')) {
                dispatch(
                    setNotification(['wrong credentials', error.message])
                )
                setUser('')
                blogService.setToken(undefined)
            } else {
                dispatch(
                    setNotification([
                        'failed to modify blog',
                        error.message
                    ])
                )
            }
        }
    }
}

export const { addBlog, changeBlog, setBlogs, deleteBlog } = blogSlice.actions
export default blogSlice.reducer