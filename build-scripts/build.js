import esbuild from 'esbuild';
import { altvEsbuild } from 'altv-esbuild';
import fs from 'fs';

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

function checkBeforeCopy(file, destination){
	if (!fs.existsSync(`destination/${file}`)){
		copy(file, destination);
		return;
	}

}

function copy(file, destination){
	fs.copyFile(file, destination);
}