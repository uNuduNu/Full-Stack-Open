import patientData from '../../data/patients';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry } from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): NonSensitivePatientEntry[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (entry: NewPatientEntry) : PatientEntry => {

  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patientData.push(newPatientEntry);

  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const patientEntry = patientData.find(p => p.id === id);
  return patientEntry;
};

export default {
  getEntries,
  findById,
  addPatient
};