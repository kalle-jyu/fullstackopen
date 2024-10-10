const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Testi Testaaja',
        username: 'testaaja',
        password: 'salainen'
      }
    })

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Jarmo Jarmola',
        username: 'jamppa',
        password: 'varmasalasana'
      }
    })

    await page.goto('http://localhost:3000')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Testi Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('muu')
      await page.getByTestId('password').fill('vääräsalasana')
      await page.getByRole('button', { name: 'login' }).click()
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('new blog', { exact: true }).click()
      await page.getByTestId('title').fill('A fantastic blog created by playwright')
      await page.getByTestId('author').fill('Play Wright')
      await page.getByTestId('url').fill('https://playwright.dev/community/welcome')
      await page.getByText('create', { exact: true }).click()
      await expect(page.getByText("A new blog 'A fantastic blog created by playwright' by Play Wright added", { exact: true })).toBeVisible()
      await expect(page.getByText('A fantastic blog created by playwright', { exact: true })).toBeVisible()
      await expect(page.getByText('Play Wright', { exact: true })).toBeVisible()

    })
    describe('when there is a blog in db', () => {

      beforeEach(async ({ page, request }) => {
        await page.getByTestId('username').fill('testaaja')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByText('new blog', { exact: true }).click()
        await page.getByTestId('title').fill('A fantastic blog created by playwright')
        await page.getByTestId('author').fill('Play Wright')
        await page.getByTestId('url').fill('https://playwright.dev/community/welcome')
        await page.getByText('create', { exact: true }).click()
        await expect(page.getByText("A new blog 'A fantastic blog created by playwright' by Play Wright added", { exact: true })).toBeVisible()
        await expect(page.getByText('A fantastic blog created by playwright', { exact: true })).toBeVisible()
        await expect(page.getByText('Play Wright', { exact: true })).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByText('show', { exact: true }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByText('like', { exact: true }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByText('like', { exact: true }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('a blog can be removed', async ({ page }) => {
        await page.getByText('show', { exact: true }).click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByText('remove', { exact: true }).click()
        await expect(page.getByText('A fantastic blog created by playwright Play Wright', { exact: true })).not.toBeAttached()
        await expect(page.getByText('likes 0')).not.toBeAttached()
      })

      test('user who did not add a blog does not see remove button', async ({ page }) => {
        await page.getByText('logout', { exact: true }).click()
        await page.getByTestId('username').fill('jamppa')
        await page.getByTestId('password').fill('varmasalasana')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByText('show', { exact: true }).click()
        await expect(page.getByText('remove', { exact: true })).not.toBeAttached()
      })

    })

    describe('when there is a three blogs in the db', () => {

      beforeEach(async ({ page, request }) => {
        // first blog
        await page.getByText('new blog', { exact: true }).click()
        await page.getByTestId('title').fill('The first blog')
        await page.getByTestId('author').fill('F. Irst')
        await page.getByTestId('url').fill('https://first.blog')
        await page.getByText('create', { exact: true }).click()

        // second blog
        await page.getByText('new blog', { exact: true }).click()
        await page.getByTestId('title').fill('The Second blog')
        await page.getByTestId('author').fill('S. Econd')
        await page.getByTestId('url').fill('https:/second.blog')
        await page.getByText('create', { exact: true }).click()
        
        // third blog
        await page.getByText('new blog', { exact: true }).click()
        await page.getByTestId('title').fill('Third blog')
        await page.getByTestId('author').fill('T. Hird')
        await page.getByTestId('url').fill('https://third.blog')
        await page.getByText('create', { exact: true }).click()
        // jostain syystä seuraava selector ei löydä viimeistä, jos ei timeoutia
        await page.waitForTimeout(1000)
      })

      test('blogs are in default order', async ({ page }) => {
        let titles = await page.locator('.blog-title').all();
        console.log('titles length: ', titles.length)
        console.log('titles: ', titles)

        expect(titles[0].textContent === 'Eka blogi')
        expect(titles[1].textContent === 'Toka blogi')
        expect(titles[2].textContent === 'Kolmas blogi')
      })
      
      test('a blogs are in order by likes', async ({ page }) => {
        // avataan kaikki
        await page.getByText('show', { exact: true }).first().click();
        await page.getByText('show', { exact: true }).first().click();
        await page.getByText('show', { exact: true }).first().click();

        // klikataan kolmatta blogia
        await page.getByText('like', { exact: true }).last().click();
        let titles = await page.locator('.blog-title').all();
        expect(titles[0].textContent === 'Kolmas blogi') 
        expect(titles[1].textContent === 'Eka blogi')
        expect(titles[2].textContent === 'Toka blogi')
        await expect(page.getByText('likes 1')).toBeVisible()
  
        // klikataan nyt tokaa kaksi kertaa
        await page.getByText('like', { exact: true }).last().click();
        await page.waitForTimeout(200)
        // siirtyi ensimmäiseksi
        await page.getByText('like', { exact: true }).first().click();
        await page.waitForTimeout(200)
        titles = await page.locator('.blog-title').all();
        expect(titles[0].textContent === 'Toka blogi') 
        expect(titles[1].textContent === 'Kolmas blogi')
        expect(titles[2].textContent === 'Eka blogi')
        await expect(page.getByText('likes 2')).toBeVisible()

        // klikataan ensimmäistä kolme kertaa
        await page.locator(':nth-match(:text("like"), 3)').click();
        // siirtyi toiseksi
        await page.locator(':nth-match(:text("like"), 2)').click();
        // siirtyi ensimmäiseksi
        await page.locator(':nth-match(:text("like"), 1)').click();
        await page.waitForTimeout(200)
        titles = await page.locator('.blog-title').all();
        expect(titles[0].textContent === 'Eka blogi') 
        expect(titles[1].textContent === 'Toka blogi')
        expect(titles[2].textContent === 'Kolmas blogi')
        await expect(page.getByText('likes 3')).toBeVisible()
      })

    })

  })
})