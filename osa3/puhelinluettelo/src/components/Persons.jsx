const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <ul>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />))}
    </ul>
  )
}


const Person = (props) => {
  return (
    <li>
      {props.person.name} {props.person.number}<button onClick={() => props.handleDelete(props.person.id)}>Poista</button>
    </li>
  )
}

export default Persons