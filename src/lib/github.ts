import "server-only";
import { cache } from "react";
import snapshot from "@/content/github-snapshot.json";
import { loadRepositories } from "./github-data";
export const getRepositories = cache(() =>
  loadRepositories(fetch, snapshot.repositories),
);
