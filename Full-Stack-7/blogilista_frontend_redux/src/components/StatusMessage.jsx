import { useSelector } from 'react-redux'

const StatusMessage = () => {
    const notification = useSelector(({ notification }) => {
        return notification
    })

    if (notification !== undefined && notification[0] !== '') {
        console.log(notification[0])
        const messageStyle = {
            color: 'black',
            backgroundColor: notification[1] ? 'white' : 'lightgreen',
            fontSize: 20,
            border: notification[1] ? '2px solid red' : '1px solid black',
            borderRadius: 5,
            padding: 5,
            margin: 1
        }

        return <div style={messageStyle}>{notification[0]}</div>
    }

    return undefined
}

export default StatusMessage
