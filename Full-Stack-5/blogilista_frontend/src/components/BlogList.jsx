import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ loggedUser, blogs, removeHandler, modifyHandler }) => {
    if (blogs === null) {
        return null
    }

    return (
        <div>
            {blogs.map(blog => <Blog key={blog.id} adder={blog.user} author={blog.author} title={blog.title} url={blog.url} likes={blog.likes} id={blog.id} enableRemove={blog.user.username === loggedUser} removeHandler={removeHandler} modifyHandler={modifyHandler}/>)}
        </div>
    )
}

BlogList.propTypes = {
    loggedUser: PropTypes.string.isRequired,
    blogs: PropTypes.array.isRequired,
    removeHandler: PropTypes.func.isRequired,
    modifyHandler: PropTypes.func.isRequired
}

export default BlogList