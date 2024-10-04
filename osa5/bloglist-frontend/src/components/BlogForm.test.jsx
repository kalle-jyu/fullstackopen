import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls callback function with the right data', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const testData = {
    title: 'Testimokko',
    author: 'Testi Testinen',
    url: 'http://www.testi.fi'
  }

  render(<BlogForm createblog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('title')
  const inputAuthor = screen.getByPlaceholderText('author')
  const inputUrl = screen.getByPlaceholderText('url')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, testData.title)
  await user.type(inputAuthor, testData.author)
  await user.type(inputUrl, testData.url)

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(testData)

})