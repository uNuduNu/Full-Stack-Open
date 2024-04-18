import { useState, useImperativeHandle, forwardRef } from 'react'
import styles from './styles'
import PropTypes from 'prop-types'

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
            <h2 style={styles.headerStyle}>Add blog</h2>
            <form onSubmit={addBlog}>
                <div style={styles.formStyle}>
                    <p style={styles.labelStyle}>title:</p>
                    <input
                        style={styles.inputStyle}
                        value={newBlog.title}
                        onChange={titleHandler}
                        placeholder="title"
                        data-testid="title"
                    ></input>
                    <p style={styles.labelStyle}>author:</p>
                    <input
                        style={styles.inputStyle}
                        value={newBlog.author}
                        onChange={authorHandler}
                        placeholder="author"
                        data-testid="author"
                    ></input>
                    <p style={styles.labelStyle}>url:</p>
                    <input
                        style={styles.inputStyle}
                        value={newBlog.url}
                        onChange={urlHandler}
                        placeholder="url"
                        data-testid="url"
                    ></input>
                    <p style={styles.labelStyle}>likes:</p>
                    <input
                        style={styles.inputStyle}
                        type="number"
                        value={newBlog.likes}
                        onChange={likesHandler}
                        placeholder="likes"
                        data-testid="likes"
                    ></input>
                </div>
                <button
                    style={styles.widebuttonStyle}
                    type="submit"
                    data-testid="add"
                >
                    add
                </button>
            </form>
        </div>
    )
})

AddBlog.propTypes = {
    createBlog: PropTypes.func.isRequired
}

AddBlog.displayName = 'AddBlog'

export default AddBlog
