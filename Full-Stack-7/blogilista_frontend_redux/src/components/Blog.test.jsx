import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog tests', () => {
    let mockHandler

    beforeEach(() => {
        mockHandler = vi.fn()

        const testBlog = (modHandler) => {
            const removeHandler = vi.fn()
            const modifyHandler = modHandler ? modHandler : vi.fn()
            const adder = {}

            return (
                <Blog
                    adder={adder}
                    title="Component testing is done with react-testing-library"
                    author="Jollekalle"
                    url="jollensivut.com"
                    likes={3555}
                    id="1"
                    modifyHandler={modifyHandler}
                    removeHandler={removeHandler}
                />
            )
        }

        render(testBlog(mockHandler))
    })

    test('renders title but not author, url nor likes ', () => {
        const title = screen.getByText(
            'Component testing is done with react-testing-library'
        )
        const author = screen.queryByText('Jollekalle')
        const url = screen.queryByText('jollensivut.com')
        const likes = screen.queryByText('+3555')

        expect(title).toBeDefined()
        expect(author).toBeNull()
        expect(url).toBeNull()
        expect(likes).toBeNull()
    })

    test('renders all content if details button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('details...')

        await user.click(button)

        const title = screen.getByText(
            'Component testing is done with react-testing-library'
        )
        const author = screen.getByText('Jollekalle')
        const url = screen.getByText('jollensivut.com')
        const likes = screen.getByText('+3555')

        expect(title).toBeDefined()
        expect(author).toBeDefined()
        expect(url).toBeDefined()
        expect(likes).toBeDefined()
    })

    test('modify handler is called twice and likes are increased by two if like button is clicked twice', async () => {
        const user = userEvent.setup()
        const detailsButton = screen.getByText('details...')

        await user.click(detailsButton)

        const likesButton = screen.getByText('like')

        await user.click(likesButton)
        await user.click(likesButton)

        const title = screen.getByText(
            'Component testing is done with react-testing-library'
        )
        const author = screen.getByText('Jollekalle')
        const url = screen.getByText('jollensivut.com')
        const likes = screen.getByText('+3557')

        expect(title).toBeDefined()
        expect(author).toBeDefined()
        expect(url).toBeDefined()
        expect(likes).toBeDefined()
        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})
