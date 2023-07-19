const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--window-size=1200,800']
    });
    const page = await browser.newPage();
    await page.goto(
        'https://www.linkedin.com/jobs/search?keywords=Analista%20De%20Dados&location=Brasil&locationId=&geoId=106057199&f_TPR=r2592000&f_E=1%2C2%2C3&position=1&pageNum=0'
    );

    setTimeout(() => {
        scrapeData(page).then((data) => {
            fs.writeFile('dados.txt', JSON.stringify(data, null, 2), (err) => {
                if (err) throw new Error('Something went wrong');
                console.log('Data saved to dados.txt');
            });
        }).catch((error) => {
            console.error('Error during data scraping:', error);
        });
    }, 5000);
})();

async function scrapeData(page) {
    let scrollPosition = 0;
    let documentHeight = await page.evaluate(() => document.body.scrollHeight - 500);

    while (documentHeight > scrollPosition) {
        const button = await page.$('.infinite-scroller__show-more-button--visible');
        if (button) {
            await button.click();
            console.log('Button found and clicked');

        }

        await page.evaluate((scrollHeight) => {
            window.scrollBy(0, scrollHeight);
            window.scrollBy(800, scrollHeight);
        }, documentHeight);

        console.log('Scrolling...');
        await page.waitForTimeout(1000);

        scrollPosition = documentHeight;
        documentHeight = await page.evaluate(() => document.body.scrollHeight);
    }

    console.log('Scrolling finished!');

    const links = await page.$$eval('.base-search-card>a', (links) => links.map((link) => link.href));
    const titles = await page.$$eval('.base-search-card__title', (titles) => titles.map((title) => title.outerText));
    const companies = await page.$$eval('.base-search-card__subtitle', (companies) =>
        companies.map((company) => company.outerText)
    );
    const locations = await page.$$eval('.job-search-card__location', (locations) =>
        locations.map((location) => location.outerText)
    );
    const dates = await page.$$eval('.job-search-card__listdate', (dates) => dates.map((date) => date.dateTime));

    const data = links.map((link, i) => ({
        link,
        title: titles[i],
        company: companies[i],
        location: locations[i],
        date: dates[i],
    }));

    return data;
}