import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import cors from 'cors';
import express from 'express';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;
    if (height === undefined || 
        weight === undefined || 
        isNaN(Number(height)) ||
        isNaN(Number(weight))) {

            return res.status(400).json({ error: "malformatted parameters"});
    }

    return res.send({
        weight: Number(weight),
        height: Number(height),
        bmi: calculateBmi(Number(height), Number(weight))
    });
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (daily_exercises === undefined ||
        target === undefined) {
        
        return res.status(400).json({ error: "parameters missing" });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (isNaN(Number(target)) || typeof daily_exercises !== "object" || daily_exercises.length === undefined) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const validatedDailyExercises = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (let i = 0; i < daily_exercises.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (isNaN(Number(daily_exercises[i]))) {
            return res.status(400).json({ error: "malformatted parameters" });
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        validatedDailyExercises.push(Number(daily_exercises[i]));
    }

    return res.status(200).json(calculateExercises(Number(target), validatedDailyExercises));

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});