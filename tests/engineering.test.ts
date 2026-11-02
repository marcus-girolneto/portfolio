import { describe, expect, it } from "vitest";
import { buildTree } from "../src/lib/merkle";
import {
  consensusOutcome,
  postDeposit,
  webhookOutcome,
} from "../src/lib/simulations";
import { loadRepositories, parseRepositories } from "../src/lib/github-data";
import snapshot from "../src/content/github-snapshot.json";

describe("GitHub data boundary", () => {
  it("uses a verified snapshot on rate limits", async () => {
    const result = await loadRepositories(
      async () => new Response("{}", { status: 403 }),
      snapshot.repositories,
    );
    expect(result.source).toBe("snapshot");
    expect(result.repositories).toHaveLength(6);
  });
  it("uses a snapshot when the network fails", async () => {
    const result = await loadRepositories(async () => {
      throw new Error("offline");
    }, snapshot.repositories);
    expect(result.source).toBe("snapshot");
  });
  it("rejects malformed live metadata instead of displaying it", async () => {
    const result = await loadRepositories(
      async () =>
        new Response(
          JSON.stringify([{ name: "fake", stargazers_count: "100" }]),
        ),
      snapshot.repositories,
    );
    expect(result.source).toBe("snapshot");
  });
  it("validates legitimate metadata and preserves zero counts", async () => {
    const result = await loadRepositories(
      async () => new Response(JSON.stringify(snapshot.repositories)),
      [],
    );
    expect(result.source).toBe("live");
    expect(result.repositories[0].stargazers_count).toBe(0);
  });
  it("rejects unsafe external repository URLs", () => {
    expect(() =>
      parseRepositories([
        {
          ...snapshot.repositories[0],
          html_url: "https://example.com/redirect",
        },
      ]),
    ).toThrow();
  });
});
describe("educational models", () => {
  it("allows a majority to commit despite one timeout", () => {
    expect(consensusOutcome(true, 3)).toContain("4 of 5");
  });
  it("keeps dead-letter and recovered receiver outcomes distinct", () => {
    expect(webhookOutcome("persistent", 4)).toContain("dead-letter");
    expect(webhookOutcome("temporary", 4)).toContain("retry succeeded");
  });
  it("replays a deposit without another transaction", () => {
    const first = postDeposit({ posted: false, replayed: false, count: 0 });
    expect(first.count).toBe(1);
    expect(postDeposit(first)).toEqual({
      posted: true,
      replayed: true,
      count: 1,
    });
  });
  it("computes domain-separated SHA-256 roots and propagates changed leaves", async () => {
    const a = await buildTree(["a", "b", "c", "d"]);
    const b = await buildTree(["a", "tampered", "c", "d"]);
    expect(a.leaves[0]).toBe(
      "022a6979e6dab7aa5ae4c3e5e45f7e977112a7e63593820dbec1ec738a24f93c",
    );
    expect(a.root).not.toBe(b.root);
    expect(a.parents[1]).toBe(b.parents[1]);
    expect(a.parents[0]).not.toBe(b.parents[0]);
  });
});
