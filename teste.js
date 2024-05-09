const puppeteer = require("puppeteer");
const fs = require("fs");
const url =
  "https://www.linkedin.com/jobs/search/?keywords=Desenvolvedor%20Junior%20Javascript&location=Brasil&locationId=&geoId=106057199&f_TPR=r604800&f_WT=2%2C1%2C3&position=1&pageNum=0";
const url2 =
  "https://www.linkedin.com/jobs/search?keywords=Industria&location=Portugal&locationId=&geoId=100364837&f_TPR=r604800&position=1&pageNum=0";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=1200,800"],
  });
  const page = await browser.newPage();
  await page.goto(url2);

  setTimeout(async () => {
    const data = await scrapeData(page);

    fs.writeFile("dados.txt", JSON.stringify(data, null, 2), (err) => {
      if (err) throw new Error("Something went wrong");
      console.log("Data saved to dados.txt");
    });
    page.close();
  }, 5000);
})();

async function scrapeData(page) {
  let scrollPosition = 0;
  let documentHeight = await page.evaluate(
    () => document.body.scrollHeight - 500
  );

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
