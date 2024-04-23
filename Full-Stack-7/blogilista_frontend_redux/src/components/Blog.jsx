import { useState } from 'react'
import styles from './styles'
import { removeBlog, addLike, addComment } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'

const Blog = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loggedUser = useSelector(({ loggedUser }) => {
        return loggedUser
    })

    const blogs = useSelector(({ blogs }) => {
        return blogs
    })

    const match = useMatch('/blogs/:id')
    const matchedBlog = match
        ? blogs.find((b) => b.id === match.params.id)
        : undefined

    const [addedLikes, setAddedLikes] = useState(
        matchedBlog !== undefined ? matchedBlog.likes : 0
    )

    const [newComment, setNewComment] = useState('')

    if (matchedBlog === undefined) return undefined

    const blogListStyle = {
        boxSizing: 'border-box',
        borderTop: '1px solid #D8D8D8',
        padding: 4
    }

    const addALike = () => {
        const blog = { ...matchedBlog, likes: addedLikes + 1 }

        dispatch(addLike(blog))

        setAddedLikes(addedLikes + 1)
    }

    const removeABlog = (title, id) => {
        if (false === window.confirm(`Delete ${title}?`)) {
            return
        }
        dispatch(removeBlog(id))
        navigate('/')
    }

    const commentHandler = ({ target }) => {
        setNewComment(target.value)
    }

    const commentBlog = (event) => {
        event.preventDefault()
        dispatch(addComment(matchedBlog.id, newComment))
        setNewComment('')
    }

    const removeButton = () => {
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        removeABlog(matchedBlog.title, matchedBlog.id)
                    }
                >
                    remove blog
                </Button>
            </div>
        )
    }

    const comments = () => {
        return (
            <ul>
                {matchedBlog.comments.map((c) => (
                    <li key={c.id}>{c.body}</li>
                ))}
            </ul>
        )
    }

    return (
        <div style={blogListStyle}>
            <h2 data-testid="titlediv">
                {matchedBlog.title} {matchedBlog.author}
            </h2>
            <div>
                <a href={matchedBlog.url}>{matchedBlog.url}</a>
            </div>
            <div>{'added by ' + matchedBlog.user.username}</div>
            <p />
            <div>
                {'+' + addedLikes + ' '}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addALike()}
                >
                    like
                </Button>
            </div>
            <p />
            {matchedBlog.user.username === loggedUser && removeButton()}
            <h3>comments</h3>
            <form onSubmit={commentBlog}>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="add comment"
                        value={newComment}
                        onChange={commentHandler}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={styles.wideStyle}
                    >
                        add comment
                    </Button>
                </div>
            </form>

            {matchedBlog.comments !== undefined && comments()}
        </div>
    )
}

export default Blog
