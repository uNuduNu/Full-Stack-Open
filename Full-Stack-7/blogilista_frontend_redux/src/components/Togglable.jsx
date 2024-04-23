import { useState, useImperativeHandle, forwardRef } from 'react'
import styles from './styles'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

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
                <Button
                    variant="contained"
                    color="primary"
                    style={styles.wideStyle}
                    onClick={toggleVisibility}
                    data-testid="show"
                >
                    {props.buttonLabel}
                </Button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <Button
                    variant="contained"
                    color="primary"
                    style={styles.wideStyle}
                    onClick={toggleVisibility}
                    data-testid="hide"
                >
                    cancel
                </Button>
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
