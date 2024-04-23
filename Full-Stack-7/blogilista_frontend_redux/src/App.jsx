import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogsHeader from './components/BlogsHeader'
import StatusMessage from './components/StatusMessage'
import BlogView from './components/BlogView'
import Blog from './components/Blog'
import UserView from './components/UserView'
import UserDetails from './components/UserDetails'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'
import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'

const App = () => {
    const dispatch = useDispatch()

    const user = useSelector(({ loggedUser }) => {
        return loggedUser
    })

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])

    useEffect(() => {
        dispatch(initializeUsers())
    }, [])

    const userStorageKey = 'blogUser'

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem(userStorageKey)

        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            dispatch(setUser(loggedUser.username))
            blogService.setToken(loggedUser.token)
        }
    }, [])

    const mainStyle = { margins: 0, padding: 0 }

    const logoutHandler = () => {
        window.localStorage.removeItem(userStorageKey)
        dispatch(setUser(''))
        blogService.setToken(undefined)
    }

    const loginHandler = async (event) => {
        event.preventDefault()

        try {
            const loggedUser = await loginService.login({ username, password })

            window.localStorage.setItem(
                userStorageKey,
                JSON.stringify(loggedUser)
            )

            dispatch(setUser(loggedUser.username))
            blogService.setToken(loggedUser.token)
            setUsername('')
            setPassword('')
        } catch (exception) {
            dispatch(setNotification(['wrong credentials']))

            return
        }

        dispatch(setNotification(['logged in']))
    }

    const usernameHandler = ({ target }) => {
        setUsername(target.value)
    }

    const passwordHandler = ({ target }) => {
        setPassword(target.value)
    }

    if (user === '') {
        return (
            <Container>
                <StatusMessage />
                <LoginForm
                    loginHandler={loginHandler}
                    username={username}
                    usernameHandler={usernameHandler}
                    password={password}
                    passwordHandler={passwordHandler}
                />
            </Container>
        )
    }

    return (
        <Container>
            <BlogsHeader username={user} logoutHandler={logoutHandler} />
            <StatusMessage />
            <Routes>
                <Route path="/" element={<BlogView />} />
                <Route path="/blogs/:id" element={<Blog />} />
                <Route path="/users" element={<UserView />} />
                <Route path="/users/:id" element={<UserDetails />} />
            </Routes>
        </Container>
    )
}

export default App
