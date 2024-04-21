import { useNotificationValue } from '../NotificationContext'

const StatusMessage = () => {
    const notification = useNotificationValue()

    if (notification !== undefined) {
        console.log(notification[0])
        const messageStyle = {
            color: 'black',
            backgroundColor: notification[1] ? 'lightgreen' : 'white',
            fontSize: 20,
            border: notification[1] ? '1px solid black' : '2px solid red',
            borderRadius: 5,
            padding: 5,
            margin: 1
        }

        return <div style={messageStyle}>{notification[0]}</div>
    }

    return undefined
}

export default StatusMessage
