import { render, screen } from '@testing-library/react'
import AddBlog from './AddBlog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

describe('AddBlog form tests', () => {
    test('correct values are passed to the callback when add is clicked', async () => {
        const blog = { title: 'blogTitle', author: 'blogAuthor', url: 'blogurl.com', likes: '345' }

        const user = userEvent.setup()
        const createBlog = vi.fn()

        render(<AddBlog createBlog={createBlog}/>)

        const titleInput = screen.getByPlaceholderText('title')
        const authorInput = screen.getByPlaceholderText('author')
        const urlInput = screen.getByPlaceholderText('url')
        const likesInput = screen.getByPlaceholderText('likes')
        const submitButton = screen.getByText('add')

        await user.type(titleInput, blog.title)
        await user.type(authorInput, blog.author)
        await user.type(urlInput, blog.url)
        await user.type(likesInput, blog.likes)

        await user.click(submitButton)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].title).toBe('blogTitle')
        expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
        expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
        expect(createBlog.mock.calls[0][0].likes).toBe(blog.likes)
    })
})