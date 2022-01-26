const esbuild = require('esbuild')
const alias = require('esbuild-plugin-alias')
const server = require("live-server")

const fs = require('fs-extra')
const glob = require('glob')

const path = require("path")
const child_process = require("child_process")

function toTypeScriptFile(filePath, contents) {
  return  `
function importPythonPackage<T>(pyodide: any): T {
  const file = String.raw\`${contents}\`

  const filePath = "${filePath}"

  const dirPath = filePath.split(/\\\//gm).slice(0, -1).join("")
  const importPath = filePath.replace(/\\\//gm, ".").replace(/\.py$/gm, "")

  pyodide.runPython(\`
import os
if 0 < len("\${dirPath}"):
    os.makedirs("\${dirPath}", exist_ok=True)

with open("\${filePath}", "w") as f:
    f.write(r"""\${file}""")
\`)

  const pkg = pyodide.pyimport(importPath)
  return pkg
}

export default {
  import: importPythonPackage
}
  `

  return text
}

// remove old dist dir
fs.removeSync("./dist")

// build src
esbuild.build({
  entryPoints: glob.sync(
    "src/pages/**/index.@(js|ts|jsx|tsx)"
  ),

  outbase: './src/pages',
  outdir: './dist',

  bundle: true,
  minify: false,
  sourcemap: "inline",

  external: [
    "fs/promises",
    "path",
    "vm",
  ],

  plugins: [
    alias({
      "~": "src",
    }),
    {
      name: "my-plugin",
      setup(build) {
        build.onLoad({ filter: /\.py$/ }, async (args) => {
          const [err, stdout, stderr] = await new Promise(resolve => {
            child_process.exec("stickytape " + args.path, (...args) => resolve(args))
          })

          const filePath = path.relative(__dirname, args.path)
            .split(/\//gm).slice(2).join("/")

          const ts = toTypeScriptFile(filePath, stdout)

          if (!err) {
            return {
              contents: ts,
              loader: 'ts',
            }
          } else {
            return {
              errors: [{ text: stderr }]
            }
          }
        })
      }
    }
  ],

  watch: process.argv.includes("--watch") ? {
    onRebuild: (error, result) => {
      if (!error && result) {
        console.log(
          `${new Date().toLocaleString()} watch build succeeded\n`
        )
      }
    }
  } : false,
}).then(() => {
  console.log(`${new Date().toLocaleString()} build succeeded`)

  if (process.argv.includes("--server")) {
    const port = 8000

    server.start({
      port,
      host: "localhost",
      root: "./dist",
      open: false,
      logLevel: 0,
    })

    console.log(`listening at http://localhost:${port}`)
  }

  if (process.argv.includes("--watch")) console.log("")
}).catch(() => {
})


// copy static files
for (const path of glob.sync("@(src|public)/**/*.!(js|ts|jsx|tsx|d.ts|py)")) {
  fs.copySync(`./${path}`, path.replace(/(^src\/pages|^src|^public)\//gm, "./dist/"))
}
