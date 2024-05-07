import diagnosisData from '../../data/diagnoses';
import { DiagnosisEntry } from '../types';

const getEntries = (): DiagnosisEntry[] => {
  return diagnosisData;
};

const addPatient = () => {
  return null;
};

export default {
  getEntries,
  addPatient
};