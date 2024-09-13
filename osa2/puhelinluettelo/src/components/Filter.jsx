const Filter = ({filter, handler}) => {

  console.log(filter)
  console.log(handler)

  return (
    <div>
      <label>shown with</label>
      <input
        value={filter}
        onChange={handler} />
    </div>
  )
}

export default Filter