import { useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserDetails = () => {
    const users = useSelector(({ users }) => {
        return users
    })

    const match = useMatch('/users/:id')
    const matchedUser = match
        ? users.find((u) => u.id === match.params.id)
        : undefined

    if (matchedUser !== undefined) {
        return (
            <div>
                <h2>{matchedUser.username}</h2>
                <h3>added blogs</h3>
                <ul>
                    {matchedUser.blogs.map((b) => (
                        <li key={b.id}>{b.title}</li>
                    ))}
                </ul>
            </div>
        )
    }

    return undefined
}

export default UserDetails
