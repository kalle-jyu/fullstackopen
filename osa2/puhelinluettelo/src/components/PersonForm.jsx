const PersonForm = (props) => {
  console.log(props)
    return (
      <form onSubmit={props.addFunction}>
        <div>
          <label>Name:</label>
          <input
            value={props.newName}
            onChange={props.nameHandler} />
          <br />
          <label>Number:</label>
          <input
            value={props.newNumber}
            onChange={props.numberHandler } />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }
  
  export default PersonForm