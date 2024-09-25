const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithOneBlogNoLikes = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('total likes is sum of the likes on array of blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('Likes of an empty list of blogs is 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('Likes of a blog without like field is 0', () => {
    const result = listHelper.totalLikes(listWithOneBlogNoLikes)
    assert.strictEqual(result, 0)
  })

})

describe('favorite blog', () => {

  test(`A blog with most likes is '${blogs[2].title}'`, () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })

})

describe('most blogs', () => {

  test(`Author with most blogs is 'Robert C. Martin', 3`, () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 })
  })

  test(`Should return author of single blog and count of 1`, () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {author: "Edsger W. Dijkstra", blogs: 1} )
  })

  test('Should return null if blogs is an empty array', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('Should return null if blogs is not an array', () => {
    assert.strictEqual(listHelper.mostBlogs(null), null);
    assert.strictEqual(listHelper.mostBlogs({}), null);
    assert.strictEqual(listHelper.mostBlogs(123), null);
    assert.strictEqual(listHelper.mostBlogs("string"), null);
  });
})

describe('most likes', () => {

  test(`Author with most likes is 'Edsger W. Dijkstra', 17`, () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 })
  })

  test(`Should return author and likes of single blog`, () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {author: "Edsger W. Dijkstra", likes: 5} )
  })

  test('Should return null if blogs is an empty array', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('Should return null if blogs is not an array', () => {
    assert.strictEqual(listHelper.mostLikes(null), null);
    assert.strictEqual(listHelper.mostLikes({}), null);
    assert.strictEqual(listHelper.mostLikes(123), null);
    assert.strictEqual(listHelper.mostLikes("string"), null);
  });

  test('should handle missing likes property as zero', () => {
    const result = listHelper.mostLikes(listWithOneBlogNoLikes);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 0 });
  });

})