const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5174/portfolio/', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('PAGE TEXT (first 500 chars):');
  console.log(text.substring(0, 500));
  
  await page.screenshot({ path: '/tmp/portfolio-debug.png', fullPage: true });
  await browser.close();
  console.log('\nScreenshot saved to /tmp/portfolio-debug.png');
})();
