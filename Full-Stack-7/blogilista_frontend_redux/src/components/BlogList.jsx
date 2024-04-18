import Blog from './Blog'
import { useSelector } from 'react-redux'

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
                <Blog
                    key={blog.id}
                    adder={blog.user.username}
                    author={blog.author}
                    title={blog.title}
                    url={blog.url}
                    likes={blog.likes}
                    id={blog.id}
                />
            ))}
        </div>
    )
}

export default BlogList
