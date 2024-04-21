import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import blogStore from './reducers/blogStore.js'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={blogStore}>
        <Router>
            <App />
        </Router>
    </Provider>
)
