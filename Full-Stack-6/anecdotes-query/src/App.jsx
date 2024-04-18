import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, changeAnecdote } from './requests'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {

  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const changeAnecdoteMutation = useMutation({
    mutationFn: changeAnecdote,
    onSuccess: (changedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === changedAnecdote.id ? changedAnecdote : a))

      dispatch({ type: 'SET', payload: `You voted for: ${changeAnecdote.content}`})
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5000)
    }
  }) 

  const handleVote = (anecdote) => {
    changeAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isSuccess === false) {
    let statusMsg = 'loading...'
    if (result.isError) {
      statusMsg = 'service not available'
    }

    return (
      <div>{statusMsg}</div>
    )
 
  }

  const anecdotes = result.data
    
    return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
