import { parseArguments } from "./utils/argumentParser"

const calculateBmi = (height: number, weight: number): string => {
    // inputs must be > 0
    if (height < 0 || weight < 0) {
        throw new Error('Height and weight must be > 0')
    }

    // convert height to meters
    height /= 100

    const bmi =  weight / (height * height)

    let bmiCategory = 'Underweight (Severe thinness)'
    if (bmi >= 16.0 && bmi < 17.0) {
        bmiCategory = 'Underweight (Moderate thinness)'
    }
    else if (bmi >= 17.0 && bmi < 18.5) {
        bmiCategory = 'Underweight (Mild thinness)'
    }
    else if (bmi >= 18.5 && bmi < 25.0) {
        bmiCategory = 'Normal (Healthy weight)'
    }
    else if (bmi >= 25.0 && bmi < 30.0) {
        bmiCategory = 'Overweight (Pre-obese)'
    }
    else if (bmi >= 30.0 && bmi < 35.0) {
        bmiCategory = 'Obese (Class I)'
    }
    else if (bmi >= 35.0 && bmi < 40.0) {
        bmiCategory = 'Obese (Class II)'
    }
    else {
        bmiCategory = 'Obese (Class III)'
    }

    return `${bmi} : ${bmiCategory}` 
}

try {
    const { value1, value2 } = parseArguments(process.argv, 4)
    if (typeof value2 === "number") {
        console.log(calculateBmi(value1, value2))
    }
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message
    }
    console.log(errorMessage)
}
