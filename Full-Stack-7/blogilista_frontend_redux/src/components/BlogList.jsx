import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper
} from '@mui/material'

const BlogList = () => {
    const sortedByLikes = useSelector(({ blogs }) => {
        return blogs
    }).toSorted((a, b) => b.likes - a.likes)

    if (sortedByLikes === null) {
        return null
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    {sortedByLikes.map((blog) => (
                        <TableRow key={blog.id}>
                            <TableCell>
                                <Link to={`/blogs/${blog.id}`}>
                                    {blog.title}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BlogList
