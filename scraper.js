const puppeteer = require('puppeteer');

async function runScraper() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        ]
    });
    
    const page = await browser.newPage();
    
    // Page load hone se pehle user-agent set kar diya
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

    // Request interception
    await page.setRequestInterception(true);
    page.on('request', (req) => req.continue());
    
    page.on('response', async (res) => {
        const url = res.url();
        if (url.includes('.m3u8')) {
            console.log(">>> FINAL LINK FOUND: " + url);
        }
    });

    console.log("Navigating...");
    await page.goto('https://vsembed.ru/embed/tv?tmdb=1399&season=1&episode=1&ds_lang=de', { waitUntil: 'networkidle2' });

    // Click trigger - Kuch sites par button ko double click ya delay chahiye hota hai
    try {
        await page.waitForSelector('#pl_but', { timeout: 10000 });
        console.log("Play button found. Clicking...");
        await page.click('#pl_but');
    } catch (e) {
        console.log("Button click failed, but let's wait...");
    }

    await new Promise(r => setTimeout(r, 25000)); // 25 seconds ka wait
    await browser.close();
}

runScraper();
