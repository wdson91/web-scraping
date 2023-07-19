const pup = require("puppeteer");

//const url = "https://www.linkedin.com/login";
const url = "https://www.linkedin.com/jobs/search/?keywords=desenvolvedor%20junior&location=Brasil&geoId=106057199&trk=public_jobs_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0";
const search = "nodejs junior";
const email = "wdson91@gmail.com";
const senha = "wdsonB$321";

(async() => {

    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    console.log("Navegador aberto");
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Página carregada");

    await page.waitForSelector('#jserp-filters > ul > li:nth-child(1) > div > div > button > icon > svg');
    await page.click('#jserp-filters > ul > li:nth-child(1) > div > div > button > icon > svg');

    await page.waitForSelector('#f_TPR-1');
    await page.click('#f_TPR-1');

    await page.waitForSelector('#jserp-filters > ul > li:nth-child(1) > div > div > div > button');
    setTimeout(() => {}, 3000);
    await page.click('#jserp-filters > ul > li:nth-child(1) > div > div > div > button');

    setTimeout(() => {}, 3000);
    //const buttonInfinite = ;



    await scrollPageToBottom();
    //await page.waitForSelector('#jserp-filters > ul > li:nth-child(1) > div > div > div > button');



    // const links = await page.$$eval('.base-card__full-link', links => links.map(link => link.href));
    // console.log(links);
    // await page.waitForSelector('#username');
    // await page.type('#username', email);

    // await page.waitForSelector('#password');
    // await page.type('#password', senha);

    // setTimeout(() => {}, 2000);

    // await Promise.all([
    //     page.waitForNavigation(),
    //     await page.click('#organic-div > form > div.login__form_action_container > button')
    // ])
    // setTimeout(() => {}, 5000);

    // await page.waitForSelector('#global-nav-typeahead > input');
    // console.log("Página carregada");
    // await page.click('#global-nav-typeahead > input');
    // setTimeout(() => {}, 2000);
    // await page.type('#global-nav-typeahead > input', search);
    // setTimeout(() => {}, 2000);
    // await page.keyboard.sendCharacter(String.fromCharCode(13));
    // setTimeout(() => {}, 2000);

    // await Promise.all([
    //     page.waitForNavigation(),
    //     await page.click('#global-nav-search > form > div > button')
    // ])

    // const links = await page.$$eval('div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > a', links => links.map(link => link.href));
    // console.log(links);


})();