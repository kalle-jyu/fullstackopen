const CountryItem = (props) => {
  return (
    <li>{props.country.name.common}
      <button value={props.country.name.common} onClick={props.clickFunction}>
        Show
      </button>
    </li>
  )
}

export default CountryItem