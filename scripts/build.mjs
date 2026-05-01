/**
 * osmosfeed always writes into ./public. The landing page is moved aside first so
 * osmosfeed never opens or overwrites ./public/index.html. After the CLI runs, all
 * generated files are moved into ./public/feed/ only; then the landing file is restored.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const feedDir = path.join(publicDir, "feed");
const publicLanding = path.join(publicDir, "index.html");
const landingSrc = path.join(root, "landing", "index.html");
/** Outside public/ so osmosfeed never touches the landing file */
const landingStash = path.join(root, ".build-landing-index.html");

const KEEP_AT_PUBLIC_ROOT = new Set(["feed", "robots.txt", "sitemap.xml"]);

const feedCache = path.join(feedDir, "cache.json");
const stagingCache = path.join(publicDir, "cache.json");

fs.mkdirSync(publicDir, { recursive: true });

if (fs.existsSync(landingStash)) {
  if (fs.existsSync(publicLanding)) {
    console.error(
      "[build] Remove stale .build-landing-index.html (only one of stash and public/index.html should exist)",
    );
    process.exit(1);
  }
  fs.renameSync(landingStash, publicLanding);
}

if (!fs.existsSync(publicLanding) && !fs.existsSync(landingSrc)) {
  console.error(
    "[build] Missing landing page: add public/index.html or landing/index.html",
  );
  process.exit(1);
}

let stashedLanding = false;
if (fs.existsSync(publicLanding)) {
  fs.renameSync(publicLanding, landingStash);
  stashedLanding = true;
}

function restoreLandingIfStashed() {
  if (stashedLanding && fs.existsSync(landingStash)) {
    fs.renameSync(landingStash, publicLanding);
  }
}

if (fs.existsSync(feedCache)) {
  fs.copyFileSync(feedCache, stagingCache);
}

fs.rmSync(feedDir, { recursive: true, force: true });

const result = spawnSync("npx", ["osmosfeed", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  restoreLandingIfStashed();
  process.exit(result.status ?? 1);
}

fs.mkdirSync(feedDir, { recursive: true });

for (const name of fs.readdirSync(publicDir)) {
  if (KEEP_AT_PUBLIC_ROOT.has(name)) continue;
  fs.renameSync(path.join(publicDir, name), path.join(feedDir, name));
}

if (stashedLanding) {
  fs.renameSync(landingStash, publicLanding);
} else {
  fs.copyFileSync(landingSrc, publicLanding);
}

console.log(
  "[build] Feed output in public/feed/ only; landing restored at public/index.html",
);
