import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar } from '@mui/material'

const BlogsHeader = ({ username, logoutHandler }) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" />
                <Button color="inherit" component={Link} to="/">
                    blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                    users
                </Button>
                <Button color="inherit" onClick={() => logoutHandler()}>
                    welcome {username}, logout?
                </Button>
            </Toolbar>
        </AppBar>
    )
}

BlogsHeader.propTypes = {
    username: PropTypes.string.isRequired,
    logoutHandler: PropTypes.func.isRequired
}

export default BlogsHeader
