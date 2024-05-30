import { useState, SyntheticEvent } from "react";
import { Box, Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { EntryFormValues, HealthCheckRating, Diagnosis, Discharge, SickLeave} from "../../types";

interface HealthCheckRatingOption {
    value: HealthCheckRating;
    label: string;
}
  
const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.keys(HealthCheckRating).filter(k => typeof HealthCheckRating[k] === 'number').map(k => ({
        value: HealthCheckRating[k], label: k.toString()
}));

interface Props {
    onSubmit: (values: EntryFormValues) => void;
    diagnosesCodes: Array<Diagnosis['code']>;
}

interface EntryTypeOption {
    value: string;
    label: string;
}

const entryTypeOptions: EntryTypeOption[] = [
    { value: 'HealthCheck', label: 'HealthCheck'},
    { value: 'OccupationalHealthcare', label: 'OccupationalHealthcare' }, 
    { value: 'Hospital', label: 'Hospital' }
];

const AddEntryForm = ({ onSubmit, diagnosesCodes }: Props ) => {
    const [type, setType] = useState('HealthCheck');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [specialist, setSpecialist] = useState<string>('');
    const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
    const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
    const [employerName, setEmployerName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dischargeDate, setDischargeDate] = useState<string>('');
    const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

    const diagnosesOptions: EntryTypeOption[] = Object.values(diagnosesCodes).map(c => ({ value:c, label:c })); 

    const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        if ( typeof event.target.value === "string") {
          const value = event.target.value;
          if (value !== null && value !== undefined && typeof value === 'string') {
            setType(value);
          }
        }
    };

    const onDiagnosisCodesChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        if ( typeof event.target.value === "object" && Array.isArray(event.target.value)) {
            setDiagnosisCodes(event.target.value);
        }
    };

    const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        if ( typeof event.target.value === "number") {
          const value = event.target.value;
          const healthCheckRating = Object.values(HealthCheckRating).find(g => g === value);
          
          if (healthCheckRating !== null && healthCheckRating !== undefined && typeof healthCheckRating !== 'string') {
            setHealthCheckRating(healthCheckRating);
          }
        }
    };
    
    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();

        switch (type) {
            case 'HealthCheck':
                onSubmit({ type, description, date, specialist, healthCheckRating });
                break;
            case 'Hospital':
                const discharge: Discharge = {
                    date: dischargeDate,
                    criteria: dischargeCriteria
                };

                onSubmit({ type, description, date, specialist, diagnosisCodes, discharge });
                break;
            case 'OccupationalHealthcare':
                if ( startDate !== '' && endDate !== '' ) {
                    const sickLeave: SickLeave = {
                        startDate: startDate,
                        endDate: endDate
                    };

                    onSubmit({ type, description, date, specialist, diagnosisCodes, employerName, sickLeave });
                } else {
                    onSubmit({ type, description, date, specialist, diagnosisCodes, employerName });
                }
                break;
            default:
                throw new Error("Unknown entry type");
                
        }

        reset();
    };

    const reset = () => {
        setType('HealthCheck');
        setDescription('');
        setDate('');
        setSpecialist('');
        setHealthCheckRating(HealthCheckRating.Healthy);
        setDiagnosisCodes([]);
        setEmployerName('');
        setStartDate('');
        setEndDate('');
        setDischargeDate('');
        setDischargeCriteria('');
    };

    const onCancel = () => {
        reset();
    };

    return (
        <Box sx={{ p: 1, border: '1px dashed black', borderRadius: 1}}>
            <h3>New Entry</h3>
            <form onSubmit={addEntry}>
                <TextField
                    sx={{ paddingBottom: 1}}
                    label="Description"
                    fullWidth 
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
                <TextField
                    sx={{ paddingBottom: 1}}
                    type="date"
                    fullWidth 
                    value={date}
                    onChange={({ target }) => setDate(target.value)}
                />
                <TextField
                    sx={{ paddingBottom: 1}}
                    label="Specialist"
                    fullWidth 
                    value={specialist}
                    onChange={({ target }) => setSpecialist(target.value)}
                />
                <InputLabel style={{ marginTop: 10 }}>Entry type</InputLabel>
                <Select
                    label="Entry type"
                    fullWidth
                    value={type}
                    onChange={onEntryTypeChange}
                >
                    {entryTypeOptions.map(option =>
                        <MenuItem
                            key={option.label}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                    )}
                </Select>
                { type === 'HealthCheck' && <InputLabel style={{ marginTop: 10 }}>Healthcheck rating</InputLabel> }
                { type === 'HealthCheck' && <Select
                    label="Healthcheck rating"
                    fullWidth
                    value={healthCheckRating}
                    onChange={onHealthCheckRatingChange}
                >
                    {healthCheckRatingOptions.map(option =>
                        <MenuItem
                            key={option.label}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                    )}
                </Select> }
                { type !== 'HealthCheck' && <InputLabel style={{ marginTop: 10 }}>Diagnosis codes</InputLabel> }
                { type !== 'HealthCheck' && <Select
                    multiple
                    label="Diagnosis codes"
                    fullWidth 
                    value={diagnosisCodes}
                    onChange={onDiagnosisCodesChange}
                >
                    {diagnosesOptions.map(option =>
                        <MenuItem
                            key={option.label}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                    )}
                </Select> }
                { type === 'OccupationalHealthcare' && <TextField
                    sx={{ paddingBottom: 1, paddingTop: 1}}
                    label="Employer"
                    fullWidth 
                    value={employerName}
                    onChange={({ target }) => setEmployerName(target.value)}
                />}
                { type === 'OccupationalHealthcare' && <InputLabel style={{ marginTop: 10 }}>Sickleave start</InputLabel> }
                { type === 'OccupationalHealthcare' && <TextField
                    sx={{ paddingBottom: 1}}
                    type="date"
                    fullWidth 
                    value={startDate}
                    onChange={({ target }) => setStartDate(target.value)}
                />}
                { type === 'OccupationalHealthcare' && <InputLabel style={{ marginTop: 10 }}>Sickleave end</InputLabel> }
                { type === 'OccupationalHealthcare' && <TextField
                    sx={{ paddingBottom: 1}}
                    type="date"
                    fullWidth 
                    value={endDate}
                    onChange={({ target }) => setEndDate(target.value)}
                />}
                { type === 'Hospital' && <InputLabel style={{ marginTop: 10 }}>Discharge</InputLabel> }
                { type === 'Hospital' && <TextField
                    sx={{ paddingBottom: 1}}
                    type="date"
                    fullWidth 
                    value={dischargeDate}
                    onChange={({ target }) => setDischargeDate(target.value)}
                />}
                { type === 'Hospital' && <TextField
                    sx={{ paddingBottom: 1, paddingTop: 1}}
                    label="Discharge criteria"
                    fullWidth 
                    value={dischargeCriteria}
                    onChange={({ target }) => setDischargeCriteria(target.value)}
                />}
                <Button
                    color="secondary"
                    variant="contained"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    style={{
                        float: "right",
                    }}
                    type="submit"
                    variant="contained"
                >
                    Add
                </Button>
            </form>
        </Box>
    );
};

export default AddEntryForm;