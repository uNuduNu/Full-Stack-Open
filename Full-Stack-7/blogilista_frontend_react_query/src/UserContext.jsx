import { useContext } from 'react'
import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
    switch (action.type) {
    case 'SET':
        return action.payload
    case 'RESET':
        return undefined
    default:
        return state
    }
}

const UserContext = createContext()

export const useUserValue = () => {
    const userAndDispatch = useContext(UserContext)
    return userAndDispatch[0]
}

export const useUserDispatch = () => {
    const userAndDispatch = useContext(UserContext)
    return userAndDispatch[1]
}

export const UserContextProvider = (props) => {
    const [user, userDispatch] = useReducer(
        userReducer,
        undefined
    )

    return (
        <UserContext.Provider
            value={[user, userDispatch]}
        >
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext
