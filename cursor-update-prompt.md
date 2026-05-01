# Tech-Updates — Cursor AI Update Prompt
## Changes: Section Reorder + New Categories (Tips & Tricks / Free AI Tools)

> Paste this entire document into Cursor AI Composer mode.
> This is an update on top of the existing redesign — do not rebuild from scratch.
> Work phase by phase and verify each step before continuing.

---

## CONTEXT

The product is **Tech-updates** — a curated AI & Cybersecurity news feed on GitHub Pages (static HTML/CSS/JS). The redesign from the previous prompt is already live. Now we need two things:

1. **Landing page:** Move "How it works" section lower, and add a new **"Tips & Tricks + Free AI Tools"** section above it.
2. **Feed page:** Add two new category tabs and their corresponding feed items.

Do not change any design tokens, fonts, colors, or component styles unless explicitly told to below.

---

## CHANGE 1 — LANDING PAGE: SECTION REORDER

### Current order (what exists now):
1. Nav
2. Hero
3. Ticker strip
4. **How it works** ← MOVE THIS DOWN
5. Categories
6. Latest signal (spotlight grid)
7. CTA
8. Footer

### New order (what it should be after this change):
1. Nav
2. Hero
3. Ticker strip
4. Categories
5. Latest signal (spotlight grid)
6. **NEW: Tips & Tricks + Free AI Tools** ← ADD THIS HERE
7. **How it works** ← MOVED DOWN HERE
8. CTA
9. Footer

### Why this order:
- Hero → Ticker creates immediate energy and shows the product is alive.
- Categories → Latest signal gives users a reason to stay ("here's what's in it").
- Tips & Tricks + AI Tools is discovery content — a hook that adds value beyond news.
- "How it works" becomes a trust-builder before the final CTA, not a barrier at the top.

### Implementation instruction for Cursor:
In `index.html`, cut the entire `<section class="how-it-works" ...>` block and paste it between the new Tips & Tricks section and the CTA section. No CSS changes needed — only HTML reordering.

---

## CHANGE 2 — NEW LANDING PAGE SECTION: TIPS & TRICKS + FREE AI TOOLS

Add this as a new section in `index.html` between "Latest signal" and "How it works".

### Section design rules:
- Background: `var(--color-bg-subtle)` — same as Categories section, creates visual rhythm
- Max width: `var(--landing-max-width)` = 1100px, centered
- Padding: `var(--space-16)` top/bottom, `var(--space-6)` left/right
- Section has two sub-columns side by side (Tips & Tricks | Free AI Tools)
- On mobile (< 768px): stacks vertically

### HTML to add:

