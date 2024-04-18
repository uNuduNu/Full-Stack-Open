const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByTestId('submit').click()
}

const addBlog = async (page, title, author, url, likes) => {
    await page.getByTestId('show').click()

    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByTestId('likes').fill(likes)
    await page.getByTestId('add').click()
}

export { loginWith, addBlog }