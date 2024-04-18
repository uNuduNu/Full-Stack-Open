import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogReducer from './blogReducer'
import userReducer from './userReducer'

const blogStore = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
        loggedUser: userReducer
    }
})

export default blogStore