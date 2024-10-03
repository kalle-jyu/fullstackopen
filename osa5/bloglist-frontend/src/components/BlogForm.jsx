import { useState } from 'react'

const BlogForm = ({ createblog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createblog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>title:</label>
          <input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)} />
          <br />
          <label>author:</label>
          <input
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)} />
          <br />
          <label>url:</label>
          <input
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm