import { parseArguments } from "./utils/argumentParser"

interface ExerciseResult {
    periodLength: number
    trainingDays: number
    success: boolean
    rating: number
    ratingDescription: string
    target: number
    average: number
}

const calculateExercises = (targetAmount: number, exHours: number[]): ExerciseResult => {
    let trainingDays = 0
    let avgTime = 0
    for (let i = 0; i < exHours.length; i++) {
        avgTime += exHours[i]

        if (exHours[i] !== 0) {
            trainingDays++
        }
    }
    avgTime /= exHours.length

    const trainingRatio = avgTime / targetAmount 

    const rating = trainingRatio < 0.5 ? 1 : trainingRatio >= 1 ? 3 : 2


    return {
        periodLength: exHours.length,
        trainingDays: trainingDays,
        success: avgTime > targetAmount ? true : false,
        rating: rating,
        ratingDescription: rating === 1 ? 'poor' : rating === 2 ? 'could be better' : 'ok',
        target: targetAmount,
        average: avgTime
    }
}

try {
    const { value1, value2 } = parseArguments(process.argv, -1)
    if (typeof value2 === "object")
    console.log(calculateExercises(value1, value2))
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message
    }
    console.log(errorMessage)
}
