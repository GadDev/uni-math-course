import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath,pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),deps=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const {chromium}=require(deps?path.join(deps,'playwright'):'playwright');
const sharp=require(deps?path.join(deps,'sharp'):'sharp');
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.dirname(here);
const art=await fs.readFile(path.join(out,'chapter-02-decalage-green.svg'),'utf8');
const checks=[];
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
for(const lang of ['fr','en']){
 const baseline=await fs.readFile(path.join(here,`baseline-green-${lang}.html`),'utf8');
 const html=baseline.replace(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg" class="signal-geometry"[\s\S]*?<\/svg>/,art).replaceAll('green-fr.html','chapter-02-fr.html').replaceAll('green-en.html','chapter-02-en.html');
 if(html===baseline)throw Error('Artwork replacement failed');
 const htmlPath=path.join(out,`chapter-02-${lang}.html`);await fs.writeFile(htmlPath,html);
 for(const width of [1440,960,375,320]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(htmlPath).href);await page.evaluate(()=>document.fonts.ready);
  const check=await page.evaluate(()=>({fontLoaded:document.fonts.check('16px Anton'),overflow:document.documentElement.scrollWidth>innerWidth,heroArtVisible:getComputedStyle(document.querySelector('.hero-art')).display!=='none',heroBottom:Math.ceil(document.querySelector('.hero').getBoundingClientRect().bottom),accent:getComputedStyle(document.body).getPropertyValue('--chapter').trim()}));
  if(!check.fontLoaded||check.overflow||check.accent!=='#18704f'||errors.length)throw Error(JSON.stringify({lang,width,check,errors}));
  const shot=await page.screenshot({fullPage:true});await sharp(shot).webp({lossless:true}).toFile(path.join(out,`chapter-02-decalage-green-${lang}-${width}.webp`));
  if(lang==='fr'&&width===1440){const hero=await page.screenshot({clip:{x:0,y:0,width,height:check.heroBottom}});await sharp(hero).webp({lossless:true}).toFile(path.join(out,'chapter-02-selected-hero.webp'));}
  await page.locator('summary').focus();await page.keyboard.press('Enter');if(!await page.locator('details').evaluate(e=>e.open))throw Error('Open failed');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Dropdown overflow');
  if(lang==='fr'&&[1440,375].includes(width)){await page.locator('.panel-label').click();await sharp(await page.screenshot({fullPage:true})).webp({lossless:true}).toFile(path.join(out,`chapter-02-selector-green-fr-${width}.webp`));}
  await page.keyboard.press('Escape');if(await page.locator('details').evaluate(e=>e.open))throw Error('Close failed');
  checks.push({lang,width,...check,selectorOverflow:false,keyboard:'Enter/Escape pass',errors});await page.close();
 }
}
await browser.close();
await sharp(Buffer.from(art)).resize(840,840).webp({lossless:true}).toFile(path.join(out,'chapter-02-decalage-green-art.webp'));
await fs.writeFile(path.join(out,'validation.json'),JSON.stringify({selectedDirection:'03 — Décalage',selectedColour:'#18704F',selectionDate:'2026-10-16',selectionEvidence:'User: let\'s go for 3/decalage green',scope:'Design selection; production implementation remains separate',checks},null,2)+'\n');
console.log('Selected design finalized: 8 responsive views, 2 selector states, hero crop and SVG preview.');
