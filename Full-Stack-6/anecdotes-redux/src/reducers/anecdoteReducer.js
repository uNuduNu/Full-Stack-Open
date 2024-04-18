import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { useSelector } from 'react-redux'

const initialState = []

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState,
    reducers: {
        addAnecdote(state, action) {
            state.push(action.payload)
        },
        changeAnecdote(state, action) {
            const changedAnecdote = action.payload
            return state.map(a => a.id !== changedAnecdote.id ? a : changedAnecdote)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(addAnecdote(newAnecdote))
    }
}

export const addVote = anecdoteToVote => {
    console.log(anecdoteToVote)
    const addedVote = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
    console.log(addedVote)
    return async dispatch => {
        const modifiedAnecdote = await anecdoteService.modifyAnecdote(addedVote)
        console.log(modifiedAnecdote)
        dispatch(changeAnecdote(modifiedAnecdote))
    }
}

export const { addAnecdote, changeAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer