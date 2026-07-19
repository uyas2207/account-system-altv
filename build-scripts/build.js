import esbuild from 'esbuild';
import { altvEsbuild } from 'altv-esbuild';

export const build = async ({ 
	esbuild: esbuildOptions, 
	altvEsbuild: altvEsbuildOptions 
}) => {
  
	const ctx = await esbuild.build({
		bundle: true,
		target: "esnext",
		logLevel: "info",
		format: "esm",
		plugins: [
		altvEsbuild({
			// hot reload is enabled by default
			dev: {
			enhancedRestartCommand: true,
			},

			...altvEsbuildOptions,
		})
		],

		...esbuildOptions,
	});
};
