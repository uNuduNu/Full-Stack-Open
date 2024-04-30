import { calculateBmi } from './bmiCalculator'
import express from 'express'
const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack')
})

app.get('/bmi', (req, res) => {
    const query = req.query
    if (query === undefined || 
        query.height === undefined || 
        query.weight === undefined || 
        isNaN(Number(query.height)) ||
        isNaN(Number(query.weight))) {

            return res.send({ error: 'malformatted parameters'})
    }

    return res.send({
        weight: Number(query.weight),
        height: Number(query.height),
        bmi: calculateBmi(Number(query.height), Number(query.weight))
    })
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})