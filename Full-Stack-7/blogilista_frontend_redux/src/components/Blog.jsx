import { useState } from 'react'
import styles from './styles'
import { removeBlog, addLike, addComment } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'

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
                <button
                    style={styles.buttonStyle}
                    onClick={() =>
                        removeABlog(matchedBlog.title, matchedBlog.id)
                    }
                    data-testid="delete"
                >
                    remove
                </button>
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
                {matchedBlog.user.username === loggedUser && removeButton()}
            </h2>
            <a href={matchedBlog.url}>{matchedBlog.url}</a>
            <div>
                {'+' + addedLikes}
                <button
                    style={styles.buttonStyle}
                    onClick={() => addALike()}
                    data-testid="likebutton"
                >
                    like
                </button>
            </div>
            <div>{'added by ' + matchedBlog.user.username}</div>
            <h3>comments</h3>
            <form onSubmit={commentBlog}>
                <div style={styles.commentFormStyleformStyle}>
                    <input
                        style={styles.inputStyle}
                        value={newComment}
                        onChange={commentHandler}
                        placeholder="comment"
                    ></input>
                    <button
                        style={styles.buttonStyle}
                        type="submit"
                        data-testid="add"
                    >
                        add comment
                    </button>
                </div>
            </form>

            {matchedBlog.comments !== undefined && comments()}
        </div>
    )
}

export default Blog
