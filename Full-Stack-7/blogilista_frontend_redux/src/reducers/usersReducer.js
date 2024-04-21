import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'
import { setNotification } from './notificationReducer'

const initialState = []

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action) {
            return action.payload
        }
    }
})

export const initializeUsers = () => {
    return async dispatch => {
        try {
            const users = await usersService.getAllUsers()
            dispatch(setUsers(users))
        }
        catch(error) {
            dispatch(
                setNotification([
                    'Failed to retrieve users',
                    error.message
                ])
            )
        }
    }
}

export const { setUsers, deleteBlog } = usersSlice.actions
export default usersSlice.reducer
