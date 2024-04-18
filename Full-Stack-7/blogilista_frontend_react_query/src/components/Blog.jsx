import { useState } from 'react'
import styles from './styles'
import PropTypes from 'prop-types'

const Blog = ({
    adder,
    title,
    author,
    url,
    likes,
    id,
    enableRemove,
    removeHandler,
    modifyHandler
}) => {
    const [view, setView] = useState(false)
    const [addedLikes, setAddedLikes] = useState(likes)

    const blogListStyle = {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns:
            removeHandler !== undefined ? '50% 43% 7%' : '50% 50%',
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

    const addLike = () => {
        const blog = {
            title: title,
            author: author,
            url: url,
            likes: addedLikes + 1,
            id: id,
            user: adder
        }

        modifyHandler(blog)

        setAddedLikes(addedLikes + 1)
    }

    const clipForDisplay = (data) => {
        return data.length > 20 ? data.substring(0, 17) + '...' : data
    }

    const removeButton = () => {
        return (
            <div>
                <button
                    style={styles.buttonStyle}
                    onClick={() => removeHandler(title, id)}
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
                        onClick={() => addLike()}
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
                {enableRemove && removeButton()}
            </div>
            {view && detailsView()}
        </>
    )
}

Blog.propTypes = {
    adder: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    enableRemove: PropTypes.bool.isRequired,
    removeHandler: PropTypes.func.isRequired,
    modifyHandler: PropTypes.func.isRequired
}

export default Blog
