import { useState, useImperativeHandle, forwardRef } from 'react'
import styles from './styles'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)

        if (visible === false) props.cancelHandler()
    }

    useImperativeHandle(ref, () => {
        return { toggleVisibility }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button
                    style={styles.widebuttonStyle}
                    onClick={toggleVisibility}
                    data-testid="show"
                >
                    {props.buttonLabel}
                </button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button
                    style={styles.buttonStyle}
                    onClick={toggleVisibility}
                    data-testid="hide"
                >
                    cancel
                </button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
    cancelHandler: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.object
}

export default Togglable