```html
<!-- TIPS, TRICKS & FREE AI TOOLS SECTION -->
<section class="discovery-section" id="discovery">
  <div class="discovery-inner">

    <div class="discovery-header">
      <h2 class="section-heading">Discover more signal</h2>
      <p class="section-subheading">Beyond the headlines — tools and tricks that actually move the needle.</p>
    </div>

    <div class="discovery-grid">

      <!-- LEFT COLUMN: Tips & Tricks -->
      <div class="discovery-column">
        <div class="discovery-column-header">
          <span class="tag tag-tips">Tips & Tricks</span>
          <h3 class="discovery-column-title">Coding & tech, simplified</h3>
          <p class="discovery-column-desc">Practical techniques from developers, engineers, and builders — condensed into things you can actually use today.</p>
        </div>

        <div class="discovery-feed">
          <!-- These are static placeholders — JS will replace with live data if RSS is wired -->
          <!-- Keep 4 items max for landing page -->

          <a href="/feed#tips" class="discovery-card" data-category="tips">
            <div class="discovery-card-meta">
              <span class="tag tag-tips">Tips & Tricks</span>
              <span class="card-time">2h ago</span>
            </div>
            <div class="discovery-card-title">Stop writing useEffect for data fetching — here's the pattern that actually scales</div>
          </a>

          <a href="/feed#tips" class="discovery-card" data-category="tips">
            <div class="discovery-card-meta">
              <span class="tag tag-tips">Tips & Tricks</span>
              <span class="card-time">5h ago</span>
            </div>
            <div class="discovery-card-title">Git aliases that save 30 minutes every day — a senior dev's dotfile secrets</div>
          </a>

          <a href="/feed#tips" class="discovery-card" data-category="tips">
            <div class="discovery-card-meta">
              <span class="tag tag-tips">Tips & Tricks</span>
              <span class="card-time">8h ago</span>
            </div>
            <div class="discovery-card-title">Terminal tricks most developers don't know exist (but should)</div>
          </a>

          <a href="/feed#tips" class="discovery-card" data-category="tips">
            <div class="discovery-card-meta">
              <span class="tag tag-tips">Tips & Tricks</span>
              <span class="card-time">1d ago</span>
            </div>
            <div class="discovery-card-title">How to read a CVE report like a security engineer — a practical guide</div>
          </a>

        </div>

        <a href="/feed" class="discovery-see-more">See all tips & tricks →</a>
      </div>


      <!-- RIGHT COLUMN: Free AI Tools -->
      <div class="discovery-column">
        <div class="discovery-column-header">
          <span class="tag tag-aitools">Free AI Tools</span>
          <h3 class="discovery-column-title">What's actually free & useful</h3>
          <p class="discovery-column-desc">The latest free AI tools worth knowing. We filter out the hype — only tools with real use cases make the list.</p>
        </div>

        <div class="discovery-feed">

          <a href="/feed#aitools" class="discovery-card" data-category="aitools">
            <div class="discovery-card-meta">
              <span class="tag tag-aitools">Free AI Tool</span>
              <span class="card-time">1h ago</span>
            </div>
            <div class="discovery-card-title">Fabric — open-source AI framework to augment humans using a set of Markdown-based prompts</div>
            <div class="discovery-card-url">github.com/danielmiessler/fabric</div>
          </a>

          <a href="/feed#aitools" class="discovery-card" data-category="aitools">
            <div class="discovery-card-meta">
              <span class="tag tag-aitools">Free AI Tool</span>
              <span class="card-time">3h ago</span>
            </div>
            <div class="discovery-card-title">Msty — run LLMs locally, free, with a beautiful native UI. No cloud required.</div>
            <div class="discovery-card-url">msty.app</div>
          </a>

          <a href="/feed#aitools" class="discovery-card" data-category="aitools">
            <div class="discovery-card-meta">
              <span class="tag tag-aitools">Free AI Tool</span>
              <span class="card-time">6h ago</span>
            </div>
            <div class="discovery-card-title">OpenHands — open-source AI software developer that can write code, fix bugs, run tests</div>
            <div class="discovery-card-url">github.com/All-Hands-AI/OpenHands</div>
          </a>

          <a href="/feed#aitools" class="discovery-card" data-category="aitools">
            <div class="discovery-card-meta">
              <span class="tag tag-aitools">Free AI Tool</span>
              <span class="card-time">12h ago</span>
            </div>
            <div class="discovery-card-title">Lobe Chat — free, open-source ChatGPT/Claude UI that supports every major model provider</div>
            <div class="discovery-card-url">github.com/lobehub/lobe-chat</div>
          </a>

        </div>

        <a href="/feed" class="discovery-see-more">See all free AI tools →</a>
      </div>

    </div>
  </div>
</section>
```

---

## CHANGE 3 — NEW CSS FOR DISCOVERY SECTION

Add to `styles/landing.css`:

