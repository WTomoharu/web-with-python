declare module "*.py" {
  export default {
    import<T = any>(pyodide: any): T
  }
}
