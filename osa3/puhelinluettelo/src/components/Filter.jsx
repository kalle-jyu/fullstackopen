const Filter = ({filter, handler}) => {

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