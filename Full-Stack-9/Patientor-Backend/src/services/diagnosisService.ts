import diagnosisData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => {
  return diagnosisData;
};

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  addPatient
};