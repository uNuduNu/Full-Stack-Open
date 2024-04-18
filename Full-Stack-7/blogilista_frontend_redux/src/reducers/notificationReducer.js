import { createSlice } from '@reduxjs/toolkit'

const initialState = ['', undefined]

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationState(state, action) {
            return action.payload
        }
    }
})

export const setNotification = (content) => {
    return async dispatch => {
        if (content[1] !== undefined) {
            console.log(content[1])
        }

        dispatch(setNotificationState(content))

        setTimeout(() => {
            dispatch(setNotificationState(initialState))
        }, 3000)
    }
}

export const { setNotificationState } = notificationSlice.actions
export default notificationSlice.reducer