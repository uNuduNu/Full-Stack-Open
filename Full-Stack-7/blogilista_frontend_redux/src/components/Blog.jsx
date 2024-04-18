import { useState } from 'react'
import styles from './styles'
import PropTypes from 'prop-types'
import { removeBlog, addLike } from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'

const Blog = ({ adder, title, author, url, likes, id }) => {
    const dispatch = useDispatch()

    const loggedUser = useSelector(({ loggedUser }) => {
        return loggedUser
    })

    const [view, setView] = useState(false)
    const [addedLikes, setAddedLikes] = useState(likes)

    const blogListStyle = {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: adder === loggedUser ? '50% 43% 7%' : '50% 50%',
        borderTop: '1px solid #D8D8D8',
        padding: 4
    }
    const blogDetailsStyle = {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '30% 30% 30% 10%',
        borderTop: '1px solid #D8D8D8',
        padding: 4
    }

    const viewDetails = () => {
        setView(!view)
    }

    const addALike = () => {
        const blog = {
            title: title,
            author: author,
            url: url,
            likes: addedLikes + 1,
            id: id,
            user: adder
        }

        dispatch(addLike(blog))

        setAddedLikes(addedLikes + 1)
    }

    const removeABlog = (title, id) => {
        if (false === window.confirm(`Delete ${title}?`)) {
            return
        }
        dispatch(removeBlog(id))
    }

    const clipForDisplay = (data) => {
        return data.length > 20 ? data.substring(0, 17) + '...' : data
    }

    const removeButton = () => {
        return (
            <div>
                <button
                    style={styles.buttonStyle}
                    onClick={() => removeABlog(title, id)}
                    data-testid="delete"
                >
                    x
                </button>
            </div>
        )
    }

    const detailsView = () => {
        return (
            <div style={blogDetailsStyle}>
                <div>{clipForDisplay(author)}</div>
                <div>{clipForDisplay(url)}</div>
                <div>{clipForDisplay('+' + addedLikes)}</div>
                <div>
                    <button
                        style={styles.buttonStyle}
                        onClick={() => addALike()}
                        data-testid="likebutton"
                    >
                        like
                    </button>
                </div>
                <div>{adder.name}</div>
            </div>
        )
    }

    return (
        <>
            <div style={blogListStyle}>
                <div data-testid="titlediv">{title}</div>
                <div>
                    <button
                        style={styles.buttonStyle}
                        onClick={() => viewDetails()}
                        data-testid="details"
                    >
                        {view ? 'hide' : 'details...'}
                    </button>
                </div>
                {adder === loggedUser && removeButton()}
            </div>
            {view && detailsView()}
        </>
    )
}

Blog.propTypes = {
    adder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
}

export default Blog
