const puppeteer = require("puppeteer");
const fs = require("fs");

const urls = ["https://www.linkedin.com/jobs/search?keywords=Python&location=Brasil&geoId=106057199&f_TPR=r86400&f_WT=2&position=1&pageNum=0",
  "https://www.linkedin.com/jobs/search/?currentJobId=3921483168&f_AL=true&f_TPR=r86400&f_WT=2&geoId=106057199&keywords=Node&location=Brasil&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R&position=1&pageNum=0"
  
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=1200,800"],
  });

  try {
    for (let i = 0; i < urls.length; i++) {
      const page = await browser.newPage();
      await page.goto(urls[i]);

      const data = await scrapeData(page);

      fs.writeFile(`dados${i}.txt`, JSON.stringify(data, null, 2), (err) => {
        if (err) throw new Error("Something went wrong");
        console.log(`Data saved to dados${i}.txt`);
      });

      await page.close();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();

async function scrapeData(page) {
  let scrollPosition = 0;
  
  await new Promise(resolve => setTimeout(resolve, 3000)); // Sleep por 3 segundos (3000 milissegundos)
  let documentHeight = await page.evaluate(() => {
      return document.body.scrollHeight - 500;
  });

  while (documentHeight > scrollPosition) {
    const button = await page.$(
      ".infinite-scroller__show-more-button--visible"
    );
    if (button) {
      await button.click();
      console.log("Button found and clicked");
    }

    await page.evaluate((scrollHeight) => {
      window.scrollBy(0, scrollHeight);
    }, documentHeight);

    console.log("Scrolling...");
    await page.waitForTimeout(1000);

    scrollPosition = documentHeight;
    documentHeight = await page.evaluate(() => document.body.scrollHeight);
  }

  console.log("Scrolling finished!");

  const links = await page.$$eval(".base-search-card>a", (links) =>
    links.map((link) => link.href)
  );
  const titles = await page.$$eval(".base-search-card__title", (titles) =>
    titles.map((title) => title.innerText)
  );
  const companies = await page.$$eval(
    ".base-search-card__subtitle",
    (companies) => companies.map((company) => company.innerText)
  );
  const locations = await page.$$eval(
    ".job-search-card__location",
    (locations) => locations.map((location) => location.innerText)
  );
  const dates = await page.$$eval(".job-search-card__listdate", (dates) =>
    dates.map((date) => date.dateTime)
  );

  const data = links.map((link, i) => ({
    link,
    title: titles[i],
    company: companies[i],
    location: locations[i],
    date: dates[i],
  }));

  return data;
}
