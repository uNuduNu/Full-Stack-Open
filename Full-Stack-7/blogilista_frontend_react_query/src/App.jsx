import { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogsHeader from './components/BlogsHeader'
import AddBlog from './components/AddBlog'
import StatusMessage from './components/StatusMessage'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import { useUserValue, useUserDispatch } from './UserContext'

function App() {
    const userStorageKey = 'blogUser'

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const addBlogToggleForm = useRef()
    const addBlogForm = useRef()

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAllBlogs
    })

    const blogs = result.data

    const queryClient = useQueryClient()

    const changeBlogMutation = useMutation({
        mutationFn: blogService.modifyBlog,
        onSuccess: (changedBlog) => {
            const qBlogs = queryClient.getQueryData(['blogs'])
            queryClient.setQueryData(
                ['blogs'],
                qBlogs.map((b) => (b.id === changedBlog.id ? changedBlog : b))
            )

            showMessage(`Liked ${changedBlog.title}`)
        },
        onError: (error) => showMessage('Failed to modify blog', error)
    })

    const removeBlogMutation = useMutation({
        mutationFn: blogService.removeBlog,
        onSuccess: (id) => {
            const qBlogs = queryClient.getQueryData(['blogs'])
            queryClient.setQueryData(
                ['blogs'],
                qBlogs.filter((b) => b.id !== id.id)
            )
            showMessage('Removed blog', undefined)
        },
        onError: (error) => showMessage('Failed to remove blog', error)
    })

    const addBlogMutation = useMutation({
        mutationFn: blogService.addBlog,
        onSuccess: (newBlog) => {
            const qBlogs = queryClient.getQueryData(['blogs'])
            queryClient.setQueryData(['blogs'], qBlogs.concat(newBlog))
            showMessage('blog added')
            addBlogToggleForm.current.toggleVisibility()
        },
        onError: (error) => showMessage('failed to add blog', error)
    })

    const modifyBlog = (updatedBlog) => {
        changeBlogMutation.mutate(updatedBlog)
    }

    const removeBlog = (title, id) => {
        if (false === window.confirm(`Delete ${title}?`)) {
            return
        }
        removeBlogMutation.mutate(id)
    }

    const createBlog = (newBlog) => {
        addBlogMutation.mutate(newBlog)
    }

    const dispatch = useNotificationDispatch()
    const userDispatch = useUserDispatch()

    const user = useUserValue()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem(userStorageKey)

        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            userDispatch({ type: 'SET', payload: loggedUser })
            blogService.setToken(loggedUser.token)
        }
    }, [])

    const mainStyle = { margins: 0, padding: 0 }

    const showMessage = (text, error) => {
        if (error !== undefined) {
            console.log(error)
            if (
                error.response.data.error.includes('jwt') ||
                error.response.data.error.includes('token expired')
            ) {
                text = 'wrong credentials'
                userDispatch({ type: 'RESET' })
                blogService.setToken(undefined)
            }
        }
        dispatch({ type: 'SET', payload: [text, error === undefined] })
        setTimeout(() => {
            dispatch({ type: 'RESET' })
        }, 2000)
    }

    const logoutHandler = () => {
        window.localStorage.removeItem(userStorageKey)
        userDispatch({ type: 'RESET' })
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

            userDispatch({ type: 'SET', payload: loggedUser })
            blogService.setToken(loggedUser.token)
            setUsername('')
            setPassword('')
        } catch (exception) {
            showMessage('wrong credentials', exception)

            return
        }

        showMessage('logged in')
    }

    const usernameHandler = ({ target }) => {
        setUsername(target.value)
    }

    const passwordHandler = ({ target }) => {
        setPassword(target.value)
    }

    const cancelAddBlog = () => {
        addBlogForm.current.resetBlog()
    }

    if (user === undefined) {
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

    if (!result.isSuccess) {
        let errorMsg = 'Failed to load blogs'
        if (result.isLoading) {
            errorMsg = 'Loading...'
        }
        return <div style={mainStyle}>{errorMsg}</div>
    }

    const sortedByLikes = blogs.toSorted((a, b) => b.likes - a.likes)

    return (
        <div style={mainStyle}>
            <BlogsHeader
                username={user.username}
                logoutHandler={logoutHandler}
            />
            <StatusMessage />
            <Togglable
                buttonLabel="add blog"
                cancelHandler={cancelAddBlog}
                ref={addBlogToggleForm}
            >
                <AddBlog createBlog={createBlog} ref={addBlogForm} />
            </Togglable>
            <h2>Blogs</h2>
            <BlogList
                blogs={sortedByLikes}
                loggedUser={user.username}
                removeHandler={removeBlog}
                modifyHandler={modifyBlog}
            />
        </div>
    )
}

export default App
