import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto("http://localhost:4399/", { waitUntil: "networkidle" })
console.log(
    await p.evaluate(() => {
        const vw = 390
        const res = [...document.querySelectorAll("body *")]
            .filter((el) => {
                const r = el.getBoundingClientRect()
                return r.width > 0 && r.right > vw + 1
            })
            .filter((el) => !el.parentElement.closest("[data-scroller]"))
            .slice(0, 8)
            .map(
                (el) =>
                    el.tagName +
                    "." +
                    el.className.toString().slice(0, 50) +
                    " w=" +
                    Math.round(el.getBoundingClientRect().width),
            )
        return { sw: document.documentElement.scrollWidth, res }
    }),
)
await b.close()
