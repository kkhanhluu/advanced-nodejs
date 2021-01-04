const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('When logged in, can see blog create form', async () => {
  await page.login();
  await page.goto('http://localhost:3000/blogs');
  await page.click('a.btn-floating');

  const label = await page.$eval('form label', (el) => el.innerHTML);
  expect(label).toEqual('Blog Title');
});
