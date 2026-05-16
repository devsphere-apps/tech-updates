/**
 * GitHub Pages project URL: /<repo>/  → marketing at /tech-updates/index.html,
 * osmosfeed reader at /tech-updates/feed/ (relative "feed/" links on landing work).
 *
 * Flow: backup landing + cache seed + SEO → empty public/ → osmosfeed build
 * → move all generator output into public/feed/ → restore landing + SEO.
 * On any failure, public/ is cleared of partial output and landing/SEO restored.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const feedDir = path.join(publicDir, "feed");
const configPath = path.join(root, "osmosfeed.yaml");
const publicLanding = path.join(publicDir, "index.html");
const landingSrc = path.join(root, "landing", "index.html");
const landingStash = path.join(root, ".build-landing-index.html");
const cacheStash = path.join(root, ".build-osmosfeed-cache.json");
const seoStashDir = path.join(root, ".build-public-seo-stash");
const stylesStashDir = path.join(root, ".build-public-styles-stash");
const scriptsStashDir = path.join(root, ".build-public-scripts-stash");
const configStash = path.join(root, ".build-osmosfeed-config.yaml");
const LANGCHAIN_SOURCE_URL = "https://blog.langchain.dev/rss/";
const LANGCHAIN_BLOG_URL = "https://www.langchain.com/blog";
const DEEPLEARNING_SOURCE_URL = "https://www.deeplearning.ai/feed/";
const DEEPLEARNING_BATCH_URL = "https://www.deeplearning.ai/the-batch/";
const HUGGINGFACE_SOURCE_URL = "https://huggingface.co/blog/feed.xml";
const PROXY_HOST = "127.0.0.1";
const PROXY_PORT = 43123;
const PROXY_BASE_URL = `http://${PROXY_HOST}:${PROXY_PORT}`;
const SOURCE_PROXIES = [
  {
    sourceUrl: LANGCHAIN_SOURCE_URL,
    proxyPath: "/langchain.xml",
    buildXml: fetchLangChainProxyXml,
  },
  {
    sourceUrl: DEEPLEARNING_SOURCE_URL,
    proxyPath: "/deeplearning.xml",
    buildXml: fetchDeepLearningProxyXml,
  },
  {
    sourceUrl: HUGGINGFACE_SOURCE_URL,
    proxyPath: "/huggingface.xml",
    buildXml: fetchHuggingFaceProxyXml,
  },
];

async function runOsmosfeed() {
  const child = spawn("npx", ["osmosfeed", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", resolve);
  });

  if (exitCode !== 0) {
    const code = exitCode ?? 1;
    throw new Error(`osmosfeed build failed (exit ${code})`);
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapCdata(value) {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function toAbsoluteUrl(input, baseUrl) {
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return null;
  }
}

function toRssDate(input) {
  const parsedDate = new Date(input);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toUTCString();
  }
  return parsedDate.toUTCString();
}

function renderRssItem(item) {
  const categories = (item.categories ?? [])
    .map((category) => `<category>${escapeXml(category)}</category>`)
    .join("");
  const mediaThumbnail = item.imageUrl
    ? `<media:thumbnail url="${escapeXml(item.imageUrl)}" />`
    : "";
  const author = item.authors?.length
    ? `<author>${escapeXml(item.authors.join(", "))}</author>`
    : "";

  return `<item>
  <title>${wrapCdata(item.title)}</title>
  <link>${escapeXml(item.link)}</link>
  <guid>${escapeXml(item.guid ?? item.link)}</guid>
  <description>${wrapCdata(item.description)}</description>
  <pubDate>${escapeXml(item.pubDate)}</pubDate>
  ${author}
  ${categories}
  ${mediaThumbnail}
</item>`;
}

function renderRssFeed({ title, link, description, items }) {
  const channelItems = items.map(renderRssItem).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(link)}</link>
  <description>${escapeXml(description)}</description>
  ${channelItems}
</channel>
</rss>`;
}

function buildLangChainProxyXml(html, baseUrl) {
  const $ = load(html);
  const seenLinks = new Set();
  const items = [];

  $(".blog-item").each((_, element) => {
    const item = $(element);
    const relativeLink = item.find(".blog-link-absolute").attr("href");
    const link = relativeLink ? toAbsoluteUrl(relativeLink, baseUrl) : null;
    const title = item.find("h2, h3").first().text().trim();

    if (!link || !title || seenLinks.has(link)) {
      return;
    }

    seenLinks.add(link);

    const categories = item
      .find(".blog-categories-label")
      .map((__, categoryElement) => $(categoryElement).text().trim())
      .get()
      .filter(Boolean);
    const authors = item
      .find(".blog-author-inner-wrapper .t-paragraph-3-rg")
      .map((__, authorElement) => $(authorElement).text().trim())
      .get()
      .filter(Boolean);
    const dateText = item.find(".date-color").first().text().trim();
    const imageUrl = item.find(".blog-thumbnail").attr("src")?.trim() ?? null;
    const summaryParts = [];

    if (categories.length) {
      summaryParts.push(categories.join(" / "));
    }
    if (authors.length) {
      summaryParts.push(`By ${authors.join(", ")}`);
    }
    if (dateText) {
      summaryParts.push(dateText);
    }

    items.push({
      title,
      link,
      categories,
      authors,
      pubDate: toRssDate(dateText),
      imageUrl,
      description:
        summaryParts.join(" — ") ||
        "Latest updates on LangChain, LangGraph, and agent engineering.",
    });
  });

  if (!items.length) {
    throw new Error("LangChain blog proxy could not extract any articles");
  }

  return renderRssFeed({
    title: "LangChain Blog",
    link: LANGCHAIN_BLOG_URL,
    description: "Technical updates on LangChain, LangGraph, and agent engineering.",
    items,
  });
}

async function fetchLangChainProxyXml() {
  const response = await fetch(LANGCHAIN_SOURCE_URL, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; tech-updates-build/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`LangChain source request failed (${response.status})`);
  }

  const html = await response.text();
  return buildLangChainProxyXml(html, response.url || LANGCHAIN_BLOG_URL);
}

function buildDeepLearningProxyXml(html, baseUrl) {
  const $ = load(html);
  const seenLinks = new Set();
  const items = [];

  $("article[data-testid]").each((_, element) => {
    const item = $(element);
    const relativeLink = item.find('a[href^="/the-batch/"]').last().attr("href");
    const link = relativeLink ? toAbsoluteUrl(relativeLink, baseUrl) : null;
    const title = item.find("h2, h3").first().text().trim();

    if (!link || !title || seenLinks.has(link)) {
      return;
    }

    seenLinks.add(link);

    const dateText = item.find('a[href*="/the-batch/tag/"]').first().text().trim();
    const noscriptImage = item.find("noscript img").first().attr("src")?.trim() ?? null;

    items.push({
      title,
      link,
      guid: link,
      categories: ["DeepLearning.AI", "The Batch"],
      authors: [],
      pubDate: toRssDate(dateText),
      imageUrl: noscriptImage,
      description: dateText
        ? `DeepLearning.AI The Batch — ${dateText}`
        : "DeepLearning.AI news, courses, and AI learning resources.",
    });
  });

  if (!items.length) {
    throw new Error("DeepLearning.AI proxy could not extract any articles");
  }

  return renderRssFeed({
    title: "DeepLearning.AI — The Batch",
    link: DEEPLEARNING_BATCH_URL,
    description: "AI news, short courses, and learning resources from DeepLearning.AI.",
    items: items.slice(0, 24),
  });
}

async function fetchDeepLearningProxyXml() {
  const response = await fetch(DEEPLEARNING_BATCH_URL, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; tech-updates-build/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`DeepLearning.AI source request failed (${response.status})`);
  }

  const html = await response.text();
  return buildDeepLearningProxyXml(html, response.url || DEEPLEARNING_BATCH_URL);
}

function buildTrimmedXmlFeed(xml, defaults, itemLimit) {
  const $ = load(xml, { xmlMode: true });
  const channel = $("channel").first();
  const title = channel.find("title").first().text().trim() || defaults.title;
  const link = channel.find("link").first().text().trim() || defaults.link;
  const description =
    channel.find("description").first().text().trim() || defaults.description;
  const items = [];

  channel.find("item").slice(0, itemLimit).each((_, element) => {
    const item = $(element);
    const titleText = item.find("title").first().text().trim();
    const linkText = item.find("link").first().text().trim();

    if (!titleText || !linkText) {
      return;
    }

    items.push({
      title: titleText,
      link: linkText,
      guid: item.find("guid").first().text().trim() || linkText,
      categories: item
        .find("category")
        .map((__, categoryElement) => $(categoryElement).text().trim())
        .get()
        .filter(Boolean),
      authors: [],
      pubDate: toRssDate(item.find("pubDate").first().text().trim()),
      imageUrl:
        item.find("media\\:thumbnail").first().attr("url")?.trim() ?? null,
      description:
        item.find("description").first().text().trim() ||
        defaults.description,
    });
  });

  if (!items.length) {
    throw new Error(`${defaults.title} proxy could not extract any items`);
  }

  return renderRssFeed({
    title,
    link,
    description,
    items,
  });
}

async function fetchHuggingFaceProxyXml() {
  const response = await fetch(HUGGINGFACE_SOURCE_URL, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; tech-updates-build/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Hugging Face feed request failed (${response.status})`);
  }

  const xml = await response.text();
  return buildTrimmedXmlFeed(
    xml,
    {
      title: "Hugging Face - Blog",
      link: "https://huggingface.co/blog",
      description: "The Hugging Face blog",
    },
    18,
  );
}

async function listen(server, port, host) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function withFeedProxy(rawConfig, runBuild) {
  const activeProxies = SOURCE_PROXIES.filter((proxy) =>
    rawConfig.includes(proxy.sourceUrl),
  );

  if (!activeProxies.length) {
    await runBuild(rawConfig);
    return;
  }

  const proxyPayloads = await Promise.all(
    activeProxies.map(async (proxy) => ({
      ...proxy,
      xml: await proxy.buildXml(),
    })),
  );
  const server = createServer((request, response) => {
    const matchedProxy = proxyPayloads.find(
      (proxy) => request.url === proxy.proxyPath,
    );

    if (!matchedProxy) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(matchedProxy.xml);
  });

  await listen(server, PROXY_PORT, PROXY_HOST);

  try {
    let rewrittenConfig = rawConfig;
    for (const proxy of proxyPayloads) {
      rewrittenConfig = rewrittenConfig.replaceAll(
        proxy.sourceUrl,
        `${PROXY_BASE_URL}${proxy.proxyPath}`,
      );
    }
    await runBuild(rewrittenConfig);
  } finally {
    await closeServer(server);
  }
}

async function main() {
  await fs.ensureDir(publicDir);

  // Interrupted previous run: no homepage on disk but stash exists
  if (
    !(await fs.pathExists(publicLanding)) &&
    (await fs.pathExists(landingStash))
  ) {
    await fs.copy(landingStash, publicLanding);
    console.warn("[build] Restored public/index.html from .build-landing-index.html");
  }

  // Canonical landing bytes for this run (public wins over landing/)
  if (await fs.pathExists(publicLanding)) {
    await fs.copy(publicLanding, landingStash, { overwrite: true });
  } else if (await fs.pathExists(landingSrc)) {
    await fs.copy(landingSrc, landingStash, { overwrite: true });
  } else {
    console.error(
      "[build] Missing homepage source: need public/index.html or landing/index.html",
    );
    process.exit(1);
  }

  if (await fs.pathExists(configPath)) {
    await fs.copy(configPath, configStash, { overwrite: true });
  }

  // Incremental cache: keep last feed cache outside public before we wipe it
  const prevCache = path.join(feedDir, "cache.json");
  if (await fs.pathExists(prevCache)) {
    await fs.copy(prevCache, cacheStash, { overwrite: true });
  } else {
    await fs.remove(cacheStash).catch(() => {});
  }

  // Keep robots/sitemap across clean (not generated by osmosfeed)
  await fs.remove(seoStashDir).catch(() => {});
  await fs.ensureDir(seoStashDir);
  for (const name of ["robots.txt", "sitemap.xml"]) {
    const p = path.join(publicDir, name);
    if (await fs.pathExists(p)) {
      await fs.copy(p, path.join(seoStashDir, name), { overwrite: true });
    }
  }

  await fs.remove(stylesStashDir).catch(() => {});
  const publicStyles = path.join(publicDir, "styles");
  if (await fs.pathExists(publicStyles)) {
    await fs.copy(publicStyles, stylesStashDir, { overwrite: true });
  }

  await fs.remove(scriptsStashDir).catch(() => {});
  const publicScripts = path.join(publicDir, "scripts");
  if (await fs.pathExists(publicScripts)) {
    await fs.copy(publicScripts, scriptsStashDir, { overwrite: true });
  }

  let buildFailed = false;

  try {
    await fs.emptyDir(publicDir);

    if (await fs.pathExists(cacheStash)) {
      await fs.copy(cacheStash, path.join(publicDir, "cache.json"));
    }

    const originalConfig = await fs.readFile(configPath, "utf8");
    await withFeedProxy(originalConfig, async (configText) => {
      await fs.writeFile(configPath, configText);
      await runOsmosfeed();
    });

    await fs.ensureDir(feedDir);
    const top = await fs.readdir(publicDir);
    for (const name of top) {
      if (name === "feed") continue;
      const from = path.join(publicDir, name);
      const to = path.join(feedDir, name);
      await fs.move(from, to, { overwrite: true });
    }
  } catch (err) {
    buildFailed = true;
    console.error("[build]", err.message || err);
    await fs.emptyDir(publicDir).catch(() => {});
  } finally {
    await fs.ensureDir(publicDir);
    if (await fs.pathExists(landingStash)) {
      await fs.copy(landingStash, publicLanding, { overwrite: true });
    }
    if (await fs.pathExists(configStash)) {
      await fs.copy(configStash, configPath, { overwrite: true });
    }
    if (await fs.pathExists(seoStashDir)) {
      const files = await fs.readdir(seoStashDir).catch(() => []);
      for (const name of files) {
        await fs.copy(
          path.join(seoStashDir, name),
          path.join(publicDir, name),
          { overwrite: true },
        );
      }
    }
    if (await fs.pathExists(stylesStashDir)) {
      await fs.copy(stylesStashDir, path.join(publicDir, "styles"), {
        overwrite: true,
      });
    }
    if (await fs.pathExists(scriptsStashDir)) {
      await fs.copy(scriptsStashDir, path.join(publicDir, "scripts"), {
        overwrite: true,
      });
    }
    await fs.remove(configStash).catch(() => {});
    await fs.ensureDir(feedDir);
  }

  if (buildFailed) {
    process.exit(1);
  }

  const feedIndex = path.join(feedDir, "index.html");
  if (!(await fs.pathExists(feedIndex))) {
    console.error("[build] Missing public/feed/index.html after build");
    process.exit(1);
  }

  console.log(
    "[build] OK — landing: public/index.html · reader: public/feed/index.html",
  );
}

main().catch((e) => {
  console.error("[build]", e);
  process.exit(1);
});
