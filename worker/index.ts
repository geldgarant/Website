// Cloudflare Worker voor geldgarant.com. De site zelf is statisch (./dist, binding ASSETS); deze worker draait alleen
// voor /api/* (zie run_worker_first in wrangler.jsonc). Alles wat geen API is, gaat ongewijzigd naar de statische site.
import { handleBetalen, type BetaalEnv } from "./betalen"

interface Env extends BetaalEnv {
    ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const { pathname } = new URL(request.url)
        if (pathname === "/api/betalen") return handleBetalen(request, env)
        return env.ASSETS.fetch(request)
    },
}
