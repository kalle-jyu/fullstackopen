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
        <span className='blog-title'>{blog.title}</span> <span className="blog-author">{blog.author}</span> <button onClick={toggleViev}>hide</button><br />
        <span className='blog-url'>{blog.url}</span><br />
        <span className='blog-likes'>likes {blog.likes}</span><button className='like-button' onClick={() => { like(blog) }}>like</button><br />
        <span>{blog.user.name}</span><br />
        <button style={{ display: user && blog.user.id.toString() === user.id.toString() ? '' : 'none' }} onClick={() => { removeBlog(blog) }}>remove</button>
      </div>
    )
  } else {
    return (
      <div>
        <span className='blog-title'>{blog.title}</span> <span className='blog-author'>{blog.author}</span>
        <button onClick={toggleViev}>show</button>
      </div>
    )
  }
}

export default Blog