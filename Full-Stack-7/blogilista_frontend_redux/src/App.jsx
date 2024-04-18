import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogsHeader from './components/BlogsHeader'
import AddBlog from './components/AddBlog'
import StatusMessage from './components/StatusMessage'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
    const dispatch = useDispatch()

    const user = useSelector(({ loggedUser, blogs }) => {
        return loggedUser
    })

    useEffect(() => {
        dispatch(initializeBlogs())
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

    const addBlogToggleForm = useRef()
    const addBlogForm = useRef()

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

    const createNewBlog = (newBlog) => {
        dispatch(createBlog(newBlog))

        addBlogToggleForm.current.toggleVisibility()
        dispatch(setNotification(['blog added']))
    }

    const cancelAddBlog = () => {
        addBlogForm.current.resetBlog()
    }

    if (user === '') {
        return (
            <div style={mainStyle}>
                <StatusMessage />
                <LoginForm
                    loginHandler={loginHandler}
                    username={username}
                    usernameHandler={usernameHandler}
                    password={password}
                    passwordHandler={passwordHandler}
                />
            </div>
        )
    }

    return (
        <div style={mainStyle}>
            <BlogsHeader username={user} logoutHandler={logoutHandler} />
            <StatusMessage />
            <Togglable
                buttonLabel="add blog"
                cancelHandler={cancelAddBlog}
                ref={addBlogToggleForm}
            >
                <AddBlog createBlog={createNewBlog} ref={addBlogForm} />
            </Togglable>
            <h2>Blogs</h2>
            <BlogList loggedUser={user.username} />
        </div>
    )
}

export default App
