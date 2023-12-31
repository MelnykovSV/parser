const puppeteer = require('puppeteer');
const fs = require('fs');

const linkWithFilter = 'https://www.work.ua/jobs-remote-front+end/?page=1';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();

  await page.goto(linkWithFilter);

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 300;

      const scrollInterval = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 100);
    });
  });

  const pages = await page.$$(
    '#pjax-job-list > nav > ul.pagination.hidden-xs > li> a',
  );
  pages.shift();

  let pageURLs = [];
  for (const pageLink of pages) {
    const url = await page.evaluate((pageLink) => pageLink.href, pageLink);
    pageURLs.push(url);
  }

  let vacancies = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#pjax-job-list > div > h2 > a')).map(
      (a) => a.href,
    ),
  );

  for (const url of pageURLs) {
    await Promise.all([
      page.goto(url),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 300;

        const scrollInterval = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 100);
      });
    });

    let vacanciesNew = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('#pjax-job-list > div > h2 > a'),
      ).map((a) => a.href),
    );

    vacancies = vacancies.concat(vacanciesNew);
  }

  // Read existing file content
  let existingContent = '';
  try {
    existingContent = fs.readFileSync('vacanciesResult.json', 'utf8');
  } catch (err) {
    console.error(err);
  }

  // Parse existing content as JSON
  let existingVacancies = [];
  if (existingContent) {
    try {
      existingVacancies = JSON.parse(existingContent);
    } catch (err) {
      console.error(err);
    }
  }

  // Merge new vacancies with existing vacancies
  vacancies = [...new Set([...existingVacancies, ...vacancies])];

  let result = JSON.stringify(vacancies);

  fs.writeFile('vacanciesResultWork.json', result, function (err) {
    if (err) {
      console.log(err);
    }
  });

  console.log('Parse and save JSON done!');

  await browser.close();
})();
