const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('api/users', {
      data: {
        name: 'first last',
        username: 'firstLast',
        password: 'rthrejhn5erjn'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'second last',
        username: 'secondLast',
        password: 'rthrerewern'
      }
    })

    await page.goto('/')
  })

  test('login screen is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name:'Login'})).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      await loginWith(page, 'firstLast', 'rthrejhn5erjn')

      await expect(page.getByText('logged in as firstLast')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({page}) => {
      await loginWith(page, 'firstLast', 'rthrejrjn')
  
      await expect(page.getByRole('heading', { name:'Login'})).toBeVisible()
      await expect(page.getByText('username')).toBeVisible()
      await expect(page.getByText('password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'firstLast', 'rthrejhn5erjn')

      await expect(page.getByText('logged in as firstLast')).toBeVisible()
    })

    test('a new blog can be created', async ({page}) => {
      await addBlog(page, 'blog title', 'blog author', 'blog.com', '344')

      await expect(page.getByText('blog title')).toBeVisible()
    })

    describe('when a blog has been created', () => {
      beforeEach(async ({page}) => {
        await addBlog(page, 'blog title', 'blog author', 'blog.com', '344')
  
        await expect(page.getByText('blog title')).toBeVisible()
      })

      test('blog can be liked', async ({page}) => {
        await page.getByTestId('details').click()

        await page.getByTestId('likebutton').click()

        await expect(page.getByText('+345')).toBeVisible()
      })

      test('blog can be removed by the user who added it', async ({page}) => {
        page.on('dialog', dialog => dialog.accept())

        await page.getByTestId('delete').click()

        await expect(page.getByText('blog title')).not.toBeVisible()
      })

      test('remove button is not visible if blog added by another user', async ({page}) => {
        await page.getByTestId('logout').click()

        await loginWith(page, 'secondLast', 'rthrerewern')
  
        await expect(page.getByText('logged in as secondLast')).toBeVisible()

        await expect(page.getByText('blog title')).toBeVisible()
        await expect(await page.getByTestId('delete')).not.toBeVisible()
      })
    })

    describe('when multiple blogs have been created', () => {
      beforeEach(async ({page}) => {
        for (let i = 0; i < 10; i++) {
          await addBlog(page, 'blog ' + i.toString(), 'blog author', 'blog.com', i.toString())
    
          await expect(page.getByText('blog ' + i.toString())).toBeVisible()
        }
      })

      test('blogs are sorted by likes', async ({page}) => {
        const blogTitles = await page.getByTestId('titlediv').all()

        await expect(blogTitles[0]).toHaveText('blog 9')
        await expect(blogTitles[1]).toHaveText('blog 8')
        await expect(blogTitles[2]).toHaveText('blog 7')
        await expect(blogTitles[3]).toHaveText('blog 6')
        await expect(blogTitles[4]).toHaveText('blog 5')
        await expect(blogTitles[5]).toHaveText('blog 4')
        await expect(blogTitles[6]).toHaveText('blog 3')
        await expect(blogTitles[7]).toHaveText('blog 2')
        await expect(blogTitles[8]).toHaveText('blog 1')
        await expect(blogTitles[9]).toHaveText('blog 0')
      })
    })

  })
})
