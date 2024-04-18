import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import blogStore from './reducers/blogStore.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={blogStore}>
        <App />
    </Provider>
)
