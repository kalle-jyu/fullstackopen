import CountryItem from "./CountryItem";
import Country from "./Country";

const Countries = ({countries, searchstr, handleView, viewCountry}) => {

  if(searchstr === '' || countries.length === 0) {
    return null
  }

  const filtered = countries.filter(country =>
    country.name.common.toUpperCase().includes(searchstr.toUpperCase())
  );

  console.log('suodatuksen tulos (kpl) :', filtered.length)

  if (viewCountry !== null) {
    return (
      <Country country={viewCountry} />
    );
  }

  if(filtered.length < 1) {
    return (
      <div>No matches</div>
    )
  } else if (filtered.length > 10) {
    return(
      <div>Too many matches, specify another filter</div>
    )
  } else if (filtered.length === 1) {
    return(
      <Country country={filtered[0]} />
    )
  } else {
    return (
      <ul>
        {filtered
          .map(country => (
            <CountryItem
              key={country.name.common}
              clickFunction={handleView}
              country={country}
            />
          ))}
      </ul>
    );
  }

}

export default Countries