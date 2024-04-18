import styles from './styles'
import PropTypes from 'prop-types'

const BlogsHeader = ({ username, logoutHandler }) => {
    const navStyle = {
        backgroundColor: '#4A4E58',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'space-between',
        padding: 4
    }

    const textStyle = {
        color: '#1CA1C1',
        margin: 0,
        border: 0
    }

    return (
        <nav style={navStyle}>
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
