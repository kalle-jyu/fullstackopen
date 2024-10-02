const BlogForm = (props) => {
  console.log(props)
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={props.createFunction}>
        <div>
          <label>title:</label>
          <input
            value={props.newTitle}
            onChange={props.titleHandler} />
          <br />
          <label>author:</label>
          <input
            value={props.newAuthor}
            onChange={props.authorHandler} />
          <br />
          <label>url:</label>
          <input
            value={props.newUrl}
            onChange={props.urlHandler} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm