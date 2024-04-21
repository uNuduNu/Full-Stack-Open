import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
    const sortedByLikes = useSelector(({ blogs }) => {
        return blogs
    }).toSorted((a, b) => b.likes - a.likes)

    if (sortedByLikes === null) {
        return null
    }

    return (
        <div>
            {sortedByLikes.map((blog) => (
                <div key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </div>
            ))}
        </div>
    )
}

export default BlogList
