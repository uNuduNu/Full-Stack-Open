import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationText(state, action) {
            return action.payload
        }
    }
})


export const setNotification = (content, timeout) => {
    return async dispatch => {
        dispatch(setNotificationText(content))

        setTimeout(() => {
            dispatch(setNotificationText(``))
        }, timeout * 1000)
    }
}


export const { setNotificationText } = notificationSlice.actions
export default notificationSlice.reducer