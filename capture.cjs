const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('JS LOG:', msg.text()));
  page.on('pageerror', err => console.error('JS ERROR:', err.message));
  
  await page.goto('http://localhost:5174/portfolio/', { 
    waitUntil: 'networkidle0',
    timeout: 60000 
  });
  
  await page.waitForTimeout(5000);
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('=== RENDERED TEXT (first 1000 chars) ===');
  console.log(text.substring(0, 1000));
  
  await page.screenshot({ path: '/tmp/portfolio-rendered.png', fullPage: true });
  await browser.close();
  console.log('\n✅ Screenshot saved to /tmp/portfolio-rendered.png');
})();
