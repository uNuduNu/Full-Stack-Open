import patientData from '../../data/patients';
import { NonSensitivePatientEntry } from '../types';

const getEntries = (): NonSensitivePatientEntry[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  addPatient
};