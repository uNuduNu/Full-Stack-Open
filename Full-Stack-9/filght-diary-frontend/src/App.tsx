import { NonSensitiveDiaryEntry, Weather, Visibility } from './types'
import { useEffect, useState } from 'react'
import { getAllEntries, createEntry } from './diaryService';
import Select from 'react-select'
import axios from 'axios';

const DiaryEntry = ({ entry }: { entry: NonSensitiveDiaryEntry}) => {

  return (
    <div>
      <h2>{entry.date}</h2>
      <p>visibility: {entry.visibility}</p>
      <p>weather: {entry.weather}</p>
    </div>
  )
}

const Diary = ({ entries }: { entries: NonSensitiveDiaryEntry[]}) => {
  return (
    <div>
      <h1>Diary entries</h1>
      {entries.map(entry => <DiaryEntry key={entry.id} entry={entry}/>)}
    </div>
  )
}


const AddEntry = ({ setNewEntry }) => {
  const [date, setDate] = useState('')
  const [visibility, setVisibility] = useState({ value: Visibility.Ok, label: 'Ok' })
  const [weather, setWeather] = useState({ value: Weather.Sunny, label: 'Sunny' })
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const VisibilityOptions = [
    { value: Visibility.Great, label: 'Great'},
    { value: Visibility.Good, label: 'Good'},
    { value: Visibility.Ok, label: 'Ok'},
    { value: Visibility.Poor, label: 'Poor'},
  ];

  const WeatherOptions = [
    { value: Weather.Sunny, label: 'Sunny'},
    { value: Weather.Rainy, label: 'Rainy'},
    { value: Weather.Cloudy, label: 'Cloudy'},
    { value: Weather.Stormy, label: 'Stormy'},
    { value: Weather.Windy, label: 'Windy'},
  ]; 

  const entryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      date: date,
      visibility: visibility.value,
      weather: weather.value,
      comment: comment
    }

    createEntry(newEntry)
      .then(data => {
        setNewEntry(data);

        setDate('')
        setComment('')
      })
      .catch(error => {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data);
          setTimeout(() => { 
            setError('')
          }, 2000)
        }
        else {
          setError('Unknown error');
          setTimeout(() => { 
            setError('')
          }, 2000)
        }
      })
  }

  const showError = () => {
    const errorStyle = {
      color: 'red'
    }

    return (
      <div style={errorStyle}>
        {error}
      </div>
    )
  }

  return (
    <form onSubmit={entryCreation}>
      { error !== '' && showError() }
      <div>
        date <input type='date' value={date} onChange={(event) => setDate(event.target.value)}/>
        <Select defaultValue={visibility} onChange={setVisibility} options={VisibilityOptions}/>
        <Select defaultValue={weather} onChange={setWeather} options={WeatherOptions}/>
        comment <input value={comment} onChange={(event) => setComment(event.target.value)}/>
      </div>
      <button type='submit'>add</button>
    </form>
  )
}

function App() {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then(data => { setEntries(data)} )
  }, [])

  const setNewEntry = (entry: NonSensitiveDiaryEntry) => {
    setEntries(entries.concat(entry))
  }
 
  return (
    <>
    <AddEntry setNewEntry={setNewEntry}/>
    <Diary entries={entries}/>
    </>
  )
}

export default App
