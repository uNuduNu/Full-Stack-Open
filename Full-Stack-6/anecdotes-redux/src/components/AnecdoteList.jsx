import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'

const AnecdoteLine = (props) => {
    return (
      <p>
        {props.text} 
      </p>
    )
  }
  
  const Button = (props) => {
    return (
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    )
  }
  
  const VoteLine = (props) => {
    return (
      <p>
        has {props.votes} votes
      </p>
    )
  }

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === '') {
            return anecdotes
        }

        return anecdotes.filter(a => a.anecdote.toLowerCase().includes(filter.toString().toLowerCase()))
    })

    const addVoteHandler = (id) => {

        const anecdoteToVote = anecdotes.find(a => a.id === id)
    
        dispatch(addVote(anecdoteToVote))
        dispatch(setNotification(`You voted for: ${anecdotes.find(a => a.id === id).content}`, 2))
    }
  
    const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  
    return (
        <div>
            {sortedAnecdotes.map(a => 
                <div key={a.id}>
                <AnecdoteLine text={a.content}/>
                <VoteLine votes={a.votes}/>
                <Button handleClick={() => addVoteHandler(a.id)} text="vote"/>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList