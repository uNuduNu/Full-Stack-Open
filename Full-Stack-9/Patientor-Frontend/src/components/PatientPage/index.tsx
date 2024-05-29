import { Patient, Gender, Entry, HealthCheckRating, Diagnosis, SickLeave, Discharge } from "../../types";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import { Box } from "@mui/material";
import { MedicalInformation, Work, LocalHospital, Favorite } from "@mui/icons-material";

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
            return <OccupationalHealthcareEntry entry={entry} employer={entry.employerName} diagnosesCodes={entry.diagnosisCodes} diagnoses={diagnoses}/>;
        default:
            throw new Error(`Unhandled entry ${JSON.stringify(entry)}`);
    }
};

const PatientPage = ({ id, diagnoses }: Props ) => {
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect( () => {
        const fetchPatient = async (id: string) => {
          setPatient(await patientService.getPatient(id));
        };
    
        if (id !== undefined) {
          fetchPatient(id);
        } else {
          setPatient(null);
        }
        
      }, []);

    if (patient === null) {
        return (
            <div></div>
        );
    }

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
            <h3>entries</h3>
            {patient.entries.map((e: Entry) => (
                <PatientEntry diagnoses={diagnoses} entry={e} key={e.id}/>
            ))}
        </div>
    );
};

export default PatientPage;

