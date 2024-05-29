import patientData from '../../data/patients';
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): NonSensitivePatientEntry[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id, name, dateOfBirth, gender, occupation, entries
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {

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

const addEntry = (entry: NewEntry, patientId: string): Entry | undefined => {
  const patient = findById(patientId);

  if (patient) {
    const newEntry = {
      id: uuid(),
      ...entry
    };

    patient.entries.push(newEntry);

    return newEntry;
  }

  return undefined;
};

export default {
  getEntries,
  findById,
  addPatient,
  addEntry
};