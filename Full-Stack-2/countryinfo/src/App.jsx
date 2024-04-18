import { useEffect, useState } from 'react'
import countryService from './services/Countries'

const Input = ({name, value, handler}) => <div>{name} <input value={value} onChange={handler}/></div>

const Weather = ({capital, weather}) => {
  if (weather === null) {
    return null
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {weather.current.temperature_2m} {weather.current_units.temperature_2m} </p>
      <p>Wind: {weather.current.wind_speed_10m} {weather.current_units.wind_speed_10m} </p>
    </div>
  )
}

const CountryDetails = ({country, weather}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.entries(country.languages).map(k => <li key={k[0]}>{k[1]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
      <Weather capital={country.capital} weather={weather}/>
    </div>
  )  
}

const CountryItem = ({name, filterHandler}) => {
  return <div>{name} <button onClick={() => filterHandler(name)}>show</button></div>
}

const Country = ({countries, filterHandler, weather}) => {
  if (countries !== null && countries.length < 11) {
    if (countries.length === 1) {
      return <CountryDetails country={countries[0]} weather={weather}/>
    }
    return (    
      <div>
        {countries.map(c => <CountryItem key={c.name.common} name={c.name.common} filterHandler={filterHandler}/>)}
      </div>
    )
  }

  return <p>Too many matches</p>
}

const StatusMessage = ({text, success}) => {
  if (text === null) {
    return null
  }

  const messageStyle = {
    color: success ? 'black' : 'red',
    backgroundColor: success ? 'lightgreen' : 'white',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: success ? 1 : 5,
    padding: 5
  }

  return <div style={messageStyle}>{text}</div>
}

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState([]) 
  const [message, setMessage] = useState(null)
  const [messageStatus, setMessageStatus] = useState(true)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAllCountries()
    .then(c => setCountries(c))
    .catch(error => showMessage('Failed to get countries from server', error))
  }, [])

  useEffect(() => {
    if (filteredCountries != null && filteredCountries.length === 1) {
      countryService.getWeather(filteredCountries[0].capitalInfo.latlng)
      .then(w => setWeather(w))
      .catch(error => showMessage('Failed to get weather from server', error))
    }
    else {
      setWeather(null)
    }
  }, [countryFilter])

  const showMessage = (text, error) => {
    if (error !== null)
      console.log(error)

    setMessage(text)
    setMessageStatus(error === null)

    setTimeout(() => { 
      setMessage(null)
    }, 5000)
  }
 
  const countryFilterChanged = (event) => {
    setCountryFilter(event.target.value)
  }

  const filteredCountries = countryFilter.length === 0 ? null : countries.filter(c => c.name.common.toLowerCase().includes(countryFilter.toLowerCase()) || c.name.official.toLowerCase().includes(countryFilter.toLowerCase()))
 
  return (
    <div>
      <StatusMessage text={message} success={messageStatus}/>
      <Input name="Find countries: " value={countryFilter} handler={countryFilterChanged}/>
      <Country countries={filteredCountries} weather={weather} filterHandler={setCountryFilter}/>
    </div>
  )
}

export default App
