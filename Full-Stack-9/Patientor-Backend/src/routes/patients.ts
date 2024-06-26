import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { parseEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }

});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedPatient = patientService.addPatient(newPatientEntry);
    
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMsg = 'Failed to add patient';
    if (error instanceof Error) {
      errorMsg += ' Error: ' + error.message;
    }
    res.status(400).send(errorMsg);
  }
});

router.post('/:id', (req, res) => {
  try {
    const newEntry = parseEntry(req.body);

    const addedEntry = patientService.addEntry(newEntry, req.params.id);

    if (addedEntry === undefined) {
      res.sendStatus(404);
    }
    else {  
      res.json(addedEntry);
    }
  } catch (error: unknown) {
    let errorMsg = 'Failed to add entry';
    if (error instanceof Error) {
      errorMsg += ' Error: ' + error.message;
    }
    res.status(400).send(errorMsg);
  }
});

export default router;