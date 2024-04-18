import PropTypes from 'prop-types'

const StatusMessage = ({ text, success }) => {
    if (text !== undefined) {
        console.log(text)
        const messageStyle = {
            color: 'black',
            backgroundColor: success ? 'lightgreen' : 'white',
            fontSize: 20,
            border: success ? '1px solid black' : '2px solid red',
            borderRadius: 5,
            padding: 5,
            margin: 1
        }

        return <div style={messageStyle}>{text}</div>
    }

    return (
        undefined
    )
}

StatusMessage.propTypes = {
    text: PropTypes.string.isRequired,
    success: PropTypes.bool.isRequired
}

export default StatusMessage