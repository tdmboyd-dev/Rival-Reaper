// Real-browser acceptance helper. Fixtures are deliberately fake, never approved
// team artwork. The restricted cloud runtime has NOT executed these scenarios.
import { expect, type Page } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type PublicRoster = { sessionId: string; teams: Array<{id: string; capacity: number; roster: Array<{name: string}>}> };

/** Invoke after the existing authenticated full-roster/roster-updated rehearsal. */
export async function checkFullTeamPosters(host: Page, publicState: PublicRoster, output: string) {
  await expect(host.locator("#poster-panel")).toBeVisible();
  await expect(host.locator(".poster-card")).toHaveCount(5);
  for (const button of await host.locator(".poster-download").all()) await expect(button).toBeDisabled();
  // This file is generated for testing only, not a replacement for owner art.
  const fixture = await host.evaluate(() => {
    const doc = (globalThis as any).document;
    const canvas = doc.createElement("canvas"); canvas.width = 600; canvas.height = 800;
    const ctx = canvas.getContext("2d"); ctx.fillStyle = "#263046"; ctx.fillRect(0,0,600,800);
    ctx.fillStyle = "#fff"; ctx.font = "bold 30px Arial";
    ctx.fillText("FAKE REHEARSAL ART",80,360); ctx.fillText("NOT OWNER-APPROVED",65,420);
    return canvas.toDataURL("image/png").split(",")[1] as string;
  });
  const files: Array<{teamId: string; filename: string; width: number; height: number; names: number}> = [];
  for (const team of publicState.teams) {
    const card = host.locator(`.poster-${team.id}`);
    await expect(card.locator(".poster-names li")).toHaveText(team.roster.map((player) => player.name));
    await host.locator(`#poster-art-${team.id}`).setInputFiles({
      name: "fake-rehearsal-art.png", mimeType: "image/png", buffer: Buffer.from(fixture,"base64"),
    });
    await expect(card.locator(".poster-download")).toBeDisabled();
    // Explicit fake-fixture area only. Never reuse as an approved template region.
    for (const [key,value] of Object.entries({x:5,y:55,width:90,height:40}))
      await card.locator(`.poster-region-${key}`).fill(String(value));
    await card.locator(".poster-region-confirm").check();
    await expect(card.locator(".poster-download")).toBeEnabled();
    const waiting = host.waitForEvent("download");
    await card.locator(".poster-download").click();
    const download = await waiting;
    expect(download.suggestedFilename()).toBe(`rival-reaper-${team.id}-${publicState.sessionId}-full-team.png`);
    const path = join(output, download.suggestedFilename());
    await download.saveAs(path);
    expect(await download.failure()).toBeNull();
    const bytes = await readFile(path);
    expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    expect(width).toBe(3000); expect(height).toBe(4000); expect(height).toBeLessThanOrEqual(10000);
    await expect(card.locator(".poster-notice")).toContainText(`including all ${team.capacity} names`);
    files.push({teamId:team.id,filename:download.suggestedFilename(),width,height,names:team.roster.length});
  }
  await host.locator("#poster-panel").screenshot({path:join(output,"host-fake-full-team-posters.png")});
  await writeFile(join(output,"fake-poster-downloads.json"),JSON.stringify({fixture:"FAKE REHEARSAL ART, NOT APPROVED ART",files},null,2));
  return "All five full-team PNG downloads contain valid 3000px-wide images and match the complete public name previews (fake art only)";
}

/** Real canvas boundary check; no mutation of the authoritative server roster. */
export async function checkPosterCanvasBoundaries(host: Page) {
  const result = await host.evaluate(async () => {
    const {layoutPoster,drawPoster,POSTER_TEAMS} = await import("/roster-posters.js" as string);
    const doc = (globalThis as any).document;
    const art = doc.createElement("canvas"); art.width = 200; art.height = 200;
    art.getContext("2d").fillRect(0,0,200,200);
    const results = [];
    for (const count of [10,50]) {
      const canvas = doc.createElement("canvas");
      const team = {roster:Array.from({length:count},(_,i) => ({name:`${String(i + 1).padStart(2,"0")} ${"界".repeat(117)}`}))};
      const layout = drawPoster(canvas,team,POSTER_TEAMS[0],art,{x:0,y:0,width:100,height:100});
      const context = canvas.getContext("2d");
      context.font = `700 ${layout.fontSize}px Arial, Helvetica, sans-serif`;
      const verified = layout.entries.every((entry:any,index:number) => entry.lines.join("") === team.roster[index].name &&
        entry.lines.every((line:string) => context.measureText(line).width <= entry.width) && entry.y+entry.height < canvas.height);
      const blob:any = await new Promise((resolve) => canvas.toBlob(resolve,"image/png"));
      results.push({count,verified,entries:layout.entries.length,width:canvas.width,height:canvas.height,mime:blob?.type,size:blob?.size});
      canvas.width = 1; canvas.height = 1;
    }
    return results;
  });
  for (const item of result) {
    expect(item.verified).toBe(true); expect(item.entries).toBe(item.count);
    expect(item.mime).toBe("image/png"); expect(item.size).toBeGreaterThan(0);
    expect(item.width).toBe(3000); expect(item.height).toBeLessThanOrEqual(10000);
  }
  return "Real canvas wraps and encodes every 120-character name for 10-person and 50-person team boundaries";
}
