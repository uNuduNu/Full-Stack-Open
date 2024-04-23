import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper
} from '@mui/material'

const UserView = () => {
    const users = useSelector(({ users }) => {
        return users
    })

    return (
        <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>blogs created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>
                                    <Link to={`/users/${u.id}`}>
                                        {u.username}
                                    </Link>
                                </TableCell>
                                <TableCell>{u.blogs.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default UserView
