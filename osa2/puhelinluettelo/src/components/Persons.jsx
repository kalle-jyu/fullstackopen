const Persons = ({ persons, filter }) => {
  return (
    <ul>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => (
        <Person key={person.name} person={person} />))}
    </ul>
  )
}


const Person = (props) => {

  return (
    <li>
      {props.person.name} {props.person.number}
    </li>
  )
}

export default Persons