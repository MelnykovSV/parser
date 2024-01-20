const puppeteer = require('puppeteer');
const { parseVacancies } = require('./parser');

const dataToParse = [
  {
    URLs: [
      'https://djinni.co/jobs/?all-keywords=react&primary_keyword=JavaScript&exp_level=no_exp&keywords=react',
      'https://djinni.co/jobs/?all-keywords=react&primary_keyword=JavaScript&exp_level=1y&keywords=react',
      'https://djinni.co/jobs/?primary_keyword=JavaScript&exp_level=1y',
      'https://djinni.co/jobs/?primary_keyword=JavaScript&exp_level=no_exp',
    ],
    selector: '.job-list-item__link',
    fileName: 'djinni',
  },

  {
    URLs: [
      'https://www.work.ua/jobs-remote-front-end/?advs=1',
      'https://www.work.ua/jobs-remote-react/?advs=1',
      'https://www.work.ua/jobs-remote-javascript/?advs=1',
    ],
    selector: '.card.job-link>h2>a',
    fileName: 'work_ua',
  },

  // {
  //   URLs: [
  //     'https://recruitika.com/?collections=remote&tags=front-end',
  //     'https://recruitika.com/?collections=remote&tags=reactjs_',
  //     'https://recruitika.com/?collections=remote&tags=js',
  //   ],
  //   selector: '.vacancy-title>a',
  //   fileName: 'recruitika_com',
  // },
  {
    URLs: [
      'https://jobs.dou.ua/vacancies/?remote&category=Front%20End&exp=0-1',
      'https://jobs.dou.ua/vacancies/?remote&descr=1&category=Front%20End&search=react&exp=0-1',
      'https://jobs.dou.ua/vacancies/?remote&descr=1&category=Front%20End&search=javascript&exp=0-1',
    ],
    selector: '.vacancy>.title>a',
    fileName: 'dou',
  },
  {
    URLs: ['https://robota.ua/zapros/react/ukraine?scheduleIds=3'],
    selector: 'alliance-vacancy-card-desktop > a',
    fileName: 'robota_ua',
  },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  dataToParse.forEach(({ URLs, selector, fileName }) => {
    parseVacancies(URLs, selector, fileName, browser);
  });

  setTimeout(() => {
    parseVacancies(
      [
        'https://robota.ua/zapros/junior-javascript-developer/ukraine?scheduleIds=3',
      ],
      'alliance-vacancy-card-desktop > a',
      'robota_ua',
      browser,
    );
  }, 15000);
  setTimeout(() => {
    parseVacancies(
      [
        'https://robota.ua/zapros/junior-frontend-developer/ukraine?scheduleIds=3',
      ],
      'alliance-vacancy-card-desktop > a',
      'robota_ua',
      browser,
    );
  }, 30000);
})();
