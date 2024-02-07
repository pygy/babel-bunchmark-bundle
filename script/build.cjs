const { rollup } = require("rollup")
const resolve = require("@rollup/plugin-node-resolve")
const cjs = require("@rollup/plugin-commonjs")
const json = require("@rollup/plugin-json")
const { terser } = require("rollup-plugin-terser")
const nodePolyfills = require('rollup-plugin-polyfill-node')
const path = require("node:path")
const fs = require("node:fs")

const makePath = p => path.resolve(__dirname, p)

const input = makePath("../src/index.js")
const esPath = makePath("../babel.js")
const esMiniPath = makePath("../babel.min.js")
const umdPath = makePath("../babel.umd.js")
const umdMiniPath = makePath("../babel.umd.min.js")

void [esPath, esMiniPath, umdPath, umdMiniPath].forEach(path => {

	fs.rmSync(path, { force: true })
})

const onwarn = warning => {
	// Silence circular dependency warning for moment package
	if (warning.code !== 'CIRCULAR_DEPENDENCY') {
		console.warn(`(!) ${warning.message}`)
	}
}

const write = (result, path) => {
	console.log("writing "+path)
	fs.writeFileSync(path, result.output[0].code)
}

const bundle = rollup({
	input,
	onwarn,
	plugins: [
		resolve(),
		cjs(),
		json(),
		nodePolyfills()
	]
})

const esOutput = bundle
	.then(x => x.generate({
		format: "es",
	}))
	.then(x => write(x, esPath))


const esMiniOutput = bundle
	.then(x => x.generate({
		plugins: [
			terser()
		],
		sourcemap: true,
		format: "es"
	}))
	.then(x => write(x, esMiniPath))


const umdOutput = bundle
	.then(x => x.generate({
		format: "umd",
		name: "Babel"
	}))
	.then(x => write(x, umdPath))


const umdMiniOutput = bundle
	.then(x => x.generate({
		plugins: [
			terser()
		],
		sourcemap: true,
		format: "umd",
		name: "Babel"
	}))
	.then(x => write (x, umdMiniPath))


Promise.all([esOutput, esMiniOutput, umdMiniOutput, umdOutput])
	.catch(console.error)