```css
/* ============================================================
   DISCOVERY SECTION — Tips & Tricks + Free AI Tools
   ============================================================ */

/* New category tag colors */

/* Tips & Tricks — Warm Orange */
.tag-tips {
  background: #FEF0E0;
  color: #8A4A00;
  border-color: #F9CFA0;
}

/* Free AI Tools — Violet */
.tag-aitools {
  background: #F2EFFE;
  color: #4A2D9C;
  border-color: #C9BCFA;
}

/* Dark mode overrides for new tags */
[data-theme="dark"] .tag-tips,
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .tag-tips {
    background: #2D1A00;
    color: #F0AA55;
    border-color: #5A3600;
  }
}

[data-theme="dark"] .tag-aitools,
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .tag-aitools {
    background: #1C1040;
    color: #B09AF8;
    border-color: #352880;
  }
}

/* Section wrapper */
.discovery-section {
  background: var(--color-bg-subtle);
  padding: var(--space-16) var(--space-6);
}

.discovery-inner {
  max-width: var(--landing-max-width);
  margin: 0 auto;
}

.discovery-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

/* Two-column grid */
.discovery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

@media (max-width: 768px) {
  .discovery-grid {
    grid-template-columns: 1fr;
  }
}

/* Each column */
.discovery-column {
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.discovery-column-header {
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 0.5px solid var(--color-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.discovery-column-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-regular);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
}

.discovery-column-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

/* Feed list inside column */
.discovery-feed {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Each card in the discovery feed */
.discovery-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  border-bottom: 0.5px solid var(--color-border-subtle);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.discovery-card:last-child {
  border-bottom: none;
}

.discovery-card:hover {
  background: var(--color-bg-subtle);
}

.discovery-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.discovery-card-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  line-height: var(--leading-snug);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tool URL display — only for AI Tools cards */
.discovery-card-url {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0;
}

/* "See all" link at bottom of column */
.discovery-see-more {
  display: block;
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  text-decoration: none;
  border-top: 0.5px solid var(--color-border-subtle);
  transition: color var(--transition-fast);
  background: var(--color-bg-subtle);
}

.discovery-see-more:hover {
  color: var(--color-text-primary);
}
```

---

## CHANGE 4 — FEED PAGE: NEW CATEGORY TABS

In `feed/index.html`, add two new tabs to the `.feed-header` filter strip:

```html
<!-- ADD THESE TWO TABS after the existing tabs -->
<button class="filter-tab" data-filter="tips">Tips & Tricks</button>
<button class="filter-tab" data-filter="aitools">Free AI Tools</button>
```

The full updated tab list should be:
```html
<div class="feed-header" id="feed-header">
  <button class="filter-tab active" data-filter="all">All</button>
  <button class="filter-tab" data-filter="ai">AI</button>
  <button class="filter-tab" data-filter="cybersecurity">Cybersecurity</button>
  <button class="filter-tab" data-filter="ml">Machine Learning</button>
  <button class="filter-tab" data-filter="hn">Hacker News</button>
  <button class="filter-tab" data-filter="netsec">Security Research</button>
  <button class="filter-tab" data-filter="gh">GitHub</button>
  <button class="filter-tab" data-filter="tips">Tips & Tricks</button>
  <button class="filter-tab" data-filter="aitools">Free AI Tools</button>
</div>
```

---

## CHANGE 5 — FEED PAGE: NEW FEED ITEMS FOR TIPS & TRICKS

Add these feed items in `feed/index.html` inside `#feed-content`, after the existing items. Add a fresh date divider before the Tips & Tricks block:

```html
<!-- TIPS & TRICKS FEED ITEMS -->
<!-- These get their own date divider to visually separate the new content type -->
<div class="date-divider">Tips & Tricks</div>

<a href="https://dev.to/t/tips" target="_blank" rel="noopener" class="feed-card featured" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">dev.to</span>
    <span class="card-time">2h ago</span>
  </div>
  <div class="card-title">Stop writing useEffect for data fetching — here's the React pattern that actually scales</div>
  <div class="card-preview">A practical breakdown of React Query, SWR, and the new use() hook — when to use each, and why mixing them causes the bugs you can't reproduce.</div>
</a>

<a href="https://dev.to/t/git" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">dev.to</span>
    <span class="card-time">5h ago</span>
  </div>
  <div class="card-title">Git aliases that save 30 minutes every day — a senior dev's dotfile secrets</div>
  <div class="card-preview">git cm, git undo, git wip — the aliases that experienced engineers swear by but rarely document.</div>
</a>

<a href="https://www.reddit.com/r/commandline" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">r/commandline</span>
    <span class="card-time">8h ago</span>
  </div>
  <div class="card-title">Terminal tricks most developers don't know exist — but definitely should</div>
  <div class="card-preview">fzf, ripgrep, bat, zoxide — the modern Unix toolkit that makes navigating your machine 10x faster.</div>
</a>

<a href="https://news.ycombinator.com/item?id=tips" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">Hacker News</span>
    <span class="card-time">10h ago</span>
  </div>
  <div class="card-title">How to read a CVE report like a security engineer — a practical field guide</div>
  <div class="card-preview">Translating CVSS scores, affected versions, and exploit conditions into something your team can actually act on.</div>
</a>

<a href="https://dev.to/t/python" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">dev.to</span>
    <span class="card-time">12h ago</span>
  </div>
  <div class="card-title">Python one-liners that every developer should know — from list comprehensions to walrus operators</div>
</a>

<a href="https://www.reddit.com/r/webdev" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">r/webdev</span>
    <span class="card-time">1d ago</span>
  </div>
  <div class="card-title">CSS container queries are finally ready to replace media queries — here's how to migrate</div>
</a>

<a href="https://dev.to/t/vscode" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">dev.to</span>
    <span class="card-time">1d ago</span>
  </div>
  <div class="card-title">VS Code shortcuts most developers never discover — the ones that actually save time</div>
</a>

<a href="https://www.reddit.com/r/ExperiencedDevs" target="_blank" rel="noopener" class="feed-card" data-category="tips">
  <div class="card-meta">
    <span class="tag tag-tips">Tips & Tricks</span>
    <span class="card-dot"></span>
    <span class="card-source">r/ExperiencedDevs</span>
    <span class="card-time">2d ago</span>
  </div>
  <div class="card-title">How I structure my code reviews to actually improve quality — not just catch bugs</div>
</a>
```

---

## CHANGE 6 — FEED PAGE: NEW FEED ITEMS FOR FREE AI TOOLS

Add immediately after the Tips & Tricks block:

```html
<!-- FREE AI TOOLS FEED ITEMS -->
<div class="date-divider">Free AI Tools</div>

<a href="https://github.com/danielmiessler/fabric" target="_blank" rel="noopener" class="feed-card featured" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">GitHub</span>
    <span class="card-time">1h ago</span>
  </div>
  <div class="card-title">Fabric — open-source AI framework to augment humans using a modular set of Markdown prompts</div>
  <div class="card-preview">Fabric is designed to help humans apply AI to everyday challenges. It provides a CLI and web UI with a huge library of "patterns" — reusable AI prompts for writing, summarizing, analyzing, and more. Completely free and self-hostable.</div>
</a>

<a href="https://msty.app" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">msty.app</span>
    <span class="card-time">3h ago</span>
  </div>
  <div class="card-title">Msty — run LLMs locally, completely free, with a polished native desktop UI. No cloud, no subscription.</div>
  <div class="card-preview">Download Llama, Mistral, Phi, and more with one click. Chat stays on your machine. Works offline.</div>
</a>

<a href="https://github.com/All-Hands-AI/OpenHands" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">GitHub</span>
    <span class="card-time">6h ago</span>
  </div>
  <div class="card-title">OpenHands — open-source AI agent that can write code, fix bugs, run terminal commands, and browse the web</div>
  <div class="card-preview">The free alternative to Devin. Give it a task, it opens a browser, writes code, and ships. Fully self-hostable on your own machine or server.</div>
</a>

<a href="https://github.com/lobehub/lobe-chat" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">GitHub</span>
    <span class="card-time">12h ago</span>
  </div>
  <div class="card-title">Lobe Chat — free, open-source chat UI that supports Claude, GPT-4, Gemini, Ollama, and every major model</div>
  <div class="card-preview">One interface for all your AI providers. Plugin system, image generation, voice, file upload. Self-host in one command with Docker.</div>
</a>

<a href="https://github.com/openai/whisper" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">GitHub</span>
    <span class="card-time">1d ago</span>
  </div>
  <div class="card-title">Whisper — OpenAI's free, open-source speech recognition that runs entirely on your machine</div>
</a>

<a href="https://notebooklm.google.com" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">Google Labs</span>
    <span class="card-time">1d ago</span>
  </div>
  <div class="card-title">NotebookLM — Google's free AI research assistant that reads your documents and answers questions about them</div>
  <div class="card-preview">Upload PDFs, Docs, YouTube videos, or audio files. NotebookLM builds a private AI tutor trained only on your sources. Audio overviews are remarkable.</div>
</a>

<a href="https://github.com/Significant-Gravitas/AutoGPT" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">GitHub</span>
    <span class="card-time">2d ago</span>
  </div>
  <div class="card-title">AutoGPT — the original open-source AI agent framework. Still the most flexible for custom autonomous workflows</div>
</a>

<a href="https://www.perplexity.ai" target="_blank" rel="noopener" class="feed-card" data-category="aitools">
  <div class="card-meta">
    <span class="tag tag-aitools">Free AI Tool</span>
    <span class="card-dot"></span>
    <span class="card-source">Perplexity AI</span>
    <span class="card-time">2d ago</span>
  </div>
  <div class="card-title">Perplexity — free AI search engine with real-time web access, citations, and follow-up questions built in</div>
</a>
```

---

## CHANGE 7 — CSS FOR NEW FEED TAG COLORS

Add to `styles/components.css` (the shared component file, not landing.css — these tags are used on the feed page too):

```css
/* NEW CATEGORY TAGS — added in update */

/* Tips & Tricks — Warm Orange */
.tag-tips {
  background: #FEF0E0;
  color: #8A4A00;
  border-color: #F9CFA0;
}

/* Free AI Tools — Violet */
.tag-aitools {
  background: #F2EFFE;
  color: #4A2D9C;
  border-color: #C9BCFA;
}

/* Dark mode */
[data-theme="dark"] .tag-tips {
  background: #2D1A00;
  color: #F0AA55;
  border-color: #5A3600;
}

[data-theme="dark"] .tag-aitools {
  background: #1C1040;
  color: #B09AF8;
  border-color: #352880;
}
```

---

## CHANGE 8 — CATEGORY MAPPING TABLE (UPDATED)

This is the full updated table. Use it to set `data-category` and tag class on every feed item:

| Category label | `data-category` | Tag class | Tag text |
|---|---|---|---|
| Artificial Intelligence (AI) | `ai` | `tag-ai` | Artificial Intelligence |
| cybersecurity | `cybersecurity` | `tag-cyber` | Cybersecurity |
| Machine Learning | `ml` | `tag-ml` | Machine Learning |
| Hacker News: Front Page | `hn` | `tag-hn` | Hacker News |
| Technical Information Security | `netsec` | `tag-netsec` | Security Research |
| The GitHub Blog | `gh` | `tag-gh` | GitHub |
| Tips & Tricks (coding/tech) | `tips` | `tag-tips` | Tips & Tricks |
| Free AI Tools | `aitools` | `tag-aitools` | Free AI Tool |

---

## CONTENT SOURCING STRATEGY (for future live data)

When you wire up live RSS/API feeds later, use these sources per category:

### Tips & Tricks sources:
- `https://dev.to/feed/tag/tips` — Dev.to tips tag RSS
- `https://dev.to/feed/tag/tutorial` — Dev.to tutorials RSS
- `https://www.reddit.com/r/webdev/top.rss?t=day`
- `https://www.reddit.com/r/ExperiencedDevs/top.rss?t=day`
- `https://www.reddit.com/r/commandline/top.rss?t=day`
- `https://news.ycombinator.com/rss` — filter for "Show HN" and tutorial posts

### Free AI Tools sources:
- `https://www.reddit.com/r/singularity/top.rss?t=day` — frequently covers new free tools
- `https://www.reddit.com/r/LocalLLaMA/top.rss?t=day` — open-source AI tools community
- `https://www.reddit.com/r/artificial/top.rss?t=day`
- `https://news.ycombinator.com/rss` — filter for GitHub links with "free", "open-source", "tool"
- `https://github.com/trending` — scrape daily trending repos
- ProductHunt API — filter for "AI" + "Free" tagged launches

### Keyword filters for Free AI Tools (to exclude paid tools):
Only include items containing these keywords in title or body:
`free`, `open-source`, `open source`, `self-host`, `local`, `MIT license`, `no subscription`, `community edition`

---

## IMPLEMENTATION CHECKLIST

Work through these in exact order:

### Phase 1 — Landing page reorder (5 minutes)
- [ ] In `index.html`, cut the `<section class="how-it-works">` block
- [ ] Paste it between the new Discovery section and the CTA section
- [ ] Verify the section order matches the spec above
- [ ] Save and check in browser — no visual changes should appear yet

### Phase 2 — New CSS tokens (5 minutes)
- [ ] Add `.tag-tips` and `.tag-aitools` to `styles/components.css`
- [ ] Add both dark mode overrides
- [ ] Verify tags render correctly in light and dark mode
- [ ] Do NOT add these to `landing.css` — they live in `components.css` only

### Phase 3 — Discovery section on landing (20 minutes)
- [ ] Add the full Discovery section HTML between "Latest signal" and "How it works"
- [ ] Add Discovery section CSS to `styles/landing.css`
- [ ] Verify two-column layout at 1100px width
- [ ] Verify single-column layout at 768px and below
- [ ] Verify hover states on `.discovery-card`
- [ ] Check that "See all" links go to `/feed`

### Phase 4 — Feed page new tabs (5 minutes)
- [ ] Add "Tips & Tricks" and "Free AI Tools" tabs to `feed-header`
- [ ] Verify existing filter logic in `feed.js` handles new `data-filter` values automatically
- [ ] Test: click "Tips & Tricks" tab → only `data-category="tips"` cards visible
- [ ] Test: click "Free AI Tools" tab → only `data-category="aitools"` cards visible
- [ ] Test: click "All" → all cards visible

### Phase 5 — Feed items (20 minutes)
- [ ] Add all Tips & Tricks feed items with their date divider
- [ ] Add all Free AI Tools feed items with their date divider
- [ ] Verify first card in each new block has `.featured` class
- [ ] Verify all `data-category` attributes match the mapping table
- [ ] Verify all external links open in `target="_blank" rel="noopener"`
- [ ] Check preview text reveals on hover for featured cards

### Phase 6 — Final check
- [ ] Test full filter flow: All → AI → Cybersecurity → Tips & Tricks → Free AI Tools → All
- [ ] Test dark mode on both pages
- [ ] Test on mobile (375px) — discovery grid stacks, feed tabs scroll horizontally
- [ ] Verify no broken styles from the reorder

---

## CRITICAL RULES (same as before, repeated for reference)

1. **Never hardcode colors** — always use `var(--color-*)` tokens
2. **Never use Inter, Roboto, or system-ui** as primary font
3. **All spacing in multiples of 8px** using `--space-*` variables
4. **Every feed card must have `data-category`** for filter to work
5. **Featured = first card per section only** — do not apply `.featured` to multiple consecutive cards
6. **Preview text shown via CSS only** — no JavaScript for hover reveal
7. **New tag classes go in `components.css`**, not `landing.css` — they're shared

---

*End of update prompt. Feed into Cursor Composer and implement phase by phase.*
