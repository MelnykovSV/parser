const puppeteer = require('puppeteer');
const fs = require('fs');
const { alertNewVacancy } = require('./bot');

async function parseVacancies(URLs, selector, fileName, browser) {
  setInterval(() => {
    const myVacancies = fs.readFileSync(`${fileName}.json`, 'utf8') || '[]';

    URLs.forEach(async (item) => {
      const page = await browser.newPage();

      await page.goto(item);

      let vacanciesNew = await page.evaluate((selector) => {
        const arr = Array.from(document.querySelectorAll(selector)).map(
          (a) => a.href,
        );
        return arr;
      }, selector);

      let shouldRewrite = false;

      const updatedMyVacancies = vacanciesNew.reduce(
        (acc, item) => {
          if (!JSON.parse(myVacancies).includes(item)) {
            shouldRewrite = true;
            console.log(item);
            alertNewVacancy(item);
            return [item, ...acc];
          } else {
            return [...acc];
          }
        },
        [...JSON.parse(myVacancies)],
      );

      if (shouldRewrite) {
        fs.writeFile(
          `${fileName}.json`,
          JSON.stringify(updatedMyVacancies),
          function (err) {
            if (err) {
              console.log(err);
            }
          },
        );
      }

      setTimeout(async () => {
        await page.close();
      }, 10000);
    });
  }, 60000);
}

module.exports = {
  parseVacancies,
};
