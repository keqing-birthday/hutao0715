import { chromium } from 'playwright'
import fs from 'fs'

const URL = 'http://localhost:5173/'
const OUT_DIR = 'test-screenshots'
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR)

function log(label, data) {
  console.log(`\n=== ${label} ===`)
  console.log(JSON.stringify(data, null, 2))
}

async function capture(page, name) {
  const path = `${OUT_DIR}/${name}.png`
  await page.screenshot({ path, fullPage: true })
  return path
}

async function getDetailedState(page) {
  return page.evaluate(() => {
    const html = document.documentElement
    const body = document.body
    const root = getComputedStyle(html)
    const bodyStyle = getComputedStyle(body)

    // Find all rules that set background-color on body or .bg-ink
    const bgRules = []
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.style && rule.style.backgroundColor) {
            if (rule.selectorText && (rule.selectorText.includes('body') || rule.selectorText.includes('.bg-ink'))) {
              bgRules.push({
                selector: rule.selectorText,
                bg: rule.style.backgroundColor,
                cssText: rule.cssText.slice(0, 300),
              })
            }
          }
        }
      } catch (e) {
        // cross-origin stylesheet
      }
    }

    return {
      htmlClassList: Array.from(html.classList),
      bodyClassList: Array.from(body.classList),
      bodyInlineStyle: body.getAttribute('style'),
      localStorageTheme: localStorage.getItem('hutao-theme'),
      colorInkOnHtml: root.getPropertyValue('--color-ink').trim(),
      colorInkOnBody: bodyStyle.getPropertyValue('--color-ink').trim(),
      bodyBg: bodyStyle.backgroundColor,
      bodyColor: bodyStyle.color,
      styleTags: Array.from(document.querySelectorAll('style')).map(s => s.textContent.slice(0, 200)),
      bgRules,
    }
  })
}

;(async () => {
  let browser
  try {
    browser = await chromium.launch({ headless: true, executablePath: EDGE_PATH })
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()

    await page.goto(URL, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    log('Initial', await getDetailedState(page))
    await capture(page, '01-initial')

    await page.locator('button[aria-label="切换为深色模式"], button[aria-label="切换为浅色模式"]').first().click()
    await page.waitForTimeout(800)

    log('After toggle', await getDetailedState(page))
    await capture(page, '02-after-toggle')

    console.log('\nDone.')
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    if (browser) await browser.close()
  }
})()
