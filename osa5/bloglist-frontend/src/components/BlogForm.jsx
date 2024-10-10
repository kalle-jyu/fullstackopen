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
            data-testid='title'
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='title'
          />
          <br />
          <label>author:</label>
          <input
            data-testid='author'
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='author'
          />
          <br />
          <label>url:</label>
          <input
            data-testid='url'
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='url'
          />
        </div>
        <div>
          <button name="create blog" type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm