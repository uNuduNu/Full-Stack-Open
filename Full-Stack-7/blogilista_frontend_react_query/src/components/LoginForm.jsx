import styles from './styles'
import PropTypes from 'prop-types'

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
                <div style={styles.formStyle}>
                    <p style={styles.labelStyle}>username:</p>
                    <input
                        style={styles.inputStyle}
                        value={username ? username : ''}
                        onChange={usernameHandler}
                        data-testid="username"
                    ></input>
                    <p style={styles.labelStyle}>password:</p>
                    <input
                        style={styles.inputStyle}
                        value={password ? password : ''}
                        type="password"
                        onChange={passwordHandler}
                        data-testid="password"
                    ></input>
                </div>
                <button
                    style={styles.widebuttonStyle}
                    type="submit"
                    data-testid="submit"
                >
                    login
                </button>
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
