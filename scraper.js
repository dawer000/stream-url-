const puppeteer = require('puppeteer');

async function runScraper() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 1. Network Traffic Monitor (Ad-blocking + Link Sniffing)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const url = req.url();
        if (url.includes('.m3u8')) {
            console.log(">>> FOUND LINK: " + url);
        }
        req.continue();
    });

    // 2. VidSrc Page Load
    console.log("Navigating to target...");
    await page.goto('https://vidsrc.to/embed/movie/tt1375666', { waitUntil: 'networkidle2' });

    // 3. Simulation: Play Button Click
    try {
        await page.waitForSelector('body', { timeout: 5000 });
        await page.click('body'); // VidSrc aksar pure body par click karne se player activate hota hai
        console.log("Clicked play button...");
    } catch(e) {
        console.log("Play button not found, maybe auto-started.");
    }

    // 4. Wait for stream to load
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
}

runScraper();
