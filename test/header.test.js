const puppeteer = require('puppeteer');

let browser;
let page;
beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000');
});

test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

  expect(text).toEqual('Blogster');
});
