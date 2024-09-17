import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
const App = () => {
  const [countries, setCountries] = useState([])
  const [searchstr, setSearchstr] = useState('')
  const [viewCountry, setViewCountry] = useState(null);

  const handleChange = (event) => {
    console.log('value:', event.target.value)
    setSearchstr(event.target.value)
    setViewCountry(null)
  }

  const handleView = event => {
    event.preventDefault()
    console.log(event.target.value);
    const clickedCountry = countries.filter(country =>
      country.name.common === event.target.value
    );
    setViewCountry(clickedCountry[0]);
  };

  useEffect(() => {
    console.log('fetching countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <form>
        find countries: <input value={searchstr} onChange={handleChange} />
      </form>
      <Countries countries={countries} searchstr={searchstr} handleView={handleView} viewCountry={viewCountry} />
    </div>
  )
}

export default App