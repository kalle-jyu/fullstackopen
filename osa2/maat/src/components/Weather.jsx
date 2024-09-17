import axios from 'axios'
import { useState, useEffect } from 'react'

const Weather = ({country}) => {

  const [weather, setWeather] = useState(null)

  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const lat = country.latlng[0]
  const lng = country.latlng[1]
  const apikey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    console.log('fetching weather...')
    axios
    .get(`${baseUrl}?lat=${lat}&lon=${lng}&appid=${apikey}&units=metric`)
    .then(response => {
      setWeather(response.data)
    })
  }, [])

  if(weather !== null) {
    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    console.log(icon)
    return (
      <div>
        <h1>Weather</h1>
        <p>temperature {weather.main.temp} Celsius</p>'
        <p><img src={icon} /></p>
        <p>wind {weather.wind.speed} m/s</p>

      </div>
    )
  } else {
    return (
      <div>
        <h1>Weather</h1>
      </div>
    )
  }

}

export default Weather