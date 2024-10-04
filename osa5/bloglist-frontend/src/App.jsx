import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable.jsx'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm.jsx'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll()
      .then((blogs) => {
        setBlogs(blogs)
      }
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

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

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(response => {
        setBlogs(blogs.concat(response))
        setSuccessMessage(`A new blog '${response.title}' by ${response.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(response => {
        setErrorMessage('tapahtui virhe')
      })
  }

  const addLike = (blogObject) => {
    blogObject.likes++
    blogService
      .update(blogObject.id, blogObject)
      .then(response => {
        response.user = blogObject.user
        setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : response))
      })
      .catch(response => {
        setErrorMessage('tapahtui virhe')
      })
  }

  const removeBlog = (blog) => {
    if (confirm(`Remove ${blog.name} by ${blog.author}?`)) {
      const id = blog.id
      blogService
        .remove(id)
        .then(response => {
          setBlogs(blogs.filter(b => b.id !== id))
        })
        .catch(response => {
          setErrorMessage('Poistossa tapahtui virhe.')
        })
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} success={false} />
        <Notification message={successMessage} success={true} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div >)
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
      <Togglable buttonLabel="new blog">
        <BlogForm
          createblog={addBlog}
        />
      </Togglable>

      <h2>Blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} like={addLike} removeBlog={removeBlog} user={user}
        />
      )}
    </div>
  )
}

export default App
