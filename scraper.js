const puppeteer = require('puppeteer');

async function runScraper() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // 1. Network Interception Enable
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        req.continue();
    });

    // 2. Response Interception (Asli kaam yahan hoga)
    page.on('response', async (res) => {
        const url = res.url();
        // Aksar streaming sites 'm3u8' ya 'playlist' keywords use karti hain
        if (url.includes('.m3u8') || url.includes('playlist')) {
            console.log(">>> FOUND STREAM LINK: " + url);
        }
    });

    console.log("Navigating...");
    await page.goto('https://vidsrc.to/embed/movie/tt1375666', { waitUntil: 'networkidle2' });

    // 3. Fake Human Interaction
    console.log("Waiting for player...");
    await page.waitForSelector('iframe, .plyr__controls, #player', { timeout: 10000 }).catch(() => {});
    
    // Play button par click
    await page.mouse.click(500, 300); 
    
    console.log("Waiting for response...");
    await new Promise(r => setTimeout(r, 15000)); // 15 sec wait
    await browser.close();
}

runScraper();
