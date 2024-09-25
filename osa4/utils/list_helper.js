const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map((blog) => blog.likes ? blog.likes : 0)
  return likes.reduce((a, b) => a + b, 0);
}

const favoriteBlog = (blogs) => {
  const max = blogs.reduce((prev, current) => {
    return (prev && prev.likes > current.likes) ? prev : current
  })
  return max
}

const mostBlogs = (blogs) => {

  if(!Array.isArray(blogs) || blogs.length === 0) {
    console.log("not an array or empty array")
    return null
  }

  const names = blogs.map(blog => blog.author)
  const uniqueNames = [...new Set(names)]
  const counts = new Array(uniqueNames.length).fill(0)

  for (let i = 0; i < names.length; i++) {
    const index = uniqueNames.indexOf(names[i]);
    counts[index]++;
  }

  const maxValue = Math.max(...counts);
  const indexOfMax = counts.indexOf(maxValue);
  return {
    author: uniqueNames[indexOfMax],
    blogs: maxValue
  }
}

const mostLikes = (blogs) => {

  if(!Array.isArray(blogs) || blogs.length === 0) {
    console.log("not an array or empty array")
    return null
  }

  const names = blogs.map(blog => blog.author)
  const uniqueNames = [...new Set(names)]
  const counts = new Array(uniqueNames.length).fill(0)

  for (let i = 0; i < blogs.length; i++) {
    const index = uniqueNames.indexOf(names[i]);
    counts[index] += blogs[i].likes ? blogs[i].likes : 0
  }

  const maxValue = Math.max(...counts);
  const indexOfMax = counts.indexOf(maxValue);
  return {
    author: uniqueNames[indexOfMax],
    likes: maxValue
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}