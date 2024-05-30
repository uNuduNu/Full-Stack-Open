import { Patient, Gender, Entry, HealthCheckRating, Diagnosis, SickLeave, Discharge, EntryFormValues } from "../../types";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import { Alert, Box } from "@mui/material";
import { MedicalInformation, Work, LocalHospital, Favorite } from "@mui/icons-material";
import AddEntryForm from "./AddEntryForm";
import axios from "axios";

interface Props {
    diagnoses: Diagnosis[]
    id : string | undefined
}

interface HealthCheckProps {
    entry: Entry
    healthCheckRating: HealthCheckRating
}

interface OccupationalHealthcareProps {
    entry: Entry
    diagnosesCodes?: Array<Diagnosis['code']>
    diagnoses: Diagnosis[]
    employer: string
    sickLeave?: SickLeave
}

interface HospitalProps {
    entry: Entry
    diagnosesCodes?: Array<Diagnosis['code']>
    diagnoses: Diagnosis[]
    discharge: Discharge
}

interface PatientEntryProps {
    diagnoses: Diagnosis[]
    entry: Entry
}

const HealthCheck = ({ entry, healthCheckRating }: HealthCheckProps) => {
    let healthColor = "#00FF43";
    if (healthCheckRating === HealthCheckRating.LowRisk) {
        healthColor = "#F6FF0A";
    } else if (healthCheckRating === HealthCheckRating.HighRisk) {
        healthColor = "#FF3200";
    } else if (healthCheckRating === HealthCheckRating.CriticalRisk) {
        healthColor = "#000000";
    }

    return (
        <div>
            <Box sx={{ p: 2, border: '1px solid black', borderRadius: 1, marginBottom: 1}}>
                <div>
                    {entry.date} {<MedicalInformation fontSize="inherit" />}
                </div>
                <div>
                    <i>{entry.description}</i>
                </div>
                <div>
                    {<Favorite fontSize="inherit" htmlColor={healthColor}/>}
                </div>
                <div>
                    diagnose by {entry.specialist}
                </div>
            </Box>
        </div>
    );
};

const HospitalEntry = ({ entry, diagnoses, diagnosesCodes, discharge }: HospitalProps) => {
    return (
        <div>
            <Box sx={{ p: 2, border: '1px solid black', borderRadius: 1, marginBottom: 1}}>
                <div>
                    {entry.date} {<LocalHospital fontSize="inherit" />} 
                </div>
                <div>
                    <i>{entry.description}</i>
                </div>
                <p></p>
                <div>
                    diagnose by {entry.specialist}
                    {diagnosesCodes !== undefined && getDiagnosisList(diagnoses, diagnosesCodes)}
                    discharge {discharge.date} : {discharge.criteria}
                </div>
            </Box>
        </div>
    );
};

const getDiagnosisList = (diagnoses: Diagnosis[], diagnosesCodes: Array<Diagnosis['code']>) => {
    const getDiagnosisText = (code:string): string  => {
        const description = diagnoses.filter(d => d.code === code).pop()?.name;
        
        return description !== undefined ? `${code} ${description}`: code;
    };

    return (
        <ul>
            {diagnosesCodes.map((c: string) => (
                <li key={c}>{getDiagnosisText(c)}</li>
            ))}
        </ul>
    );
};

const OccupationalHealthcareEntry = ({ entry, diagnoses, diagnosesCodes, employer, sickLeave }: OccupationalHealthcareProps) => {
    const getSickLeave = () => {
        return (
            <div>
                Sickleave from {sickLeave?.startDate} to {sickLeave?.endDate}
            </div>
        );        
    };

    return (
        <div>
            <Box sx={{ p: 2, border: '1px solid black', borderRadius: 1, marginBottom: 1}}>
                <div>
                    {entry.date} {<Work fontSize="inherit" />} {employer}
                </div>
                <div>
                    <i>{entry.description}</i>
                </div>
                <p></p>
                <div>
                    diagnose by {entry.specialist}
                    {diagnosesCodes !== undefined && getDiagnosisList(diagnoses, diagnosesCodes)}
                </div>
                <div>
                    {sickLeave !== undefined && getSickLeave()}
                </div>
            </Box>
        </div>
    );
};

const PatientEntry = ({ entry, diagnoses }: PatientEntryProps) => {
    switch (entry.type) {
        case "HealthCheck":
            return <HealthCheck entry={entry} healthCheckRating={entry.healthCheckRating}/>;
        case "Hospital":
            return <HospitalEntry entry={entry} diagnoses={diagnoses} diagnosesCodes={entry.diagnosisCodes} discharge={entry.discharge}/>;
        case "OccupationalHealthcare":
            return <OccupationalHealthcareEntry entry={entry} employer={entry.employerName} diagnosesCodes={entry.diagnosisCodes} diagnoses={diagnoses} sickLeave={entry.sickLeave}/>;
        default:
            throw new Error(`Unhandled entry ${JSON.stringify(entry)}`);
    }
};

const PatientPage = ({ id, diagnoses }: Props ) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [error, setError] = useState<string>();

    useEffect( () => {
        const fetchPatient = async (id: string) => {
          setPatient(await patientService.getPatient(id));
        };
    
        if (id !== undefined) {
          fetchPatient(id);
        } else {
          setPatient(null);
        }
        
      }, [id]);

    if (patient === null) {
        return (
            <div></div>
        );
    }

    const submitNewEntry = async (values: EntryFormValues) => {
        if (id === undefined) {
            console.error('No patient id');

            return;
        }

        try {
            const entry = await patientService.createEntry(id, values);
            const modifiedPatient = {...patient};
            modifiedPatient.entries.push(entry);
            setPatient(modifiedPatient);

            setError('');
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (e?.response?.data && typeof e?.response?.data === "string") {
                    const message = e.response.data.replace('Something went wrong. Error: ', '');
                    console.error(message);
                    setError(message);
                } else {
                    setError("Unrecognized axios error");
                }
            } else {
                console.error("Unknown error", e);
                setError("Unknown error");
            }
        }

    };

    const gender = patient.gender === Gender.Female ? "Female" : patient.gender === Gender.Male ? "Male" : "Other";

    return (
        <div>
            <h2>{patient.name}</h2>
            <p></p>
            <div>
                {`gender: ${gender}`}
            </div>
            <div>
                {`ssn: ${patient.ssn ? patient.ssn : ""}`}
            </div>
            <div>
                {`dob: ${patient.dateOfBirth ? patient.dateOfBirth : ""}`}
            </div>
            <div>
                {`occupation: ${patient.occupation}`}
            </div>
            <p></p>
            {error && <Alert severity="error">{error}</Alert>}
            <AddEntryForm onSubmit={submitNewEntry} diagnosesCodes={diagnoses.map(d => d.code)}/>
            <h3>entries</h3>
            {patient.entries.map((e: Entry) => (
                <PatientEntry diagnoses={diagnoses} entry={e} key={e.id}/>
            ))}
        </div>
    );
};

export default PatientPage;

