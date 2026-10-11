// usage: node png.js <frames-dir> <out-dir>   set PLAYWRIGHT_DIR / SHARP_DIR to the module folders if they do not resolve from here
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_DIR || 'playwright-core');
const sharp = require(process.env.SHARP_DIR || 'sharp');
const [FRAMES, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const B = [['landing-desktop','a8f21cef',1280,2685],['landing-mobile','ad67ec35',390,3290],['hero-table-animation','174eb66f',1280,700],['success-desktop','642661e9',1280,777],['success-mobile','4555091e',390,1014],['results-desktop','92ef8ee0',1280,2665],['results-mobile','24e61a2e',390,2866],['ad-a-4x5','8e84da19',540,675],['ad-a-9x16','6bf92b0b',405,720],['ad-b-4x5','c2093dbc',540,675],['ad-b-9x16','4b5adee3',405,720],['hero-a-mobile','734d3e9c',375,667]];
(async () => {
  const b = await chromium.launch();
  for (const [n, id, w, h] of B) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    await pg.goto('file://' + path.join(FRAMES, id + '.html'));
    await pg.waitForTimeout(n === 'hero-table-animation' ? 6500 : 3500);
    const buf = await pg.screenshot();
    await sharp(buf).png({ palette: true, colours: 256, effort: 10 }).toFile(path.join(OUT, n + '.png'));
    await ctx.close();
  }
  await b.close();
})();
