const pup = require("puppeteer");



const url = "https://www.mercadolivre.com.br/";
const search = "macbook pro 16";

(async() => {

    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    console.log("Navegador aberto");
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Página carregada");

    await page.waitForSelector('#cb1-edit')
    await page.type('#cb1-edit', search);

    setTimeout(() => {}, 2000);

    await Promise.all([
        page.waitForNavigation(),
        await page.click('body > header > div > div.nav-area.nav-top-area.nav-center-area > form > button')
    ]);

    const links = await page.$$eval('div.ui-search-item__group.ui-search-item__group--title.shops__items-group >a', links => links.map(link => link.href));

    let data = [];

    for (let i = 0; i < 10; i++) {
        await page.goto(links[i], { waitUntil: "networkidle2" });

        setTimeout(() => {}, 2000);
        const title = await page.$eval('h1.ui-pdp-title', title => title.textContent);
        const price = await page.$eval('span.andes-money-amount__fraction', price => price.textContent);
        //await browser.close();
        data.push({
            title,
            price
        })


    }
    console.log(data);
})();