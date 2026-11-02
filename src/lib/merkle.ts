function join(...arrays: Uint8Array[]) {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let i = 0;
  for (const a of arrays) {
    out.set(a, i);
    i += a.length;
  }
  return out;
}
async function hash(bytes: Uint8Array) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new Uint8Array(bytes)),
  );
}
export function hex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
export async function buildTree(entries: string[]) {
  if (entries.length !== 4)
    throw new Error("The educational tree requires four leaves");
  const leaves = await Promise.all(
    entries.map((e) =>
      hash(join(new Uint8Array([0]), new TextEncoder().encode(e))),
    ),
  );
  const parents = await Promise.all([
    hash(join(new Uint8Array([1]), leaves[0], leaves[1])),
    hash(join(new Uint8Array([1]), leaves[2], leaves[3])),
  ]);
  const root = await hash(join(new Uint8Array([1]), parents[0], parents[1]));
  return {
    leaves: leaves.map(hex),
    parents: parents.map(hex),
    root: hex(root),
  };
}
