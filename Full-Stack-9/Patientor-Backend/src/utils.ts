import { Gender, NewPatientEntry, Entry, NewEntry, HealthCheckRating, Discharge, Diagnosis, SickLeave } from "./types";

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object && 'entries' in object) {

        const newEntry: NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: parseEntries(object.entries)
        };

        return newEntry;
    }
      
    throw new Error('Incorrect data: fields missing');
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (_number: unknown): _number is number => {
    return typeof _number === 'number' || _number instanceof Number;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(g => g.toString()).includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};
  
const parseGenericString = (text: unknown, fieldName: string): string => {
    if (!isString(text)) {
        throw new Error(`Incorrect ${fieldName}`);
    }

    return text;
};

const parseGenericDate = (date: unknown, fieldName: string): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error(`Incorrect ${fieldName}`);
    }

    return date;
};

const parseName = (name: unknown): string => {
    if (!isString(name)) {
        throw new Error('Incorrect name');
    }

    return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
    if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
        throw new Error('Incorrect dateOfBirth');
    }

    return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
    if (!isString(ssn) || (ssn.length !== 11 && ssn.length !== 10)) {
        throw new Error('Incorrect ssn');
    }

    return ssn;
};

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect gender');
    }

    return gender;
};

const parseOccupation = (occupation: unknown): string => {
    if (!isString(occupation)) {
        throw new Error('Incorrect occupation');
    }

    return occupation;
}; 


const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect healthcheck rating');
    }

    return healthCheckRating;
};

const parseDischarge = (discharge: unknown): Discharge => {
    if (!discharge || typeof discharge !== 'object') {
        throw new Error('Incorrect discharge');
    }

    if ('date' in discharge && 'criteria' in discharge) {
        const newDischarge: Discharge = {
            date: parseGenericDate(discharge.date, 'discharge date'),
            criteria: parseGenericString(discharge.criteria, 'discharge criteria')
        };

        return newDischarge;
    }

    throw new Error('Discharge fields missing');
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
    if (!diagnosisCodes || typeof diagnosisCodes !== 'object' || !Array.isArray(diagnosisCodes)) {
        throw new Error('Incorrect diagnosis codes');
    }

    const newDiagnosisCodes = diagnosisCodes.map(obj => {
        return parseGenericString(obj, 'diagnosis code'); 
    });

    return newDiagnosisCodes;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
    if (!sickLeave || typeof sickLeave !== 'object') {
        throw new Error('Incorrect sickLeave');
    }

    if ('startDate' in sickLeave && 'endDate' in sickLeave) {
        const newSickLeave: SickLeave = {
            startDate: parseGenericDate(sickLeave.startDate, 'sickLeave start date'),
            endDate: parseGenericString(sickLeave.endDate, 'sickLeave end date')
        };

        return newSickLeave;
    }

    throw new Error('SickLeave fields missing');
};

const parseEntries = (entries: unknown): Entry[] => {
    if (!entries || typeof entries !== 'object' || !Array.isArray(entries)) {
        throw new Error('Incorrect entry');
    }

    const newEntries = entries.map(obj => {
        const object = parseEntry(obj) as Entry;

        if ('id' in obj) {
            object.id = parseGenericString(obj.id, 'id');
        } else {
            throw new Error('Id field missing from entry');
        }

        return object;
    }); 

    return newEntries;
}; 

export const parseEntry = (entry: unknown): NewEntry => {
    if (!entry || typeof entry !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('description' in entry && 'date' in entry && 'specialist' in entry && 'type' in entry) {
        switch (entry.type) {
            case 'HealthCheck':
                if ('healthCheckRating' in entry){
                    const newEntry: NewEntry = {
                        description: parseGenericString(entry.description, 'description'),
                        date: parseGenericDate(entry.date, 'date'),
                        specialist: parseGenericString(entry.specialist, 'specialist'),
                        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
                        type: "HealthCheck"
                    };

                    return newEntry;
                } else {
                    throw new Error(`Healthcheck rating missing: ${JSON.stringify(entry)}`);
                }
                break;
            case 'Hospital':
                if ('discharge' in entry) {
                    const newEntry: NewEntry = {
                        description: parseGenericString(entry.description, 'description'),
                        date: parseGenericDate(entry.date, 'date'),
                        specialist: parseGenericString(entry.specialist, 'specialist'),
                        discharge: parseDischarge(entry.discharge),
                        type: "Hospital"
                    };

                    if ('diagnosisCodes' in entry) {
                        newEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
                    }
    
                    return newEntry;
                }  else {
                    throw new Error('Discharge missing');
                }

                break;
            case 'OccupationalHealthcare':
                if ('employerName' in entry) {
                    const newEntry: NewEntry = {
                        description: parseGenericString(entry.description, 'description'),
                        date: parseGenericDate(entry.date, 'date'),
                        specialist: parseGenericString(entry.specialist, 'specialist'),
                        employerName: parseGenericString(entry.employerName, 'employer name'),
                        type: "OccupationalHealthcare"
                    };

                    if ('diagnosisCodes' in entry) {
                        newEntry.diagnosisCodes = parseDiagnosisCodes(entry.diagnosisCodes);
                    }
    
                    if ('sickLeave' in entry) {
                        newEntry.sickLeave = parseSickLeave(entry.sickLeave);
                    }
    
                    return newEntry;
                }  else {
                    throw new Error('Employer name missing');
                }
                break;
            default: 
                throw new Error(`Incorrect entry type: ${JSON.stringify(entry)}`);
         }
    }
      
    throw new Error(`Incorrect data: fields missing: ${JSON.stringify(entry)}`);    
};

export default toNewPatientEntry;