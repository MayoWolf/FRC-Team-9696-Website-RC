import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
async function files(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(join(path, e.name)) : join(path, e.name),
      ),
    )
  ).flat();
}
const root = resolve("dist");
const pages = (await files(root)).filter((f) => f.endsWith(".html"));
let links = 0;
for (const page of pages) {
  const html = await readFile(page, "utf8");
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${page}: exactly one h1`,
  );
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<a class="skip" href="#main">/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: no duplicate IDs`);
  for (const [, src] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(src)) continue;
    const [url, hash] = src.split("#");
    const target = url
      ? resolve(root, "." + url + (url.endsWith("/") ? "index.html" : ""))
      : page;
    assert.ok((await stat(target)).isFile(), `${page}: missing ${src}`);
    if (hash) {
      const targetHtml = await readFile(target, "utf8");
      assert.ok(
        targetHtml.includes(`id="${hash}"`),
        `${page}: missing anchor ${src}`,
      );
    }
    links++;
  }
  for (const tag of html.matchAll(/<img\b[^>]*>/g))
    assert.match(tag[0], /\balt="[^"]*"/);
  for (const [, panel] of html.matchAll(
    /role="tab"[^>]*aria-controls="([^"]+)"/g,
  ))
    assert.ok(ids.includes(panel));
  assert.ok(
    !/TODO|Lorem ipsum|example\.com/.test(html),
    `${page}: placeholder text`,
  );
}
const cal = await readFile("dist/assets/kickoff.ics", "utf8");
assert.match(cal, /DTSTART:20270109T170000Z/);
console.log(
  `Passed: ${pages.length} pages, ${links} internal links/assets, anchors, heading/metadata checks, tab references, image alternatives, and calendar time.`,
);
