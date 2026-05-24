const puppeteer = require('puppeteer');
const fs = require('fs');

async function runScraper() {
    console.log("Launching browser...");
    // 1. Non-Headless simulation: Hum isay headless: false kar rahe hain
    // GitHub par ye tab bhi nahi dikhega, lekin is se site ka behavior change ho sakta hai
    const browser = await puppeteer.launch({
        headless: false, // Non-Headless simulation
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process', // Frame handle karne ke liye
        ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 }); // Screen size set karein
    
    // Create 'debug' folder to store screenshots
    if (!fs.existsSync('debug')) { fs.mkdirSync('debug'); }

    // Request Sniffing wahi rahega
    page.on('response', async (res) => {
        const url = res.url();
        if (url.includes('.m3u8')) {
            console.log(">>> FOUND LINK: " + url);
        }
    });

    console.log("Navigating...");
    await page.goto('https://vsembed.ru/embed/tv?tmdb=1399&season=1&episode=1&ds_lang=de', { waitUntil: 'networkidle0' });
    
    // Screenshot 1: After page load
    await page.screenshot({ path: 'debug/1_loaded.png' });
    console.log("Screenshot 1 taken.");

    // Har frame me click aur screenshot lena
    const frames = page.frames();
    for (let i = 0; i < frames.length; i++) {
        try {
            console.log(`Checking frame ${i}...`);
            await frames[i].click('body'); 
            await page.screenshot({ path: `debug/2_clicked_frame_${i}.png` });
            console.log(`Clicked and screenshotted frame ${i}.`);
        } catch (e) {}
    }

    console.log("Waiting for network activity...");
    await new Promise(r => setTimeout(r, 20000)); // 20 sec wait
    await browser.close();
}

runScraper();
