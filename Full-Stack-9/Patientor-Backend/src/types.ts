export interface BaseEntry {
    id: string,
    description: string,
    date: string,
    specialist: string
    diagnosisCodes?: Array<Diagnosis['code']>
}

export interface SickLeave {
    startDate: string,
    endDate: string
}

interface OccupationalHealthcareEntry extends BaseEntry{
    type: "OccupationalHealthcare";
    employerName: string,
    sickLeave?: SickLeave
}

export interface Discharge {
    date: string,
    criteria: string
}

interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: Discharge
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}
  
interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export type Entry = 
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;

export interface PatientEntry {
    id: string,
    name: string,
    dateOfBirth: string,
    ssn: string,
    gender: Gender,
    occupation: string,
    entries: Entry[]
}

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other'
}

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export type NewEntry = UnionOmit<Entry, 'id'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;
export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;

export interface Diagnosis {
    code: string,
    name: string,
    latin?: string
}

