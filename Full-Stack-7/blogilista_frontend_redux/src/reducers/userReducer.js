import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const userSlice = createSlice({
    name: 'loggedUser',
    initialState,
    reducers: {
        setLoggedUser(state, action) {
            return action.payload
        }
    }
})

export const setUser = (content) => {
    return async dispatch => {
        dispatch(setLoggedUser(content))
    }
}

export const { setLoggedUser } = userSlice.actions
export default userSlice.reducer