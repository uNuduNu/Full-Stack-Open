import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import { createStore } from 'redux'
import counterReducer from './reducer'

const Header = (props) => {
  return (
    <h1>{props.name}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.count}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good+props.bad+props.neutral

  if (all === 0) {
    return (
      <p>
        No feedback given
      </p>
    )
  }

  const avg = (props.good - props.bad) / all
  let posPer = 0
  posPer = 100*props.good / all
  posPer += "%"

  return (
    <table>
      <tbody>
        <StatisticsLine name="good" count={props.good}/>
        <StatisticsLine name="neutral" count={props.neutral}/>
        <StatisticsLine name="bad" count={props.bad}/>
        <StatisticsLine name="all" count={all}/>
        <StatisticsLine name="average" count={avg}/>
        <StatisticsLine name="positive" count={posPer}/>
      </tbody>
    </table>
  )
}

const store = createStore(counterReducer)

const App = () => {

 //   return (
//    <div>
//      <Header name="Give feedback"/>
//      <Button handleClick={() => store.dispatch({ type: 'GOOD' })} text="good"/>
//      <Button handleClick={() => store.dispatch({ type: 'OK' })} text="neutral"/>
//      <Button handleClick={() => store.dispatch({ type: 'BAD' })} text="bad"/>
//      <Header name="Statistics"/>
//    <Statistics good={good} neutral={neutral} bad={bad}/>
//    </div>
//  )

    const feedback = store.getState()

    return (
    <div>
      <Header name="Give feedback"/>
      <Button handleClick={() => store.dispatch({ type: 'GOOD' })} text="good"/>
      <Button handleClick={() => store.dispatch({ type: 'OK' })} text="neutral"/>
      <Button handleClick={() => store.dispatch({ type: 'BAD' })} text="bad"/>
      <Button handleClick={() => store.dispatch({ type: 'ZERO' })} text="reset"/>
      <Header name="Statistics"/>
      <Statistics good={feedback.good} neutral={feedback.ok} bad={feedback.bad}/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
    root.render(<App />)
}

renderApp()
store.subscribe(renderApp)

