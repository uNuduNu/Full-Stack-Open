import { useState } from 'react'

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

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = value => setGood(value)
  const setToNeutral = value => setNeutral(value)
  const setToBad = value => setBad(value)

  return (
    <div>
      <Header name="Give feedback"/>
      <Button handleClick={() => setToGood(good + 1)} text="good"/>
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setToBad(bad + 1)} text="bad"/>
      <Header name="Statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
