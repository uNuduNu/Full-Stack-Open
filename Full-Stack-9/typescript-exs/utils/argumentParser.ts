interface parsedValues {
    value1: number
    value2: number | number[]
}
  
export const parseArguments = (args: string[], expectedCount: number): parsedValues => {
    if (expectedCount !== -1 && args.length < expectedCount) throw new Error('Not enough arguments')
    if (expectedCount !== -1 && args.length > expectedCount) throw new Error('Too many arguments')
  
    let retargs = []
    for (let i = 2; i < args.length; i++) {
        if (isNaN(Number(args[i]))) {
            throw new Error('Provided values were not numbers!')
        }

        if (i !== 2) {
            retargs.push(Number(args[i]))
        }
    }

    return {
        value1: Number(args[2]),
        value2: args.length === 4 ? retargs[0] : retargs 
    }
}


