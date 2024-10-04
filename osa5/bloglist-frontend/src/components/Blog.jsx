import { useState } from 'react'

const Blog = ({ blog, like, removeBlog, user }) => {
  const [showFull, setShowFull] = useState(false)

  const toggleViev = () => {
    setShowFull(!showFull)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showFull) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={toggleViev}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes}<button onClick={() => { like(blog) }}>like</button><br />
        {blog.user.name}<br />
        <button style={{ display: blog.user.toString() === user.id.toString()? 'none' : '' }} onClick={() => { removeBlog(blog) }}>remove</button>
      </div>
    )
  } else {
    return (
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleViev}>show</button>
      </div>
    )
  }
}

export default Blog