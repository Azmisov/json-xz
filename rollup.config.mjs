import terser from "@rollup/plugin-terser";

export default [
	{
		input: "jsonxz.mjs",
		output: {
			file: "jsonxz.min.mjs"
		},
		plugins: [ terser() ]
	}
];