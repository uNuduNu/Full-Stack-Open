import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const StatusMessage = () => {
    const notification = useSelector(({ notification }) => {
        return notification
    })

    if (notification !== undefined && notification[0] !== '') {
        console.log(notification[0])
        console.log(notification[1])

        return (
            <Alert
                severity={notification[1] !== undefined ? 'error' : 'success'}
            >
                {notification[0]}
            </Alert>
        )
    }

    return undefined
}

export default StatusMessage
