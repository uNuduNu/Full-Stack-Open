import { useEffect, useState, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogsHeader from './components/BlogsHeader'
import AddBlog from './components/AddBlog'
import StatusMessage from './components/StatusMessage'
import Togglable from './components/Togglable'

function App() {
    const userStorageKey = 'blogUser'

    const [user, setUser] = useState(undefined)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState(undefined)
    const [messageStatus, setMessageStatus] = useState(true)

    useEffect(() => {
        blogService.getAllBlogs()
            .then(retrievedBlogs => {
                setBlogs(retrievedBlogs)
            })
            .catch(error => showMessage('Failed to get blogs from server', error))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem(userStorageKey)

        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            setUser(loggedUser)
            blogService.setToken(loggedUser.token)
        }
    }, [])

    const mainStyle = { margins:0, padding: 0 }

    const addBlogToggleForm = useRef()
    const addBlogForm = useRef()

    const showMessage = (text, error) => {
        if (error !== undefined)
            console.log(error)

        setMessage(text)
        setMessageStatus(error === undefined)

        setTimeout(() => {
            setMessage(undefined)
        }, 2000)
    }

    const removeBlog = (title, id) => {
        if (false === window.confirm(`Delete ${title}?`)){
            return
        }
        blogService.removeBlog(id)
            .then(() => {
                setBlogs(blogs.filter(u => u.id !== id))
                showMessage(`Removed ${title}`, undefined)
            })
            .catch(error => showMessage(`Failed to remove blog: ${id}`, error))
    }

    const modifyBlog = (updatedBlog) => {

        blogService.modifyBlog(updatedBlog)
            .then(blog => {
                setBlogs(blogs.map(b => b.id !== blog.id ? b : blog))
            })
            .catch(error => {
                if (error.response.data.error.includes('jwt'))
                {
                    showMessage('wrong credentials', error)
                    setUser(undefined)
                    blogService.setToken(undefined)
                } else {
                    showMessage('failed to modify blog', error)
                }
            })
    }

    const logoutHandler = () => {
        window.localStorage.removeItem(userStorageKey)
        setUser(undefined)
        blogService.setToken(undefined)
    }

    const loginHandler = async (event) => {
        event.preventDefault()

        try {
            const loggedUser = await loginService.login({ username, password })

            window.localStorage.setItem(userStorageKey, JSON.stringify(loggedUser))

            setUser(loggedUser)
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

    const createBlog = (newBlog) => {
        blogService.addBlog(newBlog)
            .then(blog => {
                setBlogs(blogs.concat(blog))
            })
            .catch(error => {
                if (error.response.data.error.includes('jwt'))
                {
                    showMessage('wrong credentials', error)
                    setUser(undefined)
                    blogService.setToken(undefined)
                } else {
                    showMessage('failed to add blog', error)

                }
                return
            })


        addBlogToggleForm.current.toggleVisibility()
        showMessage('blog added')
    }

    const cancelAddBlog = () => {
        addBlogForm.current.resetBlog()
    }


    const messageBox = () => {
        return (
            <div style={mainStyle}>
                <StatusMessage text={message} success={messageStatus}/>
            </div>
        )
    }

    if (user === undefined)
    {
        return (
            <div style={mainStyle}>
                {message !== undefined && messageBox()}
                <LoginForm loginHandler={loginHandler} username={username} usernameHandler={usernameHandler} password={password} passwordHandler={passwordHandler}/>
            </div>
        )
    }

    const sortedByLikes = blogs.toSorted((a,b) => b.likes - a.likes)

    return (
        <div style={mainStyle}>
            <BlogsHeader username={user.username} logoutHandler={logoutHandler}/>
            {message !== undefined && messageBox()}
            <Togglable buttonLabel='add blog' cancelHandler={cancelAddBlog} ref={addBlogToggleForm}>
                <AddBlog createBlog={createBlog} ref={addBlogForm}/>
            </Togglable>
            <h2>Blogs</h2>
            <BlogList blogs={sortedByLikes} loggedUser={user.username} removeHandler={removeBlog} modifyHandler={modifyBlog}/>
        </div>
    )
}

export default App
