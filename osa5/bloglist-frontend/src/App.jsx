import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in ', username)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('logging out ', username)
    window.localStorage.removeItem(
      'loggedBlogAppUser'
    )
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = (event) => {
    event.preventDefault()
    console.log('lisätään blogi')
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    console.log(blogObject)
    blogService
      .create(blogObject)
      .then(response => {
        setBlogs(blogs.concat(response))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setSuccessMessage(`A new blog '${response.title}' by ${response.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(response => {
        setErrorMessage('tapahtui virhe')
      })
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} success={false} />
        <Notification message={successMessage} success={true} />
        <h2>Log in to application</h2>
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      </div>)
  }

  return (
    <div>
      <Notification message={errorMessage} success={false} />
      <Notification message={successMessage} success={true} />
      <p>{user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <BlogForm
        createFunction={addBlog}
        newTitle={newTitle}
        titleHandler={handleTitleChange}
        newAuthor={newAuthor}
        authorHandler={handleAuthorChange}
        newUrl={newUrl}
        urlHandler={handleUrlChange}
      />
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
