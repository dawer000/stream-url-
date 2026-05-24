const puppeteer = require('puppeteer');

async function runScraper() {
    // 1. Browser launch fix: 'no-sandbox' is mandatory for GitHub Actions
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote'
        ]
    });
    
    const page = await browser.newPage();
    
    // 2. Network Sniffing: Ye code extension ki tarah traffic ko listen karega
    await page.setRequestInterception(true);
    page.on('request', (req) => req.continue());
    
    page.on('response', async (res) => {
        const url = res.url();
        // Streaming links aksar 'm3u8' ya 'playlist' contain karte hain
        if (url.includes('.m3u8') || url.includes('playlist')) {
            console.log(">>> FOUND LINK: " + url);
        }
    });

    console.log("Navigating...");
    await page.goto('https://vsembed.ru/embed/tv?tmdb=1399&season=1&episode=1&ds_lang=de', { waitUntil: 'networkidle2' });

    // 3. Play button click: Iframe activate karne ke liye
    try {
        await page.waitForSelector('#pl_but', { timeout: 10000 });
        await page.click('#pl_but');
        console.log("Play button clicked successfully.");
    } catch (e) {
        console.log("Could not find play button, proceeding...");
    }

    // 4. Wait for network requests to complete
    await new Promise(r => setTimeout(r, 20000)); 
    await browser.close();
}

runScraper();
