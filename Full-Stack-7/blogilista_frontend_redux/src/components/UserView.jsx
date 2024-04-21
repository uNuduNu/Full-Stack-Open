import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserView = () => {
    const users = useSelector(({ users }) => {
        return users
    })

    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>
                                <Link to={`/users/${u.id}`}>{u.username}</Link>
                            </td>
                            <td>{u.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserView
