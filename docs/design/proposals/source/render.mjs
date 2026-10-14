// Design-only renderer. Use an existing Node environment with Playwright and sharp.
// No dependency or application manifest is introduced by this proposal.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const moduleRoot = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
const dependency = name => require(moduleRoot ? resolve(moduleRoot, name) : name);
const { chromium } = dependency('playwright');
const sharp = dependency('sharp');
const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(here, '../images');
await mkdir(output, { recursive: true });
const specs = [
  ['01-overview-fr-1440','overview','fr',1440],
  ['02-lesson-fr-1440','lesson','fr',1440],
  ['03-worked-example-fr-1440','worked','fr',1440],
  ['04-glossary-fr-1440','glossary','fr',1440],
  ['05-practice-unanswered-fr-1440','practice','fr',1440],
  ['06-feedback-incorrect-fr-1440','feedback','fr',1440],
  ['07-private-progress-fr-1440','progress','fr',1440],
  ['08-sign-in-gate-fr-1440','gate','fr',1440],
  ['09-lesson-fr-375','lesson','fr',375],
  ['10-practice-unanswered-fr-375','practice','fr',375],
  ['11-feedback-incorrect-fr-375','feedback','fr',375],
  ['12-lesson-en-1440','lesson','en',1440],
  ['13-feedback-incorrect-en-1440','feedback','en',1440],
  ['14-practice-unanswered-fr-320','practice','fr',320],
];
const browser = await chromium.launch({ headless: true, executablePath:process.env.DESIGN_CHROMIUM_PATH || chromium.executablePath() });
const checks = [];
function url(screen, language, extra='') {
  return pathToFileURL(resolve(here, 'prototype.html')).href + `?screen=${screen}&lang=${language}${extra}`;
}
async function inspect(page) {
  return page.evaluate(() => {
    const visible = [...document.querySelectorAll('body *')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width && r.height && getComputedStyle(el).visibility !== 'hidden';
    });
    const overflow = visible.filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > innerWidth + 1;
    }).filter(el=>!el.classList.contains('skip')).map(el=>el.tagName+'.'+el.className);
    const clipped = visible.filter(el=>['hidden','clip'].includes(getComputedStyle(el).overflowX) && el.scrollWidth>el.clientWidth+1).map(el=>el.tagName+'.'+el.className);
    const nav = [...document.querySelectorAll('header nav a')].map(el => ({label:el.textContent, height:el.getBoundingClientRect().height}));
    return {viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, overflow, clipped, nav, title:document.querySelector('h1').textContent, height:document.documentElement.scrollHeight};
  });
}
try {
  for (const [name,screen,language,width] of specs) {
    const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url(screen,language,screen==='practice'?'&focus=1':''));
    await page.evaluate(()=>document.fonts.ready);
    const layout = await inspect(page);
    if(layout.documentWidth>width || layout.overflow.length || layout.clipped.length || errors.length)throw new Error(name+': '+JSON.stringify({layout,errors}));
    const png = await page.screenshot({fullPage:true});
    const filename=name+'.webp';
    await sharp(png).webp({lossless:true}).toFile(resolve(output,filename));
    const bytes = await readFile(resolve(output,filename));
    const info=await sharp(bytes).metadata();
    if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||info.width!==width)throw new Error('Invalid WebP '+filename);
    checks.push({file:filename,screen,language,width:info.width,height:info.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),...layout,errors});
    console.log(`${filename}: ${info.width}×${info.height}, ${Math.round(bytes.length/1024)} KiB, no layout overflow`);
    await page.close();
  }
  // Additional layout checks do not generate additional deliverable screens.
  const supplemental=[];
  for (const width of [320,375,768,1280]) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    for (const screen of ['overview','lesson','worked','glossary','practice','feedback','progress','gate']) {
      for (const language of ['fr','en']) {
        await page.goto(url(screen,language));
        const result=await inspect(page);
        if(result.documentWidth>width||result.overflow.length||result.clipped.length)throw new Error(`Supplemental ${screen}/${language}/${width}: `+JSON.stringify(result));
        if(width>=1280&&result.nav.some(n=>n.height>35))throw new Error('Wrapped desktop nav');
        supplemental.push({screen,language,width,overflow:0,clipped:0});
      }
    }
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:375,height:1000}});
  await page.goto(url('practice','fr'));
  await page.locator('input[value="false-true"]').check();
  await page.locator('#hint').click();
  await page.locator('[data-lang="en"]').click();
  await page.waitForURL('**lang=en**');
  if(!await page.locator('input[value="false-true"]').isChecked()||!await page.locator('#hint-content').isVisible())throw new Error('Language fixture lost selection/hint');
  await page.goto(url('lesson','fr'));
  await page.keyboard.press('Tab');
  if(await page.evaluate(()=>document.activeElement.className)!=='skip')throw new Error('Skip link is not first focus');
  await page.keyboard.press('Enter');
  await page.goto(url('practice','fr'));
  await page.locator('#hint').focus();
  const focus=await page.locator('#hint').evaluate(el=>({width:getComputedStyle(el).outlineWidth,color:getComputedStyle(el).outlineColor}));
  if(focus.width==='0px')throw new Error('No visible focus');
  await page.goto(url('glossary','fr'));
  await page.locator('#search').fill('implication');
  if(await page.locator('.glossary-item:visible').count()!==1)throw new Error('Glossary search fixture');
  await page.close();
  const luminance=hex=>{
    const parts=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
    return parts[0]*0.2126+parts[1]*0.7152+parts[2]*0.0722;
  };
  const contrastPairs=[['body on paper','#243832','#f6f3eb'],['supporting on surface','#56645e','#fffefa'],['supporting on paper','#56645e','#f6f3eb'],['teal on tint','#175a50','#e8efe8'],['button text','#ffffff','#175a50'],['review text','#834528','#fbefe5'],['disabled text','#56645e','#e2e5db'],['focus on paper','#075cab','#f6f3eb'],['radio boundary','#68766e','#fffefa']].map(([name,a,b])=>{const la=luminance(a),lb=luminance(b);return{name,foreground:a,background:b,ratio:Number(((Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05)).toFixed(2))}});
  if(contrastPairs.some(p=>p.ratio<4.5))throw new Error('Insufficient text or focus token contrast');
  const evidence={capturedAt:new Date().toISOString(),renderer:'Playwright Chromium + sharp lossless WebP',tooling:{node:process.version,playwright:dependency('playwright/package.json').version,sharp:dependency('sharp/package.json').version,chromium:browser.version()},sourceSha256:createHash('sha256').update(await readFile(resolve(here,'prototype.html'))).digest('hex'),scope:'Design fixture only; no production authentication, grading or storage',screens:checks,supplementalLayouts:supplemental,contrastPairs,fixtureChecks:{languagePreservesSelectionAndHint:true,skipLinkFirst:true,visibleKeyboardFocus:focus,glossarySearch:true},limitations:['No assistive-technology certification','No production behaviour verified','Font rendering may vary on other systems']};
  await writeFile(resolve(here,'../render-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(`Verified ${checks.length} WebP screens and ${supplemental.length} supplemental layouts.`);
} finally {
  await browser.close();
}
