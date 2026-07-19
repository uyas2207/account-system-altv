import { build } from './build.js';

build({
	esbuild: {
    entryPoints: ["./src/client/startClient.ts"],
    outfile: "./dist/client.js",
	},
	altvEsbuild: {
		mode: 'client',
	},
});
