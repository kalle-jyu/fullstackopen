import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Togglable />', () => {
  let container
  let likeFunction
  let user
  let blog

  beforeEach(() => {
    blog = {
      title: 'Testiotsikko',
      author: 'Kalervo Palsa',
      url: 'http://www.fi',
      likes: 0,
      user: {
        id: 'awnvljn',
        username: 'jakke',
        name: 'Jarmo Köyhä'
      }
    }

    user = userEvent.setup()

    likeFunction = vi.fn()

    container = render(
      <Blog blog={blog} like={likeFunction} />
    ).container
  })

  test('clicking show reveals a blog', () => {

    const title = screen.getByText(blog.title)
    const author = screen.getByText(blog.author)

    expect(title).toBeDefined()
    expect(author).toBeDefined()

  })

  test('renders title and author when show button is pressed', async () => { 
    const showButton = screen.getByText('show')
    await user.click(showButton)
    const title = screen.getByText(blog.title)
    const author = screen.getByText(blog.author)
    const url = screen.getByText(blog.url)
    const likes = screen.getByText(`likes ${blog.likes}`)
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()


  })

  test('clicking the like button twice calls event handler twice', async () => {
    const showButton = screen.getByText('show')
    await user.click(showButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(likeFunction.mock.calls).toHaveLength(2)
  })

})