import { chromium, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { randomBytes, createHash } from "node:crypto";
import { mkdir, mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createRivalReaperServer } from "../src/rival-reaper/server.js";
import { fixture } from "../test/fixtures.js";
import { canonical, verifyReceiptChain } from "../src/rival-reaper/receipts.js";
const output = resolve(process.env.REAPER_ARTIFACTS ?? "evidence/screenshots");
await mkdir(output, { recursive: true });
const data = await mkdtemp(join(tmpdir(), "reaper-browser-"));
const token = randomBytes(24).toString("hex"),
  secret = randomBytes(32).toString("hex");
const options = {
  port: 0,
  hostToken: token,
  secret,
  dataPath: join(data, "session.enc.json"),
  initialState: fixture(45),
};
let app = await createRivalReaperServer(options);
await app.listen();
const port = (app.server.address() as any).port;
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const arena = await context.newPage(),
  host = await context.newPage();
await host.setViewportSize({ width: 390, height: 844 });
const errors: string[] = [],
  checks: string[] = [];
let assertions = 0;
for (const p of [arena, host]) {
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (
      m.type() === "error" &&
      !m.text().includes("status of 401") &&
      !m.text().includes("status of 409") &&
      !m.text().includes("net::ERR_")
    )
      errors.push(m.text());
  });
}
const record = (text: string) => {
  checks.push(text);
  console.log("PASS " + text);
  assertions++;
};
async function phase(value: string) {
  await expect(arena.locator("body")).toHaveAttribute("data-phase", value);
  await expect(host.locator("#host-phase")).toHaveText(
    value.replaceAll("-", " ").toUpperCase(),
  );
}
async function advance(value: string) {
  await expect(host.locator("#advance")).toBeEnabled();
  await host.locator("#advance").click();
  await phase(value);
}
try {
  await arena.goto(base + "/arena");
  await host.goto(base + "/host");
  await expect(arena.locator("#connection")).toContainText("LIVE");
  await arena.screenshot({
    path: join(output, "arena-idle.png"),
    fullPage: true,
  });
  await host.locator("#token").fill("wrong");
  await host.locator("#auth-form button").click();
  await expect(host.locator("#message")).toContainText("unauthorized");
  record("Unauthorized host stays locked");
  await host.locator("#token").fill(token);
  await host.locator("#auth-form button").click();
  await expect(host.locator("#controls")).toBeVisible();
  await expect(host.locator("#player option")).toHaveCount(46);
  record("Private mobile host unlock and 45 fake roster options");
  await host.locator("#player").selectOption("fake-1");
  await host.locator("#draw").click();
  await phase("machine-awakens");
  await expect(host.locator("#draw")).toBeDisabled();
  record("Fate locks once; next draw disabled; arena follows");
  await advance("colors-fight");
  await advance("badge-selected");
  await arena.screenshot({
    path: join(output, "arena-badge.png"),
    fullPage: true,
  });
  await advance("ticket-ejects");
  await expect(arena.locator("#player-name")).toHaveText("IDENTITY SEALED");
  record("Badge precedes ticket; name is absent before reveal");
  await advance("ink-1");
  await arena.reload();
  await expect(arena.locator("body")).toHaveAttribute("data-phase", "ink-1");
  record("Arena reload restores active first-ink phase");
  await arena.screenshot({
    path: join(output, "arena-ink-one.png"),
    fullPage: true,
  });
  await host.reload();
  await expect(host.locator("#auth-panel")).toBeVisible();
  await host.locator("#token").fill(token);
  await host.locator("#auth-form button").click();
  await expect(host.locator("#advance")).toBeEnabled();
  record("Host reload requires reauthentication and resumes same reveal");
  await advance("ink-2");
  // Exercise pointer yank rather than only clicking. The third yank advances ink-3 then name.
  const grip = await host.locator("#advance").boundingBox();
  if (!grip) throw Error("Missing grip");
  await host.mouse.move(grip.x + grip.width / 2, grip.y + 30);
  await host.mouse.down();
  await host.mouse.move(grip.x + grip.width / 2, grip.y + 90, { steps: 8 });
  await host.mouse.up();
  await phase("name-revealed");
  await expect(arena.locator("#player-name")).toHaveText("Fake Player 01");
  record("Third physical yank reveals exact locked name");
  await arena.screenshot({
    path: join(output, "arena-name-revealed.png"),
    fullPage: true,
  });
  await host.screenshot({
    path: join(output, "host-mobile.png"),
    fullPage: true,
  });
  await advance("team-explosion");
  await arena.screenshot({
    path: join(output, "arena-team-explosion.png"),
    fullPage: true,
  });
  await advance("roster-updated");
  await expect(
    arena.locator(".roster-names").filter({ hasText: "Fake Player 01" }),
  ).toHaveCount(1);
  record("Roster board updates only after terminal reveal");
  const before = await fetch(base + "/api/state").then((r) => r.json());
  await app.close();
  app = await createRivalReaperServer({ ...options, port });
  await app.listen();
  await expect(arena.locator("#connection")).toContainText("LIVE", {
    timeout: 15000,
  });
  const after = await fetch(base + "/api/state").then((r) => r.json());
  expect(after).toEqual(before);
  record(
    "Server stop/restart and live browser reconnect preserve fate and reveal",
  );
  // Interrupt a committed command's response. Browser must replay SAME ID.
  let interrupted = false;
  await host.route("**/api/host/draw", async (route) => {
    if (!interrupted) {
      interrupted = true;
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  await host.locator("#player").selectOption("fake-2");
  await host.locator("#draw").click();
  await expect(host.locator("#retry")).toBeVisible();
  await host.locator("#retry").click();
  await expect(host.locator("#retry")).toBeHidden();
  await phase("machine-awakens");
  expect(
    (await fetch(base + "/api/state").then((r) => r.json())).drawCount,
  ).toBe(2);
  record("Lost response recovers by replay without duplicate draw");
  await host.unroute("**/api/host/draw");
  for (const p of [
    "colors-fight",
    "badge-selected",
    "ticket-ejects",
    "ink-1",
    "ink-2",
    "name-revealed",
    "team-explosion",
    "roster-updated",
  ])
    await advance(p);
  // Complete the same 45-player session through the real HTTP API. First two
  // draws exercised host UI; remaining 43 exercise sustained durable operation.
  const seen = new Set<string>();
  for (let player = 3; player <= 45; player++) {
    let current = await fetch(base + "/api/state").then((r) => r.json());
    const issue = async (path: string) => {
      const r = await fetch(base + path, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          commandId: randomBytes(12).toString("hex"),
          expectedRevision: current.revision,
          ...(path.endsWith("/draw") ? { playerId: `fake-${player}` } : {}),
        }),
      });
      expect(r.status).toBe(200);
      current = (await r.json()).state;
    };
    await issue("/api/host/draw");
    for (let beat = 0; beat < 9; beat++) {
      await issue("/api/host/reveal/advance");
      if (
        current.reveal.phase === "team-explosion" &&
        !seen.has(current.reveal.teamId)
      ) {
        seen.add(current.reveal.teamId);
        await expect(arena.locator("body")).toHaveAttribute(
          "data-team",
          current.reveal.teamId,
        );
        await arena.screenshot({
          path: join(output, `world-${current.reveal.teamId}.png`),
          fullPage: true,
        });
      }
    }
  }
  await expect(arena.locator("#draw-number")).toHaveText("45");
  await expect(host.locator("#draw")).toBeDisabled();
  const complete = await fetch(base + "/api/state").then((r) => r.json());
  expect(complete.teams.map((t: any) => t.assigned)).toEqual([9, 9, 9, 9, 9]);
  expect(seen.size).toBe(5);
  record(
    "Complete 45-player HTTP rehearsal ends 9/9/9/9/9, all five world effects captured",
  );
  await host.locator("#audit-open").click();
  await expect(host.locator("#audit-dialog")).toBeVisible();
  const download = host.waitForEvent("download");
  await host.locator("#export").click();
  const file = await download;
  const bundle = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(verifyReceiptChain(bundle.payload.receipts)).toBe(true);
  expect(bundle.bundleHash).toBe(
    createHash("sha256").update(canonical(bundle.payload)).digest("hex"),
  );
  expect(bundle.payload.receipts).toHaveLength(45);
  await host.keyboard.press("Escape");
  await expect(host.locator("#audit-dialog")).not.toBeVisible();
  await expect(host.locator("#audit-open")).toBeFocused();
  record("Private audit downloads valid chain/bundle; Escape restores focus");
  await arena.locator("#sound").click();
  await expect(arena.locator("#sound")).toHaveAttribute("aria-pressed", "true");
  await arena.locator("#sound").click();
  await expect(arena.locator("#sound")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  record(
    "Sound opt-in and mute controls toggle successfully (not acoustic verification)",
  );
  await arena.locator("#motion").click();
  await expect(arena.locator("body")).toHaveClass(/motion-paused/);
  record("Explicit motion pause available");
  for (const size of [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    await arena.setViewportSize(size);
    const overflow = await arena.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
    if (size.width >= 1280) {
      const ticket = await arena.locator(".ticket").boundingBox(),
        board = await arena.locator(".war-board").boundingBox();
      expect(ticket!.y + ticket!.height).toBeLessThanOrEqual(board!.y);
      expect(
        await arena.evaluate(() => document.documentElement.scrollHeight),
      ).toBeLessThanOrEqual(size.height);
    }
    await arena.screenshot({
      path: join(output, `arena-${size.width}x${size.height}.png`),
      fullPage: true,
    });
    record(
      `Arena ${size.width}x${size.height} no horizontal overflow and screenshot`,
    );
  }
  await arena.setViewportSize({ width: 1440, height: 900 });
  await arena.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await arena
      .locator(".energy-ribbons i")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
  record("OS reduced-motion disables energy animation");
  for (const [name, page] of [
    ["arena", arena],
    ["host", host],
  ] as const) {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await writeFile(
      join(output, `${name}-axe.json`),
      JSON.stringify(result.violations, null, 2),
    );
    expect(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    record(`${name} axe WCAG A/AA scan has zero violations`);
  }
  expect(errors).toEqual([]);
  record("No unexpected browser JavaScript or console errors");
  await writeFile(
    resolve("evidence/browser-results.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        browser: await browser.version(),
        checks: assertions,
        passed: checks,
        errors,
        artifacts: output,
      },
      null,
      2,
    ),
  );
  console.log(`BROWSER RESULT: ${assertions}/${assertions} checks passed`);
} finally {
  await browser.close();
  await app.close();
  await rm(data, { recursive: true, force: true });
}
