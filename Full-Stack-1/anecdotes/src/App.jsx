import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

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

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVoted] = useState(new Array(8).fill(0))
  const [mostVotes, setMostVotes] = useState(0)

  const setToSelected = () => setSelected(Math.floor(Math.random() * 8))
  const setToVoted = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVoted(copy)

    if (copy[selected] > copy[mostVotes]) {
      setMostVotes(selected)
    }
  }

  return (
    <div>
      <Header name="Anecdote of the day"/>
      <AnecdoteLine text={anecdotes[selected]}/>
      <VoteLine votes={votes[selected]}/>
      <Button handleClick={() => setToVoted()} text="vote"/>
      <Button handleClick={() => setToSelected()} text="next anecdote"/>
      <Header name="Anecdote with most votes"/>
      <AnecdoteLine text={anecdotes[mostVotes]}/>
      <VoteLine votes={votes[mostVotes]}/>
    </div>
  )
}

export default App
