import { chromium } from "@playwright/test"
import { AxeBuilder } from "@axe-core/playwright"
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" })
const p = await ctx.newPage()
await p.goto("http://localhost:4399/", { waitUntil: "networkidle" })
const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
for (const v of r.violations)
    for (const n of v.nodes) console.log(v.id, n.target.join(" "), "|", n.any[0]?.message?.slice(0, 120))
await b.close()
