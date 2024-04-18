import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const addAnec = async (event) => {
        const anec = event.target[0].value
        event.target[0].value =  ''
    
        event.preventDefault()

        dispatch(createAnecdote(anec))
        dispatch(setNotification(`You added ${anec}`, 3))
    }

    return (
        <form onSubmit={addAnec}>
        <input name='anec'/>
        <button type='submit'>add</button>
        </form>
    )
}

export default AnecdoteForm