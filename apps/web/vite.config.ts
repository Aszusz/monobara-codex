import path from "node:path";
import { execSync } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

function gitOutput(command: string) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function appVersion(envVersion?: string) {
  return (
    envVersion ||
    gitOutput("git describe --tags --exact-match") ||
    gitOutput("git branch --show-current") ||
    gitOutput("git rev-parse --short HEAD") ||
    "dev"
  );
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), "");

  return {
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(
        appVersion(env.VITE_APP_VERSION),
      ),
    },
    envDir: path.resolve(__dirname, "../.."),
    plugins: [tanstackRouter(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/rpc": env.BETTER_AUTH_URL,
      },
      port: Number(env.WEB_PORT),
    },
  };
});
