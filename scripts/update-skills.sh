#!/usr/bin/env bash
# Haalt de nieuwste versie op van de skills in .claude/skills (zie .claude/skills/THIRD_PARTY.md).
# Draait geen code uit de repositories; kopieert alleen bestanden. Lees daarna `git diff .claude/skills` na
# voordat je commit: nieuwe versies kunnen nieuwe scripts of instructies bevatten.
set -euo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# map | repository | pad in repository
SKILLS=(
    "frontend-design|anthropics/skills|skills/frontend-design"
    "webapp-testing|anthropics/skills|skills/webapp-testing"
    "impeccable|pbakaus/impeccable|plugin/skills/impeccable"
    "ui-ux-pro-max|nextlevelbuilder/ui-ux-pro-max-skill|.claude/skills/ui-ux-pro-max"
    "ui-typography|bencium/bencium-marketplace|typography/skills/typography"
    "web-design-guidelines|vercel-labs/agent-skills|skills/web-design-guidelines"
    "vercel-react-best-practices|vercel-labs/agent-skills|skills/react-best-practices"
    "vercel-composition-patterns|vercel-labs/agent-skills|skills/composition-patterns"
    "astro|astrolicious/agent-skills|skills/astro"
    "frontend-ui-engineering|addyosmani/agent-skills|skills/frontend-ui-engineering"
    "browser-testing-with-devtools|addyosmani/agent-skills|skills/browser-testing-with-devtools"
    "security-and-hardening|addyosmani/agent-skills|skills/security-and-hardening"
    "shipping-and-launch|addyosmani/agent-skills|skills/shipping-and-launch"
    "ci-cd-and-automation|addyosmani/agent-skills|skills/ci-cd-and-automation"
    "systematic-debugging|obra/superpowers|skills/systematic-debugging"
    "verification-before-completion|obra/superpowers|skills/verification-before-completion"
    "writing-plans|obra/superpowers|skills/writing-plans"
)
for s in web-quality-audit performance core-web-vitals seo accessibility best-practices; do
    SKILLS+=("$s|addyosmani/web-quality-skills|skills/$s")
done
for s in gsap-core gsap-timeline gsap-scrolltrigger gsap-plugins gsap-utils gsap-performance; do
    SKILLS+=("$s|greensock/gsap-skills|skills/$s")
done
for s in accessibility-scan accessibility-audit accessibility-inspect accessibility-fix accessibility-diff shared; do
    SKILLS+=("$s|AccessLint/skills|plugins/accesslint/skills/$s")
done

for s in seo-audit seo-technical seo-schema seo-local seo-geo seo-backlinks seo-plan seo-page seo-content seo-content-brief seo-cluster seo-sitemap; do
    SKILLS+=("$s|AgriciDaniel/claude-seo|skills/$s")
done
SKILLS+=("seo-claude|AgriciDaniel/claude-seo|skills/seo") # na bijwerken: name in SKILL.md weer op seo-claude zetten
for s in ai-seo link-building site-architecture copywriting analytics conversion-tracking free-tools; do
    SKILLS+=("$s|coreyhaines31/marketingskills|skills/$s")
done
SKILLS+=("mk-schema|coreyhaines31/marketingskills|skills/schema" "mk-seo-audit|coreyhaines31/marketingskills|skills/seo-audit") # idem: name mk-*

for entry in "${SKILLS[@]}"; do
    IFS="|" read -r name repo path <<<"$entry"
    dir="$TMP/${repo//\//__}"
    [ -d "$dir" ] || git clone -q --depth 1 "https://github.com/$repo.git" "$dir"
    rm -rf "${DEST:?}/$name"
    mkdir -p "$DEST/$name"
    tar -C "$dir/$path" --exclude=.git --exclude=tests --exclude=__pycache__ --exclude=node_modules -cf - . | tar -C "$DEST/$name" -xf -
    echo "bijgewerkt: $name ($repo@$(git -C "$dir" rev-parse --short HEAD))"
done
echo "Klaar. Controleer: git diff --stat .claude/skills"
