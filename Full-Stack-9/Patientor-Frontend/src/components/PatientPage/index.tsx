import { Patient, Gender } from "../../types";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";

interface Props {
    id : string | undefined
}

const PatientPage = ({ id }: Props ) => {
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
        </div>
    );
};

export default PatientPage;

