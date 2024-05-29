import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";
import { Diagnosis } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";

import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patientsList = await patientService.getAll();
      setPatients(patientsList);
    };

    void fetchPatientList();

    const fetchDiagnoses = async () => {
      const diagnosisList = await diagnosisService.getAll();
      setDiagnoses(diagnosisList);
    };

    void fetchDiagnoses();
  }, []);

  const match = useMatch('/patients/:id');
  
  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
          <Route path="/patients/:id" element={<PatientPage id={match?.params.id} diagnoses={diagnoses}/>}/>
        </Routes>
      </Container>
    </div>
  );
};

export default App;
