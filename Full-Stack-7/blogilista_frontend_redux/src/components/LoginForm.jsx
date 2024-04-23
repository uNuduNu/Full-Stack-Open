import styles from './styles'
import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'

const LoginForm = ({
    username,
    usernameHandler,
    password,
    passwordHandler,
    loginHandler
}) => {
    return (
        <div>
            <h2 style={styles.headerStyle}>Login</h2>
            <form onSubmit={loginHandler}>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="username"
                        value={username ? username : ''}
                        onChange={usernameHandler}
                    />
                </div>
                <div>
                    <TextField
                        style={styles.wideStyle}
                        label="password"
                        value={password ? password : ''}
                        type="password"
                        onChange={passwordHandler}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={styles.wideStyle}
                    >
                        login
                    </Button>
                </div>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    username: PropTypes.string.isRequired,
    usernameHandler: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    passwordHandler: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired
}

export default LoginForm
