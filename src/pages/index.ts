import { loadPyodide } from "pyodide/pyodide"

import PyMain from "../py/main.py"

import PyCalc from "../py/lib/calc.py"
import PyCalcType from "../py/lib/calc"

declare var window: any

async function main() {
  const pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/"
  })

  console.log("ready pyodide")

  const PyMainPkg = PyMain.import<unknown>(pyodide)
  const PyCalcPkg = PyCalc.import<typeof PyCalcType>(pyodide)

  window.pycalc = {
    add: PyCalcPkg.add,
    sub: PyCalcPkg.sub,
  }
}

main()