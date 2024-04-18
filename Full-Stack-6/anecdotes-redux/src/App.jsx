import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes(),)
  }, [])


  return (
    <div>
      <Notification/>
      <Header name="Anecdotes"/>
      <AnecdoteForm/>
      <Filter/>
      <AnecdoteList/>
    </div>
  )
}

export default App
