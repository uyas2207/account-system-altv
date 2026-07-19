import { build } from './build.js';

build({
  esbuild: {
    platform: "node",
    entryPoints: ["./src/server/startServer.ts"],
    outfile: "./dist/server.js",
  },
  altvEsbuild: {
    mode: "server",
  }
})
