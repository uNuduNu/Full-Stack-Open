import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext.jsx'
import { UserContextProvider } from './UserContext.jsx'
import App from './App.jsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </NotificationContextProvider>
    </QueryClientProvider>
)
