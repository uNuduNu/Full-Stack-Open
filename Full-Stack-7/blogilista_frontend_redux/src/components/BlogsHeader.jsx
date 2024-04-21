import styles from './styles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogsHeader = ({ username, logoutHandler }) => {
    const navStyle = {
        backgroundColor: 'lightgray',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'space-between',
        padding: 4
    }

    const textStyle = {
        //        color: '#1CA1C1',
        margin: 0,
        border: 0
    }

    const padding = { paddingRight: 5 }

    return (
        <nav style={navStyle}>
            <div>
                <Link to="/" style={padding}>
                    blogs
                </Link>
                <Link to="/users">users</Link>
            </div>
            <div>
                <p style={textStyle}>logged in as {username}</p>
            </div>
            <div>
                <button
                    style={styles.buttonStyle}
                    onClick={() => logoutHandler()}
                    data-testid="logout"
                >
                    logout
                </button>
            </div>
        </nav>
    )
}

BlogsHeader.propTypes = {
    username: PropTypes.string.isRequired,
    logoutHandler: PropTypes.func.isRequired
}

export default BlogsHeader
