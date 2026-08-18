import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

/* Branch name for the "work in progress" chip. Vercel exposes the branch as
   VERCEL_GIT_COMMIT_REF; locally we fall back to git. Never hardcode this per
   branch — it conflicts on every merge. Same approach as Blurb Checkout Prototypes. */
function branchName() {
  if (process.env.VERCEL_GIT_COMMIT_REF) return process.env.VERCEL_GIT_COMMIT_REF;
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    return "local";
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __BRANCH__: JSON.stringify(branchName()),
  },
});
