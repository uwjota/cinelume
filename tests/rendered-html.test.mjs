import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the CineLume application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /CineLume/);
  assert.match(html, /Filmes, séries e TV ao vivo/);
  assert.match(html, /Carregando destaque/);
  assert.match(html, /cinelume-icon\.png/);
  assert.doesNotMatch(html, /Your site is taking shape|SkeletonPreview|codex-preview/i);
});

test("keeps the CineLume experience free of the disposable preview template", async () => {
  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /^"use client";/);
  assert.match(page, /TV ao vivo/);
  assert.match(page, /Minha lista/);
  assert.match(layout, /cinelume-icon\.png/);
  assert.match(layout, /og\.png/);
  assert.match(css, /--gold:/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
});
