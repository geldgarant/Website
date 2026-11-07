import fs from "node:fs"
import path from "node:path"
import { branches } from "../../src/data/site"
import { vacatures } from "../../src/data/vacatures"

// Alle statische routes uit src/pages. Nieuwe pagina's worden automatisch meegetest.
const root = path.resolve("src/pages")
function walk(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) return walk(p)
        if (!/\.(astro|md|mdx)$/.test(e.name) || e.name.includes("[")) return []
        return [p]
    })
}
export const routes = walk(root)
    .map(
        (f) =>
            "/" +
            path
                .relative(root, f)
                .replace(/\\/g, "/")
                .replace(/\.(astro|md|mdx)$/, "")
                .replace(/(^|\/)index$/, ""),
    )
    .map((r) => (r === "/" ? r : r.replace(/\/$/, "")))
    .filter((r) => r !== "/404")
    .concat(branches.map((b) => `/branches/${b.slug}`)) // dynamische routes uit [slug].astro
    .concat(vacatures.map((v) => `/werken-bij/${v.slug}`))
    .concat(
        fs
            .readdirSync(path.resolve("src/content/kennisbank"))
            .filter((f) => f.endsWith(".md"))
            .map((f) => `/kennisbank/${f.replace(/\.md$/, "")}`),
    )
    .sort()
