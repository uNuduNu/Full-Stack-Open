import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import anecdoteStore from './anecdoteStore'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={anecdoteStore}>
        <App />
    </Provider>
)