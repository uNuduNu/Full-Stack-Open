import { useState } from 'react'
import styles from './styles'
import { removeBlog, addLike } from '../reducers/blogReducer'
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

    if (matchedBlog === undefined) return undefined

    const blogListStyle = {
        boxSizing: 'border-box',
        borderTop: '1px solid #D8D8D8',
        padding: 4
    }

    const addALike = () => {
        const blog = {
            title: matchedBlog.title,
            author: matchedBlog.author,
            url: matchedBlog.url,
            likes: addedLikes + 1,
            id: matchedBlog.id,
            user: matchedBlog.adder
        }

        console.log('likes ' + blog.likes)

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

    return (
        <div style={blogListStyle}>
            <h2 data-testid="titlediv">
                {matchedBlog.title} {matchedBlog.author}
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
            {matchedBlog.user.username === loggedUser && removeButton()}
        </div>
    )
}

export default Blog
