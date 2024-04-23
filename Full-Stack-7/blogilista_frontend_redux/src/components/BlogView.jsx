import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Togglable from './Togglable'
import AddBlog from './AddBlog'
import BlogList from './BlogList'

import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

const BlogView = () => {
    const dispatch = useDispatch()

    const addBlogForm = useRef()
    const addBlogToggleForm = useRef()

    const user = useSelector(({ loggedUser }) => {
        return loggedUser
    })

    const cancelAddBlog = () => {
        addBlogForm.current.resetBlog()
    }

    const createNewBlog = (newBlog) => {
        dispatch(createBlog(newBlog))

        addBlogToggleForm.current.toggleVisibility()
        dispatch(setNotification(['blog added']))
    }

    return (
        <div>
            <h2>Blogs</h2>
            <BlogList loggedUser={user.username} />
            <p />
            <Togglable
                buttonLabel="add blog"
                cancelHandler={cancelAddBlog}
                ref={addBlogToggleForm}
            >
                <AddBlog createBlog={createNewBlog} ref={addBlogForm} />
            </Togglable>
        </div>
    )
}

export default BlogView
