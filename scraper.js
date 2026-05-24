const puppeteer = require('puppeteer');

async function runScraper() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    // Asli browser jaisa dikhne ke liye User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const url = req.url();
        if (url.includes('.m3u8')) {
            console.log(">>> FOUND LINK: " + url);
        }
        req.continue();
    });

    console.log("Navigating...");
    // VidSrc ka URL
    await page.goto('https://vidsrc.to/embed/movie/tt1375666', { waitUntil: 'networkidle2' });

    // Play button par click karne ke liye thoda wait
    try {
        await page.waitForSelector('body', { timeout: 10000 });
        await page.mouse.click(500, 300); // Screen ke beech mein click
        console.log("Clicked play...");
    } catch(e) {
        console.log("Could not click, but checking network...");
    }

    // 15 seconds ka wait taake link load ho jaye
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
}

runScraper();
