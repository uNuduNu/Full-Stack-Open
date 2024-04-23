import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { TextField, Button } from '@mui/material'

const AddBlog = forwardRef((props, ref) => {
    const blog = {
        title: '',
        author: '',
        url: '',
        likes: 0
    }

    const [newBlog, setNewBlog] = useState(blog)

    const titleHandler = ({ target }) => {
        const updatedBlog = {
            ...newBlog,
            title: target.value
        }
        setNewBlog(updatedBlog)
    }

    const authorHandler = ({ target }) => {
        const updatedBlog = {
            ...newBlog,
            author: target.value
        }
        setNewBlog(updatedBlog)
    }

    const urlHandler = ({ target }) => {
        const updatedBlog = {
            ...newBlog,
            url: target.value
        }

        setNewBlog(updatedBlog)
    }

    const likesHandler = ({ target }) => {
        const updatedBlog = {
            ...newBlog,
            likes: target.value
        }
        setNewBlog(updatedBlog)
    }

    const addBlog = (event) => {
        event.preventDefault()

        const addedBlog = { ...newBlog }

        props.createBlog(addedBlog)

        resetBlog()
    }

    const resetBlog = () => {
        setNewBlog(blog)
    }

    useImperativeHandle(ref, () => {
        return { resetBlog }
    })

    return (
        <div>
            <h2>Add blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="title"
                        value={newBlog.title}
                        onChange={titleHandler}
                    />
                </div>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="author"
                        value={newBlog.author}
                        onChange={authorHandler}
                    />
                </div>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="url"
                        value={newBlog.url}
                        onChange={urlHandler}
                    />
                </div>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="likes"
                        type="number"
                        value={newBlog.likes}
                        onChange={likesHandler}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={styles.wideStyle}
                    >
                        add
                    </Button>
                </div>
            </form>
            <p />
        </div>
    )
})

AddBlog.propTypes = {
    createBlog: PropTypes.func.isRequired
}

AddBlog.displayName = 'AddBlog'

export default AddBlog
