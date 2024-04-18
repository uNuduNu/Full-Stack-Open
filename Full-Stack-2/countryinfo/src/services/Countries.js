import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api' 

const getAllCountries = () => {
    const promise = axios.get(`${baseUrl}/all`)
    return promise.then(response => response.data)
}


const getWeather = (latlng) => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latlng[0]}&longitude=${latlng[1]}&current=temperature_2m,wind_speed_10m`
    const promise = axios.get(`${weatherUrl}`) 
    return promise.then(response => response.data)
}

export default { getAllCountries, getWeather }