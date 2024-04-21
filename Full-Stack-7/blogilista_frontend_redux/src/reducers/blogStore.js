import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogReducer from './blogReducer'
import userReducer from './userReducer'
import usersReducer from './usersReducer'

const blogStore = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
        loggedUser: userReducer,
        users: usersReducer
    }
})

export default blogStore