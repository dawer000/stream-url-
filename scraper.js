const puppeteer = require('puppeteer');

async function runScraper() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Website load karein
    await page.goto('https://vsembed.ru/embed/tv?tmdb=1399&season=1&episode=1&ds_lang=de', { waitUntil: 'networkidle2' });

    // Play button par click karein taake iframe load ho
    await page.click('#pl_but');
    
    // 5 second ruken takay iframe load ho jaye
    await new Promise(r => setTimeout(r, 5000));

    // Ab iframe ka src nikaal lein
    const iframeSrc = await page.evaluate(() => {
        const iframe = document.getElementById('player_iframe');
        return iframe ? iframe.src : null;
    });

    console.log(">>> EXTRACTED IFRAME URL: " + iframeSrc);
    
    await browser.close();
}
runScraper();
