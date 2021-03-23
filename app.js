const puppeteer = require('puppeteer');
const express           = require('express');
const app               = express();
const PORT              = 5000;
const SECRET           = require('./secret');
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/test-search', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        //const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://cellphones.com.vn/', { waitUntil: 'load' });
    
        //await page.waitFor('input[name=q]');
    
        // await page.type('input[name=shopee-searchbar-input__input]', 'Adenosine triphosphate');
        await page.$eval('input[name=q]', el => el.value = 'samsung');
    
        await page.click('button[type="submit"]');
    
        await page.waitForSelector('.products-container');
        const text = await page.evaluate(() => {
            // const anchor = document.querySelector('.products-container');
            // return anchor.textContent;
    
            let titleLinks = document.querySelectorAll('.products-container ul li');
            titleLinks = [...titleLinks];
            let articles = titleLinks.map(link => ({
                title: link.querySelector('.lt-product-group-info a h3').innerText,
                url: link.querySelector('.lt-product-group-info a').getAttribute('href')
            }));
            return articles;
        });
        // if(res.statusCode == 200){
        //     console.log("Success");
        // }else{
        //     console.log("Fail");
        // }
        //await browser.close();
        return console.log(text);
    })();
});

app.get('/test-login', (req, res) => {
    const LOGIN_SUCCESS = 1;
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://github.com/login', { waitUntil: 'load' });
    
        //await page.waitFor('input[name=q]');
    
        // await page.type('input[name=shopee-searchbar-input__input]', 'Adenosine triphosphate');
        await page.$eval('input[name=login]', el => el.value = 'tothanhdat');
        await page.$eval('input[name=password]', el => el.value = 'Tothanhdatkof7');
        await page.click('input[type="submit"]');
        await page.waitForNavigation();
        const post = await page.$$('div[data-repository-hovercards-enabled]');
        console.log(post.length);
        return;
    })();
});

app.listen(PORT, () => {
    console.log(`Server start at port ${PORT}`);
})