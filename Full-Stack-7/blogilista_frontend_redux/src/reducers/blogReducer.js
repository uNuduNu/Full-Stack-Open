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
        setComment(state, action){
            const id = action.payload.id
            const comment = { id: action.payload.commentID, body: action.payload.comment }
            const blogToModify = JSON.parse(JSON.stringify(state.find(b => b.id === id)))

            if (blogToModify.comments === undefined) {
                blogToModify.comments = []
            }

            blogToModify.comments.push(comment)

            return state.map(b => b.id !== id ? b : blogToModify)
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

export const addComment = (blogId, comment) => {
    return async dispatch => {
        try {
            const response = await blogService.addComment(blogId, comment)
            dispatch(setComment({ id: blogId, commentID: response._id, comment: comment }))
        } catch (error) {
            console.log(error)
            dispatch(
                setNotification([
                    'failed to add comment',
                    error.message
                ])
            )
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

export const { addBlog, setComment, changeBlog, setBlogs, deleteBlog } = blogSlice.actions
export default blogSlice.reducer