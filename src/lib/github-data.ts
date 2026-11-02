import { z } from "zod";
export const repositorySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.url().refine((url) => url.startsWith("https://github.com/")),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  updated_at: z.iso.datetime(),
  topics: z.array(z.string()).default([]),
});
export type Repository = z.infer<typeof repositorySchema>;
export function parseRepositories(data: unknown): Repository[] {
  return z.array(repositorySchema).parse(data);
}
export async function loadRepositories(
  fetcher: typeof fetch,
  fallback: unknown,
) {
  try {
    const response = await fetcher(
      "https://api.github.com/users/marcus-girolneto/repos?per_page=100&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600, tags: ["github-repositories"] },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) throw new Error("GitHub unavailable");
    return {
      repositories: parseRepositories(await response.json()),
      source: "live" as const,
    };
  } catch {
    return {
      repositories: parseRepositories(fallback),
      source: "snapshot" as const,
    };
  }
}
