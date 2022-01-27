(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/node-fetch/browser.js
  var require_browser = __commonJS({
    "node_modules/node-fetch/browser.js"(exports, module) {
      "use strict";
      var getGlobal = function() {
        if (typeof self !== "undefined") {
          return self;
        }
        if (typeof window !== "undefined") {
          return window;
        }
        if (typeof global !== "undefined") {
          return global;
        }
        throw new Error("unable to locate global object");
      };
      var global = getGlobal();
      module.exports = exports = global.fetch;
      if (global.fetch) {
        exports.default = global.fetch.bind(global);
      }
      exports.Headers = global.Headers;
      exports.Request = global.Request;
      exports.Response = global.Response;
    }
  });

  // node_modules/pyodide/module.js
  var Module = {};
  Module.noImageDecoding = true;
  Module.noAudioDecoding = true;
  Module.noWasmDecoding = false;
  Module.preloadedWasm = {};
  Module.preRun = [];
  function setStandardStreams(stdin, stdout, stderr) {
    if (stdout) {
      Module.print = stdout;
    }
    if (stderr) {
      Module.printErr = stderr;
    }
    if (stdin) {
      Module.preRun.push(function() {
        Module.FS.init(createStdinWrapper(stdin), null, null);
      });
    }
  }
  function createStdinWrapper(stdin) {
    const encoder = new TextEncoder();
    let input = new Uint8Array(0);
    let inputIndex = -1;
    function stdinWrapper() {
      try {
        if (inputIndex === -1) {
          let text = stdin();
          if (text === void 0 || text === null) {
            return null;
          }
          if (typeof text !== "string") {
            throw new TypeError(`Expected stdin to return string, null, or undefined, got type ${typeof text}.`);
          }
          if (!text.endsWith("\n")) {
            text += "\n";
          }
          input = encoder.encode(text);
          inputIndex = 0;
        }
        if (inputIndex < input.length) {
          let character = input[inputIndex];
          inputIndex++;
          return character;
        } else {
          inputIndex = -1;
          return null;
        }
      } catch (e) {
        console.error("Error thrown in stdin:");
        console.error(e);
        throw e;
      }
    }
    return stdinWrapper;
  }
  function setHomeDirectory(path) {
    Module.preRun.push(function() {
      const fallbackPath = "/";
      try {
        Module.FS.mkdirTree(path);
      } catch (e) {
        console.error(`Error occurred while making a home directory '${path}':`);
        console.error(e);
        console.error(`Using '${fallbackPath}' for a home directory instead`);
        path = fallbackPath;
      }
      Module.ENV.HOME = path;
      Module.FS.chdir(path);
    });
  }

  // node_modules/pyodide/load-pyodide.js
  var IN_NODE = typeof process !== "undefined" && process.release && process.release.name === "node" && typeof process.browser === "undefined";
  var baseURL;
  async function initializePackageIndex(indexURL) {
    baseURL = indexURL;
    let package_json;
    if (IN_NODE) {
      const fsPromises = await import(
        /* webpackIgnore: true */
        "fs/promises"
      );
      const package_string = await fsPromises.readFile(`${indexURL}packages.json`);
      package_json = JSON.parse(package_string);
    } else {
      let response = await fetch(`${indexURL}packages.json`);
      package_json = await response.json();
    }
    if (!package_json.packages) {
      throw new Error("Loaded packages.json does not contain the expected key 'packages'.");
    }
    Module.packages = package_json.packages;
    Module._import_name_to_package_name = /* @__PURE__ */ new Map();
    for (let name of Object.keys(Module.packages)) {
      for (let import_name of Module.packages[name].imports) {
        Module._import_name_to_package_name.set(import_name, name);
      }
    }
  }
  async function _fetchBinaryFile(indexURL, path) {
    if (IN_NODE) {
      const fsPromises = await import(
        /* webpackIgnore: true */
        "fs/promises"
      );
      const tar_buffer = await fsPromises.readFile(`${indexURL}${path}`);
      return tar_buffer.buffer;
    } else {
      let response = await fetch(`${indexURL}${path}`);
      return await response.arrayBuffer();
    }
  }
  var DEFAULT_CHANNEL = "default channel";
  var package_uri_regexp = /^.*?([^\/]*)\.js$/;
  function _uri_to_package_name(package_uri) {
    let match = package_uri_regexp.exec(package_uri);
    if (match) {
      return match[1].toLowerCase();
    }
  }
  var loadScript;
  if (globalThis.document) {
    loadScript = async (url) => await import(
      /* webpackIgnore: true */
      url
    );
  } else if (globalThis.importScripts) {
    loadScript = async (url) => {
      globalThis.importScripts(url);
    };
  } else if (IN_NODE) {
    const pathPromise = import(
      /* webpackIgnore: true */
      "path"
    ).then((M) => M.default);
    const fetchPromise = Promise.resolve().then(() => __toESM(require_browser(), 1)).then((M) => M.default);
    const vmPromise = import(
      /* webpackIgnore: true */
      "vm"
    ).then((M) => M.default);
    loadScript = async (url) => {
      if (url.includes("://")) {
        const fetch2 = await fetchPromise;
        const vm = await vmPromise;
        vm.runInThisContext(await (await fetch2(url)).text());
      } else {
        const path = await pathPromise;
        await import(path.resolve(url));
      }
    };
  } else {
    throw new Error("Cannot determine runtime environment");
  }
  function addPackageToLoad(name, toLoad) {
    name = name.toLowerCase();
    if (toLoad.has(name)) {
      return;
    }
    toLoad.set(name, DEFAULT_CHANNEL);
    if (loadedPackages[name] !== void 0) {
      return;
    }
    for (let dep_name of Module.packages[name].depends) {
      addPackageToLoad(dep_name, toLoad);
    }
  }
  function recursiveDependencies(names, _messageCallback, errorCallback, sharedLibsOnly) {
    const toLoad = /* @__PURE__ */ new Map();
    for (let name of names) {
      const pkgname = _uri_to_package_name(name);
      if (toLoad.has(pkgname) && toLoad.get(pkgname) !== name) {
        errorCallback(`Loading same package ${pkgname} from ${name} and ${toLoad.get(pkgname)}`);
        continue;
      }
      if (pkgname !== void 0) {
        toLoad.set(pkgname, name);
        continue;
      }
      name = name.toLowerCase();
      if (name in Module.packages) {
        addPackageToLoad(name, toLoad);
        continue;
      }
      errorCallback(`Skipping unknown package '${name}'`);
    }
    if (sharedLibsOnly) {
      let onlySharedLibs = /* @__PURE__ */ new Map();
      for (let c of toLoad) {
        let name = c[0];
        if (Module.packages[name].shared_library) {
          onlySharedLibs.set(name, toLoad.get(name));
        }
      }
      return onlySharedLibs;
    }
    return toLoad;
  }
  Module.locateFile = function(path) {
    let pkg = path.replace(/\.data$/, "");
    const toLoad = Module.locateFile_packagesToLoad;
    if (toLoad && toLoad.has(pkg)) {
      let package_uri = toLoad.get(pkg);
      if (package_uri != DEFAULT_CHANNEL) {
        return package_uri.replace(/\.js$/, ".data");
      }
    }
    return baseURL + path;
  };
  function waitRunDependency() {
    const promise = new Promise((r) => {
      Module.monitorRunDependencies = (n) => {
        if (n === 0) {
          r();
        }
      };
    });
    Module.addRunDependency("dummy");
    Module.removeRunDependency("dummy");
    return promise;
  }
  async function _loadPackage(names, messageCallback, errorCallback) {
    let toLoad = recursiveDependencies(names, messageCallback, errorCallback);
    Module.locateFile_packagesToLoad = toLoad;
    if (toLoad.size === 0) {
      return Promise.resolve("No new packages to load");
    } else {
      let packageNames = Array.from(toLoad.keys()).join(", ");
      messageCallback(`Loading ${packageNames}`);
    }
    let scriptPromises = [];
    for (let [pkg, uri] of toLoad) {
      let loaded = loadedPackages[pkg];
      if (loaded !== void 0) {
        if (loaded === uri || uri === DEFAULT_CHANNEL) {
          messageCallback(`${pkg} already loaded from ${loaded}`);
          continue;
        } else {
          errorCallback(`URI mismatch, attempting to load package ${pkg} from ${uri} while it is already loaded from ${loaded}. To override a dependency, load the custom package first.`);
          continue;
        }
      }
      let pkgname = Module.packages[pkg] && Module.packages[pkg].name || pkg;
      let scriptSrc = uri === DEFAULT_CHANNEL ? `${baseURL}${pkgname}.js` : uri;
      messageCallback(`Loading ${pkg} from ${scriptSrc}`);
      scriptPromises.push(loadScript(scriptSrc).catch((e) => {
        errorCallback(`Couldn't load package from URL ${scriptSrc}`, e);
        toLoad.delete(pkg);
      }));
    }
    try {
      await Promise.all(scriptPromises).then(waitRunDependency);
    } finally {
      delete Module.monitorRunDependencies;
    }
    let packageList = [];
    for (let [pkg, uri] of toLoad) {
      loadedPackages[pkg] = uri;
      packageList.push(pkg);
    }
    let resolveMsg;
    if (packageList.length > 0) {
      let packageNames = packageList.join(", ");
      resolveMsg = `Loaded ${packageNames}`;
    } else {
      resolveMsg = "No packages loaded";
    }
    Module.reportUndefinedSymbols();
    messageCallback(resolveMsg);
    Module.importlib.invalidate_caches();
  }
  var _package_lock = Promise.resolve();
  async function acquirePackageLock() {
    let old_lock = _package_lock;
    let releaseLock;
    _package_lock = new Promise((resolve) => releaseLock = resolve);
    await old_lock;
    return releaseLock;
  }
  var loadedPackages = {};
  var sharedLibraryWasmPlugin;
  var origWasmPlugin;
  var wasmPluginIndex;
  function initSharedLibraryWasmPlugin() {
    for (let p in Module.preloadPlugins) {
      if (Module.preloadPlugins[p].canHandle("test.so")) {
        origWasmPlugin = Module.preloadPlugins[p];
        wasmPluginIndex = p;
        break;
      }
    }
    sharedLibraryWasmPlugin = {
      canHandle: origWasmPlugin.canHandle,
      handle(byteArray, name, onload, onerror) {
        origWasmPlugin.handle(byteArray, name, onload, onerror);
        origWasmPlugin.asyncWasmLoadPromise = (async () => {
          await origWasmPlugin.asyncWasmLoadPromise;
          Module.loadDynamicLibrary(name, {
            global: true,
            nodelete: true
          });
        })();
      }
    };
  }
  function useSharedLibraryWasmPlugin() {
    if (!sharedLibraryWasmPlugin) {
      initSharedLibraryWasmPlugin();
    }
    Module.preloadPlugins[wasmPluginIndex] = sharedLibraryWasmPlugin;
  }
  function restoreOrigWasmPlugin() {
    Module.preloadPlugins[wasmPluginIndex] = origWasmPlugin;
  }
  async function loadPackage(names, messageCallback, errorCallback) {
    if (Module.isPyProxy(names)) {
      let temp;
      try {
        temp = names.toJs();
      } finally {
        names.destroy();
      }
      names = temp;
    }
    if (!Array.isArray(names)) {
      names = [names];
    }
    let sharedLibraryNames = [];
    try {
      let sharedLibraryPackagesToLoad = recursiveDependencies(names, messageCallback, errorCallback, true);
      for (let pkg of sharedLibraryPackagesToLoad) {
        sharedLibraryNames.push(pkg[0]);
      }
    } catch (e) {
    }
    let releaseLock = await acquirePackageLock();
    try {
      useSharedLibraryWasmPlugin();
      await _loadPackage(sharedLibraryNames, messageCallback || console.log, errorCallback || console.error);
      restoreOrigWasmPlugin();
      await _loadPackage(names, messageCallback || console.log, errorCallback || console.error);
    } finally {
      restoreOrigWasmPlugin();
      releaseLock();
    }
  }

  // node_modules/pyodide/pyproxy.gen.js
  function isPyProxy(jsobj) {
    return !!jsobj && jsobj.$$ !== void 0 && jsobj.$$.type === "PyProxy";
  }
  Module.isPyProxy = isPyProxy;
  if (globalThis.FinalizationRegistry) {
    Module.finalizationRegistry = new FinalizationRegistry(([ptr, cache]) => {
      cache.leaked = true;
      pyproxy_decref_cache(cache);
      try {
        Module._Py_DecRef(ptr);
      } catch (e) {
        Module.fatal_error(e);
      }
    });
  } else {
    Module.finalizationRegistry = { register() {
    }, unregister() {
    } };
  }
  var pyproxy_alloc_map = /* @__PURE__ */ new Map();
  Module.pyproxy_alloc_map = pyproxy_alloc_map;
  var trace_pyproxy_alloc;
  var trace_pyproxy_dealloc;
  Module.enable_pyproxy_allocation_tracing = function() {
    trace_pyproxy_alloc = function(proxy) {
      pyproxy_alloc_map.set(proxy, Error().stack);
    };
    trace_pyproxy_dealloc = function(proxy) {
      pyproxy_alloc_map.delete(proxy);
    };
  };
  Module.disable_pyproxy_allocation_tracing = function() {
    trace_pyproxy_alloc = function(proxy) {
    };
    trace_pyproxy_dealloc = function(proxy) {
    };
  };
  Module.disable_pyproxy_allocation_tracing();
  Module.pyproxy_new = function(ptrobj, cache) {
    let flags = Module._pyproxy_getflags(ptrobj);
    let cls = Module.getPyProxyClass(flags);
    let target;
    if (flags & 1 << 8) {
      target = Reflect.construct(Function, [], cls);
      delete target.length;
      delete target.name;
      target.prototype = void 0;
    } else {
      target = Object.create(cls.prototype);
    }
    if (!cache) {
      let cacheId = Module.hiwire.new_value(/* @__PURE__ */ new Map());
      cache = { cacheId, refcnt: 0 };
    }
    cache.refcnt++;
    Object.defineProperty(target, "$$", {
      value: { ptr: ptrobj, type: "PyProxy", cache }
    });
    Module._Py_IncRef(ptrobj);
    let proxy = new Proxy(target, PyProxyHandlers);
    trace_pyproxy_alloc(proxy);
    Module.finalizationRegistry.register(proxy, [ptrobj, cache], proxy);
    return proxy;
  };
  function _getPtr(jsobj) {
    let ptr = jsobj.$$.ptr;
    if (ptr === null) {
      throw new Error(jsobj.$$.destroyed_msg || "Object has already been destroyed");
    }
    return ptr;
  }
  var pyproxyClassMap = /* @__PURE__ */ new Map();
  Module.getPyProxyClass = function(flags) {
    let result = pyproxyClassMap.get(flags);
    if (result) {
      return result;
    }
    let descriptors = {};
    for (let [feature_flag, methods] of [
      [1 << 0, PyProxyLengthMethods],
      [1 << 1, PyProxyGetItemMethods],
      [1 << 2, PyProxySetItemMethods],
      [1 << 3, PyProxyContainsMethods],
      [1 << 4, PyProxyIterableMethods],
      [1 << 5, PyProxyIteratorMethods],
      [1 << 6, PyProxyAwaitableMethods],
      [1 << 7, PyProxyBufferMethods],
      [1 << 8, PyProxyCallableMethods]
    ]) {
      if (flags & feature_flag) {
        Object.assign(descriptors, Object.getOwnPropertyDescriptors(methods.prototype));
      }
    }
    descriptors.constructor = Object.getOwnPropertyDescriptor(PyProxyClass.prototype, "constructor");
    Object.assign(descriptors, Object.getOwnPropertyDescriptors({ $$flags: flags }));
    let new_proto = Object.create(PyProxyClass.prototype, descriptors);
    function NewPyProxyClass() {
    }
    NewPyProxyClass.prototype = new_proto;
    pyproxyClassMap.set(flags, NewPyProxyClass);
    return NewPyProxyClass;
  };
  Module.PyProxy_getPtr = _getPtr;
  var pyproxy_cache_destroyed_msg = "This borrowed attribute proxy was automatically destroyed in the process of destroying the proxy it was borrowed from. Try using the 'copy' method.";
  function pyproxy_decref_cache(cache) {
    if (!cache) {
      return;
    }
    cache.refcnt--;
    if (cache.refcnt === 0) {
      let cache_map = Module.hiwire.pop_value(cache.cacheId);
      for (let proxy_id of cache_map.values()) {
        const cache_entry = Module.hiwire.pop_value(proxy_id);
        if (!cache.leaked) {
          Module.pyproxy_destroy(cache_entry, pyproxy_cache_destroyed_msg);
        }
      }
    }
  }
  Module.pyproxy_destroy = function(proxy, destroyed_msg) {
    if (proxy.$$.ptr === null) {
      return;
    }
    let ptrobj = _getPtr(proxy);
    Module.finalizationRegistry.unregister(proxy);
    proxy.$$.ptr = null;
    proxy.$$.destroyed_msg = destroyed_msg;
    pyproxy_decref_cache(proxy.$$.cache);
    try {
      Module._Py_DecRef(ptrobj);
      trace_pyproxy_dealloc(proxy);
    } catch (e) {
      Module.fatal_error(e);
    }
  };
  Module.callPyObjectKwargs = function(ptrobj, ...jsargs) {
    let kwargs = jsargs.pop();
    let num_pos_args = jsargs.length;
    let kwargs_names = Object.keys(kwargs);
    let kwargs_values = Object.values(kwargs);
    let num_kwargs = kwargs_names.length;
    jsargs.push(...kwargs_values);
    let idargs = Module.hiwire.new_value(jsargs);
    let idkwnames = Module.hiwire.new_value(kwargs_names);
    let idresult;
    try {
      idresult = Module.__pyproxy_apply(ptrobj, idargs, num_pos_args, idkwnames, num_kwargs);
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.hiwire.decref(idargs);
      Module.hiwire.decref(idkwnames);
    }
    if (idresult === 0) {
      Module._pythonexc2js();
    }
    return Module.hiwire.pop_value(idresult);
  };
  Module.callPyObject = function(ptrobj, ...jsargs) {
    return Module.callPyObjectKwargs(ptrobj, ...jsargs, {});
  };
  var PyProxyClass = class {
    constructor() {
      throw new TypeError("PyProxy is not a constructor");
    }
    get [Symbol.toStringTag]() {
      return "PyProxy";
    }
    get type() {
      let ptrobj = _getPtr(this);
      return Module.hiwire.pop_value(Module.__pyproxy_type(ptrobj));
    }
    toString() {
      let ptrobj = _getPtr(this);
      let jsref_repr;
      try {
        jsref_repr = Module.__pyproxy_repr(ptrobj);
      } catch (e) {
        Module.fatal_error(e);
      }
      if (jsref_repr === 0) {
        Module._pythonexc2js();
      }
      return Module.hiwire.pop_value(jsref_repr);
    }
    destroy(destroyed_msg) {
      Module.pyproxy_destroy(this, destroyed_msg);
    }
    copy() {
      let ptrobj = _getPtr(this);
      return Module.pyproxy_new(ptrobj, this.$$.cache);
    }
    toJs({
      depth = -1,
      pyproxies,
      create_pyproxies = true,
      dict_converter
    } = {}) {
      let ptrobj = _getPtr(this);
      let idresult;
      let proxies_id;
      let dict_converter_id = 0;
      if (!create_pyproxies) {
        proxies_id = 0;
      } else if (pyproxies) {
        proxies_id = Module.hiwire.new_value(pyproxies);
      } else {
        proxies_id = Module.hiwire.new_value([]);
      }
      if (dict_converter) {
        dict_converter_id = Module.hiwire.new_value(dict_converter);
      }
      try {
        idresult = Module._python2js_custom_dict_converter(ptrobj, depth, proxies_id, dict_converter_id);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(proxies_id);
        Module.hiwire.decref(dict_converter_id);
      }
      if (idresult === 0) {
        Module._pythonexc2js();
      }
      return Module.hiwire.pop_value(idresult);
    }
    supportsLength() {
      return !!(this.$$flags & 1 << 0);
    }
    supportsGet() {
      return !!(this.$$flags & 1 << 1);
    }
    supportsSet() {
      return !!(this.$$flags & 1 << 2);
    }
    supportsHas() {
      return !!(this.$$flags & 1 << 3);
    }
    isIterable() {
      return !!(this.$$flags & (1 << 4 | 1 << 5));
    }
    isIterator() {
      return !!(this.$$flags & 1 << 5);
    }
    isAwaitable() {
      return !!(this.$$flags & 1 << 6);
    }
    isBuffer() {
      return !!(this.$$flags & 1 << 7);
    }
    isCallable() {
      return !!(this.$$flags & 1 << 8);
    }
  };
  var PyProxyLengthMethods = class {
    get length() {
      let ptrobj = _getPtr(this);
      let length;
      try {
        length = Module._PyObject_Size(ptrobj);
      } catch (e) {
        Module.fatal_error(e);
      }
      if (length === -1) {
        Module._pythonexc2js();
      }
      return length;
    }
  };
  var PyProxyGetItemMethods = class {
    get(key) {
      let ptrobj = _getPtr(this);
      let idkey = Module.hiwire.new_value(key);
      let idresult;
      try {
        idresult = Module.__pyproxy_getitem(ptrobj, idkey);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(idkey);
      }
      if (idresult === 0) {
        if (Module._PyErr_Occurred()) {
          Module._pythonexc2js();
        } else {
          return void 0;
        }
      }
      return Module.hiwire.pop_value(idresult);
    }
  };
  var PyProxySetItemMethods = class {
    set(key, value) {
      let ptrobj = _getPtr(this);
      let idkey = Module.hiwire.new_value(key);
      let idval = Module.hiwire.new_value(value);
      let errcode;
      try {
        errcode = Module.__pyproxy_setitem(ptrobj, idkey, idval);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(idkey);
        Module.hiwire.decref(idval);
      }
      if (errcode === -1) {
        Module._pythonexc2js();
      }
    }
    delete(key) {
      let ptrobj = _getPtr(this);
      let idkey = Module.hiwire.new_value(key);
      let errcode;
      try {
        errcode = Module.__pyproxy_delitem(ptrobj, idkey);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(idkey);
      }
      if (errcode === -1) {
        Module._pythonexc2js();
      }
    }
  };
  var PyProxyContainsMethods = class {
    has(key) {
      let ptrobj = _getPtr(this);
      let idkey = Module.hiwire.new_value(key);
      let result;
      try {
        result = Module.__pyproxy_contains(ptrobj, idkey);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(idkey);
      }
      if (result === -1) {
        Module._pythonexc2js();
      }
      return result === 1;
    }
  };
  function* iter_helper(iterptr, token) {
    try {
      let item;
      while (item = Module.__pyproxy_iter_next(iterptr)) {
        yield Module.hiwire.pop_value(item);
      }
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.finalizationRegistry.unregister(token);
      Module._Py_DecRef(iterptr);
    }
    if (Module._PyErr_Occurred()) {
      Module._pythonexc2js();
    }
  }
  var PyProxyIterableMethods = class {
    [Symbol.iterator]() {
      let ptrobj = _getPtr(this);
      let token = {};
      let iterptr;
      try {
        iterptr = Module._PyObject_GetIter(ptrobj);
      } catch (e) {
        Module.fatal_error(e);
      }
      if (iterptr === 0) {
        Module._pythonexc2js();
      }
      let result = iter_helper(iterptr, token);
      Module.finalizationRegistry.register(result, [iterptr, void 0], token);
      return result;
    }
  };
  var PyProxyIteratorMethods = class {
    [Symbol.iterator]() {
      return this;
    }
    next(arg = void 0) {
      let idresult;
      let idarg = Module.hiwire.new_value(arg);
      let done;
      try {
        idresult = Module.__pyproxyGen_Send(_getPtr(this), idarg);
        done = idresult === 0;
        if (done) {
          idresult = Module.__pyproxyGen_FetchStopIterationValue();
        }
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(idarg);
      }
      if (done && idresult === 0) {
        Module._pythonexc2js();
      }
      let value = Module.hiwire.pop_value(idresult);
      return { done, value };
    }
  };
  function python_hasattr(jsobj, jskey) {
    let ptrobj = _getPtr(jsobj);
    let idkey = Module.hiwire.new_value(jskey);
    let result;
    try {
      result = Module.__pyproxy_hasattr(ptrobj, idkey);
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.hiwire.decref(idkey);
    }
    if (result === -1) {
      Module._pythonexc2js();
    }
    return result !== 0;
  }
  function python_getattr(jsobj, jskey) {
    let ptrobj = _getPtr(jsobj);
    let idkey = Module.hiwire.new_value(jskey);
    let idresult;
    let cacheId = jsobj.$$.cache.cacheId;
    try {
      idresult = Module.__pyproxy_getattr(ptrobj, idkey, cacheId);
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.hiwire.decref(idkey);
    }
    if (idresult === 0) {
      if (Module._PyErr_Occurred()) {
        Module._pythonexc2js();
      }
    }
    return idresult;
  }
  function python_setattr(jsobj, jskey, jsval) {
    let ptrobj = _getPtr(jsobj);
    let idkey = Module.hiwire.new_value(jskey);
    let idval = Module.hiwire.new_value(jsval);
    let errcode;
    try {
      errcode = Module.__pyproxy_setattr(ptrobj, idkey, idval);
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.hiwire.decref(idkey);
      Module.hiwire.decref(idval);
    }
    if (errcode === -1) {
      Module._pythonexc2js();
    }
  }
  function python_delattr(jsobj, jskey) {
    let ptrobj = _getPtr(jsobj);
    let idkey = Module.hiwire.new_value(jskey);
    let errcode;
    try {
      errcode = Module.__pyproxy_delattr(ptrobj, idkey);
    } catch (e) {
      Module.fatal_error(e);
    } finally {
      Module.hiwire.decref(idkey);
    }
    if (errcode === -1) {
      Module._pythonexc2js();
    }
  }
  var PyProxyHandlers = {
    isExtensible() {
      return true;
    },
    has(jsobj, jskey) {
      let objHasKey = Reflect.has(jsobj, jskey);
      if (objHasKey) {
        return true;
      }
      if (typeof jskey === "symbol") {
        return false;
      }
      if (jskey.startsWith("$")) {
        jskey = jskey.slice(1);
      }
      return python_hasattr(jsobj, jskey);
    },
    get(jsobj, jskey) {
      if (jskey in jsobj || typeof jskey === "symbol") {
        return Reflect.get(jsobj, jskey);
      }
      if (jskey.startsWith("$")) {
        jskey = jskey.slice(1);
      }
      let idresult = python_getattr(jsobj, jskey);
      if (idresult !== 0) {
        return Module.hiwire.pop_value(idresult);
      }
    },
    set(jsobj, jskey, jsval) {
      let descr = Object.getOwnPropertyDescriptor(jsobj, jskey);
      if (descr && !descr.writable) {
        throw new TypeError(`Cannot set read only field '${jskey}'`);
      }
      if (typeof jskey === "symbol") {
        return Reflect.set(jsobj, jskey, jsval);
      }
      if (jskey.startsWith("$")) {
        jskey = jskey.slice(1);
      }
      python_setattr(jsobj, jskey, jsval);
      return true;
    },
    deleteProperty(jsobj, jskey) {
      let descr = Object.getOwnPropertyDescriptor(jsobj, jskey);
      if (descr && !descr.writable) {
        throw new TypeError(`Cannot delete read only field '${jskey}'`);
      }
      if (typeof jskey === "symbol") {
        return Reflect.deleteProperty(jsobj, jskey);
      }
      if (jskey.startsWith("$")) {
        jskey = jskey.slice(1);
      }
      python_delattr(jsobj, jskey);
      return !descr || descr.configurable;
    },
    ownKeys(jsobj) {
      let ptrobj = _getPtr(jsobj);
      let idresult;
      try {
        idresult = Module.__pyproxy_ownKeys(ptrobj);
      } catch (e) {
        Module.fatal_error(e);
      }
      if (idresult === 0) {
        Module._pythonexc2js();
      }
      let result = Module.hiwire.pop_value(idresult);
      result.push(...Reflect.ownKeys(jsobj));
      return result;
    },
    apply(jsobj, jsthis, jsargs) {
      return jsobj.apply(jsthis, jsargs);
    }
  };
  var PyProxyAwaitableMethods = class {
    _ensure_future() {
      if (this.$$.promise) {
        return this.$$.promise;
      }
      let ptrobj = _getPtr(this);
      let resolveHandle;
      let rejectHandle;
      let promise = new Promise((resolve, reject) => {
        resolveHandle = resolve;
        rejectHandle = reject;
      });
      let resolve_handle_id = Module.hiwire.new_value(resolveHandle);
      let reject_handle_id = Module.hiwire.new_value(rejectHandle);
      let errcode;
      try {
        errcode = Module.__pyproxy_ensure_future(ptrobj, resolve_handle_id, reject_handle_id);
      } catch (e) {
        Module.fatal_error(e);
      } finally {
        Module.hiwire.decref(reject_handle_id);
        Module.hiwire.decref(resolve_handle_id);
      }
      if (errcode === -1) {
        Module._pythonexc2js();
      }
      this.$$.promise = promise;
      this.destroy();
      return promise;
    }
    then(onFulfilled, onRejected) {
      let promise = this._ensure_future();
      return promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      let promise = this._ensure_future();
      return promise.catch(onRejected);
    }
    finally(onFinally) {
      let promise = this._ensure_future();
      return promise.finally(onFinally);
    }
  };
  var PyProxyCallableMethods = class {
    apply(jsthis, jsargs) {
      return Module.callPyObject(_getPtr(this), ...jsargs);
    }
    call(jsthis, ...jsargs) {
      return Module.callPyObject(_getPtr(this), ...jsargs);
    }
    callKwargs(...jsargs) {
      if (jsargs.length === 0) {
        throw new TypeError("callKwargs requires at least one argument (the key word argument object)");
      }
      let kwargs = jsargs[jsargs.length - 1];
      if (kwargs.constructor !== void 0 && kwargs.constructor.name !== "Object") {
        throw new TypeError("kwargs argument is not an object");
      }
      return Module.callPyObjectKwargs(_getPtr(this), ...jsargs);
    }
  };
  PyProxyCallableMethods.prototype.prototype = Function.prototype;
  var type_to_array_map = /* @__PURE__ */ new Map([
    ["i8", Int8Array],
    ["u8", Uint8Array],
    ["u8clamped", Uint8ClampedArray],
    ["i16", Int16Array],
    ["u16", Uint16Array],
    ["i32", Int32Array],
    ["u32", Uint32Array],
    ["i32", Int32Array],
    ["u32", Uint32Array],
    ["i64", globalThis.BigInt64Array],
    ["u64", globalThis.BigUint64Array],
    ["f32", Float32Array],
    ["f64", Float64Array],
    ["dataview", DataView]
  ]);
  var PyProxyBufferMethods = class {
    getBuffer(type) {
      let ArrayType = void 0;
      if (type) {
        ArrayType = type_to_array_map.get(type);
        if (ArrayType === void 0) {
          throw new Error(`Unknown type ${type}`);
        }
      }
      let HEAPU32 = Module.HEAPU32;
      let orig_stack_ptr = Module.stackSave();
      let buffer_struct_ptr = Module.stackAlloc(HEAPU32[(Module._buffer_struct_size >> 2) + 0]);
      let this_ptr = _getPtr(this);
      let errcode;
      try {
        errcode = Module.__pyproxy_get_buffer(buffer_struct_ptr, this_ptr);
      } catch (e) {
        Module.fatal_error(e);
      }
      if (errcode === -1) {
        Module._pythonexc2js();
      }
      let startByteOffset = HEAPU32[(buffer_struct_ptr >> 2) + 0];
      let minByteOffset = HEAPU32[(buffer_struct_ptr >> 2) + 1];
      let maxByteOffset = HEAPU32[(buffer_struct_ptr >> 2) + 2];
      let readonly = !!HEAPU32[(buffer_struct_ptr >> 2) + 3];
      let format_ptr = HEAPU32[(buffer_struct_ptr >> 2) + 4];
      let itemsize = HEAPU32[(buffer_struct_ptr >> 2) + 5];
      let shape = Module.hiwire.pop_value(HEAPU32[(buffer_struct_ptr >> 2) + 6]);
      let strides = Module.hiwire.pop_value(HEAPU32[(buffer_struct_ptr >> 2) + 7]);
      let view_ptr = HEAPU32[(buffer_struct_ptr >> 2) + 8];
      let c_contiguous = !!HEAPU32[(buffer_struct_ptr >> 2) + 9];
      let f_contiguous = !!HEAPU32[(buffer_struct_ptr >> 2) + 10];
      let format = Module.UTF8ToString(format_ptr);
      Module.stackRestore(orig_stack_ptr);
      let success = false;
      try {
        let bigEndian = false;
        if (ArrayType === void 0) {
          [ArrayType, bigEndian] = Module.processBufferFormatString(format, " In this case, you can pass an explicit type argument.");
        }
        let alignment = parseInt(ArrayType.name.replace(/[^0-9]/g, "")) / 8 || 1;
        if (bigEndian && alignment > 1) {
          throw new Error("Javascript has no native support for big endian buffers. In this case, you can pass an explicit type argument. For instance, `getBuffer('dataview')` will return a `DataView`which has native support for reading big endian data. Alternatively, toJs will automatically convert the buffer to little endian.");
        }
        let numBytes = maxByteOffset - minByteOffset;
        if (numBytes !== 0 && (startByteOffset % alignment !== 0 || minByteOffset % alignment !== 0 || maxByteOffset % alignment !== 0)) {
          throw new Error(`Buffer does not have valid alignment for a ${ArrayType.name}`);
        }
        let numEntries = numBytes / alignment;
        let offset = (startByteOffset - minByteOffset) / alignment;
        let data;
        if (numBytes === 0) {
          data = new ArrayType();
        } else {
          data = new ArrayType(HEAPU32.buffer, minByteOffset, numEntries);
        }
        for (let i of strides.keys()) {
          strides[i] /= alignment;
        }
        success = true;
        let result = Object.create(PyBuffer.prototype, Object.getOwnPropertyDescriptors({
          offset,
          readonly,
          format,
          itemsize,
          ndim: shape.length,
          nbytes: numBytes,
          shape,
          strides,
          data,
          c_contiguous,
          f_contiguous,
          _view_ptr: view_ptr,
          _released: false
        }));
        return result;
      } finally {
        if (!success) {
          try {
            Module._PyBuffer_Release(view_ptr);
            Module._PyMem_Free(view_ptr);
          } catch (e) {
            Module.fatal_error(e);
          }
        }
      }
    }
  };
  var PyBuffer = class {
    constructor() {
      this.offset;
      this.readonly;
      this.format;
      this.itemsize;
      this.ndim;
      this.nbytes;
      this.shape;
      this.strides;
      this.data;
      this.c_contiguous;
      this.f_contiguous;
      throw new TypeError("PyBuffer is not a constructor");
    }
    release() {
      if (this._released) {
        return;
      }
      try {
        Module._PyBuffer_Release(this._view_ptr);
        Module._PyMem_Free(this._view_ptr);
      } catch (e) {
        Module.fatal_error(e);
      }
      this._released = true;
      this.data = null;
    }
  };

  // node_modules/pyodide/api.js
  var pyodide_py = {};
  var globals = {};
  var PythonError = class {
    constructor() {
      this.message;
    }
  };
  var version = "";
  function runPython(code, globals2 = Module.globals) {
    return Module.pyodide_py.eval_code(code, globals2);
  }
  Module.runPython = runPython;
  async function loadPackagesFromImports(code, messageCallback, errorCallback) {
    let pyimports = Module.pyodide_py.find_imports(code);
    let imports;
    try {
      imports = pyimports.toJs();
    } finally {
      pyimports.destroy();
    }
    if (imports.length === 0) {
      return;
    }
    let packageNames = Module._import_name_to_package_name;
    let packages = /* @__PURE__ */ new Set();
    for (let name of imports) {
      if (packageNames.has(name)) {
        packages.add(packageNames.get(name));
      }
    }
    if (packages.size) {
      await loadPackage(Array.from(packages), messageCallback, errorCallback);
    }
  }
  async function runPythonAsync(code, globals2 = Module.globals) {
    return await Module.pyodide_py.eval_code_async(code, globals2);
  }
  Module.runPythonAsync = runPythonAsync;
  function registerJsModule(name, module) {
    Module.pyodide_py.register_js_module(name, module);
  }
  function registerComlink(Comlink) {
    Module._Comlink = Comlink;
  }
  function unregisterJsModule(name) {
    Module.pyodide_py.unregister_js_module(name);
  }
  function toPy(obj, { depth = -1 } = {}) {
    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean":
      case "bigint":
      case "undefined":
        return obj;
    }
    if (!obj || Module.isPyProxy(obj)) {
      return obj;
    }
    let obj_id = 0;
    let py_result = 0;
    let result = 0;
    try {
      obj_id = Module.hiwire.new_value(obj);
      try {
        py_result = Module.js2python_convert(obj_id, /* @__PURE__ */ new Map(), depth);
      } catch (e) {
        if (e instanceof Module._PropagatePythonError) {
          Module._pythonexc2js();
        }
        throw e;
      }
      if (Module._JsProxy_Check(py_result)) {
        return obj;
      }
      result = Module._python2js(py_result);
      if (result === 0) {
        Module._pythonexc2js();
      }
    } finally {
      Module.hiwire.decref(obj_id);
      Module._Py_DecRef(py_result);
    }
    return Module.hiwire.pop_value(result);
  }
  function pyimport(mod_name) {
    return Module.importlib.import_module(mod_name);
  }
  function unpackArchive(buffer, format, extract_dir) {
    if (!Module._util_module) {
      Module._util_module = pyimport("pyodide._util");
    }
    Module._util_module.unpack_buffer_archive.callKwargs(buffer, {
      format,
      extract_dir
    });
  }
  Module.saveState = () => Module.pyodide_py._state.save_state();
  Module.restoreState = (state) => Module.pyodide_py._state.restore_state(state);
  function setInterruptBuffer(interrupt_buffer) {
    Module.interrupt_buffer = interrupt_buffer;
    Module._set_pyodide_callback(!!interrupt_buffer);
  }
  function checkInterrupt() {
    if (Module.interrupt_buffer[0] === 2) {
      Module.interrupt_buffer[0] = 0;
      Module._PyErr_SetInterrupt();
      Module.runPython("");
    }
  }
  function makePublicAPI() {
    const FS = Module.FS;
    let namespace = {
      globals,
      FS,
      pyodide_py,
      version,
      loadPackage,
      loadPackagesFromImports,
      loadedPackages,
      isPyProxy,
      runPython,
      runPythonAsync,
      registerJsModule,
      unregisterJsModule,
      setInterruptBuffer,
      checkInterrupt,
      toPy,
      pyimport,
      unpackArchive,
      registerComlink,
      PythonError,
      PyBuffer
    };
    namespace._module = Module;
    Module.public_api = namespace;
    return namespace;
  }

  // node_modules/pyodide/pyodide.js
  Module.dump_traceback = function() {
    const fd_stdout = 1;
    Module.__Py_DumpTraceback(fd_stdout, Module._PyGILState_GetThisThreadState());
  };
  var fatal_error_occurred = false;
  Module.fatal_error = function(e) {
    if (e.pyodide_fatal_error) {
      return;
    }
    if (fatal_error_occurred) {
      console.error("Recursive call to fatal_error. Inner error was:");
      console.error(e);
      return;
    }
    e.pyodide_fatal_error = true;
    fatal_error_occurred = true;
    console.error("Pyodide has suffered a fatal error. Please report this to the Pyodide maintainers.");
    console.error("The cause of the fatal error was:");
    if (Module.inTestHoist) {
      console.error(e.toString());
      console.error(e.stack);
    } else {
      console.error(e);
    }
    try {
      Module.dump_traceback();
      for (let key of Object.keys(Module.public_api)) {
        if (key.startsWith("_") || key === "version") {
          continue;
        }
        Object.defineProperty(Module.public_api, key, {
          enumerable: true,
          configurable: true,
          get: () => {
            throw new Error("Pyodide already fatally failed and can no longer be used.");
          }
        });
      }
      if (Module.on_fatal) {
        Module.on_fatal(e);
      }
    } catch (err2) {
      console.error("Another error occurred while handling the fatal error:");
      console.error(err2);
    }
    throw e;
  };
  var runPythonInternal_dict;
  Module.runPythonInternal = function(code) {
    return Module._pyodide._base.eval_code(code, runPythonInternal_dict);
  };
  function wrapPythonGlobals(globals_dict, builtins_dict) {
    return new Proxy(globals_dict, {
      get(target, symbol) {
        if (symbol === "get") {
          return (key) => {
            let result = target.get(key);
            if (result === void 0) {
              result = builtins_dict.get(key);
            }
            return result;
          };
        }
        if (symbol === "has") {
          return (key) => target.has(key) || builtins_dict.has(key);
        }
        return Reflect.get(target, symbol);
      }
    });
  }
  function unpackPyodidePy(pyodide_py_tar) {
    const fileName = "/pyodide_py.tar";
    let stream = Module.FS.open(fileName, "w");
    Module.FS.write(stream, new Uint8Array(pyodide_py_tar), 0, pyodide_py_tar.byteLength, void 0, true);
    Module.FS.close(stream);
    const code_ptr = Module.stringToNewUTF8(`
import shutil
shutil.unpack_archive("/pyodide_py.tar", "/lib/python3.9/site-packages/")
del shutil
import importlib
importlib.invalidate_caches()
del importlib
    `);
    let errcode = Module._PyRun_SimpleString(code_ptr);
    if (errcode) {
      throw new Error("OOPS!");
    }
    Module._free(code_ptr);
    Module.FS.unlink(fileName);
  }
  function finalizeBootstrap(config) {
    runPythonInternal_dict = Module._pyodide._base.eval_code("{}");
    Module.importlib = Module.runPythonInternal("import importlib; importlib");
    let import_module5 = Module.importlib.import_module;
    Module.sys = import_module5("sys");
    Module.sys.path.insert(0, config.homedir);
    let globals2 = Module.runPythonInternal("import __main__; __main__.__dict__");
    let builtins = Module.runPythonInternal("import builtins; builtins.__dict__");
    Module.globals = wrapPythonGlobals(globals2, builtins);
    let importhook = Module._pyodide._importhook;
    importhook.register_js_finder();
    importhook.register_js_module("js", config.jsglobals);
    let pyodide = makePublicAPI();
    importhook.register_js_module("pyodide_js", pyodide);
    Module.pyodide_py = import_module5("pyodide");
    Module.version = Module.pyodide_py.__version__;
    pyodide.pyodide_py = Module.pyodide_py;
    pyodide.version = Module.version;
    pyodide.globals = Module.globals;
    return pyodide;
  }
  async function loadPyodide(config) {
    if (globalThis.__pyodide_module) {
      throw new Error("Pyodide is already loading.");
    }
    if (!config.indexURL) {
      throw new Error("Please provide indexURL parameter to loadPyodide");
    }
    loadPyodide.inProgress = true;
    globalThis.__pyodide_module = Module;
    const default_config = {
      fullStdLib: true,
      jsglobals: globalThis,
      stdin: globalThis.prompt ? globalThis.prompt : void 0,
      homedir: "/home/pyodide"
    };
    config = Object.assign(default_config, config);
    if (!config.indexURL.endsWith("/")) {
      config.indexURL += "/";
    }
    Module.indexURL = config.indexURL;
    let packageIndexReady = initializePackageIndex(config.indexURL);
    let pyodide_py_tar_promise = _fetchBinaryFile(config.indexURL, "pyodide_py.tar");
    setStandardStreams(config.stdin, config.stdout, config.stderr);
    setHomeDirectory(config.homedir);
    let moduleLoaded = new Promise((r) => Module.postRun = r);
    const scriptSrc = `${config.indexURL}pyodide.asm.js`;
    await loadScript(scriptSrc);
    await _createPyodideModule(Module);
    await moduleLoaded;
    const pyodide_py_tar = await pyodide_py_tar_promise;
    unpackPyodidePy(pyodide_py_tar);
    Module._pyodide_init();
    let pyodide = finalizeBootstrap(config);
    await packageIndexReady;
    if (config.fullStdLib) {
      await loadPackage(["distutils"]);
    }
    pyodide.runPython("print('Python initialization complete')");
    return pyodide;
  }
  globalThis.loadPyodide = loadPyodide;

  // src/py/main.py
  function importPythonPackage(pyodide) {
    const file = String.raw`#!/usr/bin/env python
import contextlib as __stickytape_contextlib

@__stickytape_contextlib.contextmanager
def __stickytape_temporary_dir():
    import tempfile
    import shutil
    dir_path = tempfile.mkdtemp()
    try:
        yield dir_path
    finally:
        shutil.rmtree(dir_path)

with __stickytape_temporary_dir() as __stickytape_working_dir:
    def __stickytape_write_module(path, contents):
        import os, os.path

        def make_package(path):
            parts = path.split("/")
            partial_path = __stickytape_working_dir
            for part in parts:
                partial_path = os.path.join(partial_path, part)
                if not os.path.exists(partial_path):
                    os.mkdir(partial_path)
                    with open(os.path.join(partial_path, "__init__.py"), "wb") as f:
                        f.write(b"\n")

        make_package(os.path.dirname(path))

        full_path = os.path.join(__stickytape_working_dir, path)
        with open(full_path, "wb") as module_file:
            module_file.write(contents)

    import sys as __stickytape_sys
    __stickytape_sys.path.insert(0, __stickytape_working_dir)

    __stickytape_write_module('lib/calc.py', b'def add(n1: int, n2: int) -> int:\n    return n1 + n2\n\ndef sub(n1: int, n2: int) -> int:\n    return n1 - n2\n')
    from lib.calc import add
    
    print("Hello World from Python!")
    print(f"2 + 3 = {add(2, 3)}")
    `;
    const filePath = "main.py";
    const dirPath = filePath.split(/\//gm).slice(0, -1).join("");
    const importPath = filePath.replace(/\//gm, ".").replace(/.py$/gm, "");
    pyodide.runPython(`
import os
if 0 < len("${dirPath}"):
    os.makedirs("${dirPath}", exist_ok=True)

with open("${filePath}", "w") as f:
    f.write(r"""${file}""")
`);
    const pkg = pyodide.pyimport(importPath);
    return pkg;
  }
  var main_default = {
    import: importPythonPackage
  };

  // src/py/lib/calc.py
  function importPythonPackage2(pyodide) {
    const file = String.raw`#!/usr/bin/env python
import contextlib as __stickytape_contextlib

@__stickytape_contextlib.contextmanager
def __stickytape_temporary_dir():
    import tempfile
    import shutil
    dir_path = tempfile.mkdtemp()
    try:
        yield dir_path
    finally:
        shutil.rmtree(dir_path)

with __stickytape_temporary_dir() as __stickytape_working_dir:
    def __stickytape_write_module(path, contents):
        import os, os.path

        def make_package(path):
            parts = path.split("/")
            partial_path = __stickytape_working_dir
            for part in parts:
                partial_path = os.path.join(partial_path, part)
                if not os.path.exists(partial_path):
                    os.mkdir(partial_path)
                    with open(os.path.join(partial_path, "__init__.py"), "wb") as f:
                        f.write(b"\n")

        make_package(os.path.dirname(path))

        full_path = os.path.join(__stickytape_working_dir, path)
        with open(full_path, "wb") as module_file:
            module_file.write(contents)

    import sys as __stickytape_sys
    __stickytape_sys.path.insert(0, __stickytape_working_dir)

    def add(n1: int, n2: int) -> int:
        return n1 + n2
    
    def sub(n1: int, n2: int) -> int:
        return n1 - n2
    `;
    const filePath = "lib/calc.py";
    const dirPath = filePath.split(/\//gm).slice(0, -1).join("");
    const importPath = filePath.replace(/\//gm, ".").replace(/.py$/gm, "");
    pyodide.runPython(`
import os
if 0 < len("${dirPath}"):
    os.makedirs("${dirPath}", exist_ok=True)

with open("${filePath}", "w") as f:
    f.write(r"""${file}""")
`);
    const pkg = pyodide.pyimport(importPath);
    return pkg;
  }
  var calc_default = {
    import: importPythonPackage2
  };

  // src/pages/index.ts
  async function main() {
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/"
    });
    console.log("ready pyodide");
    const PyMainPkg = main_default.import(pyodide);
    const PyCalcPkg = calc_default.import(pyodide);
    window.pycalc = {
      add: PyCalcPkg.add,
      sub: PyCalcPkg.sub
    };
  }
  main();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvYnJvd3Nlci5qcyIsICIuLi9ub2RlX21vZHVsZXMvcHlvZGlkZS9tb2R1bGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3B5b2RpZGUvbG9hZC1weW9kaWRlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9weW9kaWRlL3B5cHJveHkuZ2VuLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9weW9kaWRlL2FwaS5qcyIsICIuLi9ub2RlX21vZHVsZXMvcHlvZGlkZS9weW9kaWRlLmpzIiwgIi4uL3NyYy9weS9tYWluLnB5IiwgIi4uL3NyYy9weS9saWIvY2FsYy5weSIsICIuLi9zcmMvcGFnZXMvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlwidXNlIHN0cmljdFwiO1xuXG4vLyByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxudmFyIGdldEdsb2JhbCA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gdGhlIG9ubHkgcmVsaWFibGUgbWVhbnMgdG8gZ2V0IHRoZSBnbG9iYWwgb2JqZWN0IGlzXG5cdC8vIGBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpYFxuXHQvLyBIb3dldmVyLCB0aGlzIGNhdXNlcyBDU1AgdmlvbGF0aW9ucyBpbiBDaHJvbWUgYXBwcy5cblx0aWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gc2VsZjsgfVxuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIHdpbmRvdzsgfVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGdsb2JhbDsgfVxuXHR0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdCcpO1xufVxuXG52YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGdsb2JhbC5mZXRjaDtcblxuLy8gTmVlZGVkIGZvciBUeXBlU2NyaXB0IGFuZCBXZWJwYWNrLlxuaWYgKGdsb2JhbC5mZXRjaCkge1xuXHRleHBvcnRzLmRlZmF1bHQgPSBnbG9iYWwuZmV0Y2guYmluZChnbG9iYWwpO1xufVxuXG5leHBvcnRzLkhlYWRlcnMgPSBnbG9iYWwuSGVhZGVycztcbmV4cG9ydHMuUmVxdWVzdCA9IGdsb2JhbC5SZXF1ZXN0O1xuZXhwb3J0cy5SZXNwb25zZSA9IGdsb2JhbC5SZXNwb25zZTsiLCAiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdlbXNjcmlwdGVuJykuTW9kdWxlfSBNb2R1bGVcbiAqL1xuXG4vKipcbiAqIFRoZSBFbXNjcmlwdGVuIE1vZHVsZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHR5cGUge01vZHVsZX1cbiAqL1xuZXhwb3J0IGxldCBNb2R1bGUgPSB7fTtcbk1vZHVsZS5ub0ltYWdlRGVjb2RpbmcgPSB0cnVlO1xuTW9kdWxlLm5vQXVkaW9EZWNvZGluZyA9IHRydWU7XG5Nb2R1bGUubm9XYXNtRGVjb2RpbmcgPSBmYWxzZTsgLy8gd2UgcHJlbG9hZCB3YXNtIHVzaW5nIHRoZSBidWlsdCBpbiBwbHVnaW4gbm93XG5Nb2R1bGUucHJlbG9hZGVkV2FzbSA9IHt9O1xuTW9kdWxlLnByZVJ1biA9IFtdO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3VuZGVmaW5lZCB8IGZ1bmN0aW9uKCk6IHN0cmluZ30gc3RkaW5cbiAqIEBwYXJhbSB7dW5kZWZpbmVkIHwgZnVuY3Rpb24oc3RyaW5nKX0gc3Rkb3V0XG4gKiBAcGFyYW0ge3VuZGVmaW5lZCB8IGZ1bmN0aW9uKHN0cmluZyl9IHN0ZGVyclxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFN0YW5kYXJkU3RyZWFtcyhzdGRpbiwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgLy8gRm9yIHN0ZG91dCBhbmQgc3RkZXJyLCBlbXNjcmlwdGVuIHByb3ZpZGVzIGNvbnZlbmllbnQgd3JhcHBlcnMgdGhhdCBzYXZlIHVzIHRoZSB0cm91YmxlIG9mIGNvbnZlcnRpbmcgdGhlIGJ5dGVzIGludG8gYSBzdHJpbmdcbiAgaWYgKHN0ZG91dCkge1xuICAgIE1vZHVsZS5wcmludCA9IHN0ZG91dDtcbiAgfVxuXG4gIGlmIChzdGRlcnIpIHtcbiAgICBNb2R1bGUucHJpbnRFcnIgPSBzdGRlcnI7XG4gIH1cblxuICAvLyBGb3Igc3RkaW4sIHdlIGhhdmUgdG8gZGVhbCB3aXRoIHRoZSBsb3cgbGV2ZWwgQVBJIG91cnNlbHZlc1xuICBpZiAoc3RkaW4pIHtcbiAgICBNb2R1bGUucHJlUnVuLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgTW9kdWxlLkZTLmluaXQoY3JlYXRlU3RkaW5XcmFwcGVyKHN0ZGluKSwgbnVsbCwgbnVsbCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3RkaW5XcmFwcGVyKHN0ZGluKSB7XG4gIC8vIFdoZW4gY2FsbGVkLCBpdCBhc2tzIHRoZSB1c2VyIGZvciBvbmUgd2hvbGUgbGluZSBvZiBpbnB1dCAoc3RkaW4pXG4gIC8vIFRoZW4sIGl0IHBhc3NlcyB0aGUgaW5kaXZpZHVhbCBieXRlcyBvZiB0aGUgaW5wdXQgdG8gZW1zY3JpcHRlbiwgb25lIGFmdGVyIGFub3RoZXIuXG4gIC8vIEFuZCBmaW5hbGx5LCBpdCB0ZXJtaW5hdGVzIGl0IHdpdGggbnVsbC5cbiAgY29uc3QgZW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICBsZXQgaW5wdXQgPSBuZXcgVWludDhBcnJheSgwKTtcbiAgbGV0IGlucHV0SW5kZXggPSAtMTsgLy8gLTEgbWVhbnMgdGhhdCB3ZSBqdXN0IHJldHVybmVkIG51bGxcbiAgZnVuY3Rpb24gc3RkaW5XcmFwcGVyKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaW5wdXRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgbGV0IHRleHQgPSBzdGRpbigpO1xuICAgICAgICBpZiAodGV4dCA9PT0gdW5kZWZpbmVkIHx8IHRleHQgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRleHQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgYEV4cGVjdGVkIHN0ZGluIHRvIHJldHVybiBzdHJpbmcsIG51bGwsIG9yIHVuZGVmaW5lZCwgZ290IHR5cGUgJHt0eXBlb2YgdGV4dH0uYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0ZXh0LmVuZHNXaXRoKFwiXFxuXCIpKSB7XG4gICAgICAgICAgdGV4dCArPSBcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0gZW5jb2Rlci5lbmNvZGUodGV4dCk7XG4gICAgICAgIGlucHV0SW5kZXggPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXRJbmRleCA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICBsZXQgY2hhcmFjdGVyID0gaW5wdXRbaW5wdXRJbmRleF07XG4gICAgICAgIGlucHV0SW5kZXgrKztcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0SW5kZXggPSAtMTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZW1zY3JpcHRlbiB3aWxsIGNhdGNoIHRoaXMgYW5kIHNldCBhbiBJT0Vycm9yIHdoaWNoIGlzIHVuaGVscGZ1bCBmb3JcbiAgICAgIC8vIGRlYnVnZ2luZy5cbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB0aHJvd24gaW4gc3RkaW46XCIpO1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdGRpbldyYXBwZXI7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgaG9tZSBkaXJlY3RvcnkgaW5zaWRlIHRoZSB2aXJ0dWFsIGZpbGUgc3lzdGVtLFxuICogdGhlbiBjaGFuZ2UgdGhlIHdvcmtpbmcgZGlyZWN0b3J5IHRvIGl0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0SG9tZURpcmVjdG9yeShwYXRoKSB7XG4gIE1vZHVsZS5wcmVSdW4ucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZmFsbGJhY2tQYXRoID0gXCIvXCI7XG4gICAgdHJ5IHtcbiAgICAgIE1vZHVsZS5GUy5ta2RpclRyZWUocGF0aCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igb2NjdXJyZWQgd2hpbGUgbWFraW5nIGEgaG9tZSBkaXJlY3RvcnkgJyR7cGF0aH0nOmApO1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFVzaW5nICcke2ZhbGxiYWNrUGF0aH0nIGZvciBhIGhvbWUgZGlyZWN0b3J5IGluc3RlYWRgKTtcbiAgICAgIHBhdGggPSBmYWxsYmFja1BhdGg7XG4gICAgfVxuICAgIE1vZHVsZS5FTlYuSE9NRSA9IHBhdGg7XG4gICAgTW9kdWxlLkZTLmNoZGlyKHBhdGgpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBNb2R1bGUgfSBmcm9tIFwiLi9tb2R1bGUuanNcIjtcblxuY29uc3QgSU5fTk9ERSA9XG4gIHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmXG4gIHByb2Nlc3MucmVsZWFzZSAmJlxuICBwcm9jZXNzLnJlbGVhc2UubmFtZSA9PT0gXCJub2RlXCIgJiZcbiAgdHlwZW9mIHByb2Nlc3MuYnJvd3NlciA9PT1cbiAgICBcInVuZGVmaW5lZFwiOyAvKiBUaGlzIGxhc3QgY29uZGl0aW9uIGNoZWNrcyBpZiB3ZSBydW4gdGhlIGJyb3dzZXIgc2hpbSBvZiBwcm9jZXNzICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3B5cHJveHkuanMnKS5QeVByb3h5fSBQeVByb3h5ICovXG4vKiogQHByaXZhdGUgKi9cbmxldCBiYXNlVVJMO1xuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5kZXhVUkxcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplUGFja2FnZUluZGV4KGluZGV4VVJMKSB7XG4gIGJhc2VVUkwgPSBpbmRleFVSTDtcbiAgbGV0IHBhY2thZ2VfanNvbjtcbiAgaWYgKElOX05PREUpIHtcbiAgICBjb25zdCBmc1Byb21pc2VzID0gYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gXCJmcy9wcm9taXNlc1wiKTtcbiAgICBjb25zdCBwYWNrYWdlX3N0cmluZyA9IGF3YWl0IGZzUHJvbWlzZXMucmVhZEZpbGUoXG4gICAgICBgJHtpbmRleFVSTH1wYWNrYWdlcy5qc29uYFxuICAgICk7XG4gICAgcGFja2FnZV9qc29uID0gSlNPTi5wYXJzZShwYWNrYWdlX3N0cmluZyk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7aW5kZXhVUkx9cGFja2FnZXMuanNvbmApO1xuICAgIHBhY2thZ2VfanNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuICBpZiAoIXBhY2thZ2VfanNvbi5wYWNrYWdlcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiTG9hZGVkIHBhY2thZ2VzLmpzb24gZG9lcyBub3QgY29udGFpbiB0aGUgZXhwZWN0ZWQga2V5ICdwYWNrYWdlcycuXCJcbiAgICApO1xuICB9XG4gIE1vZHVsZS5wYWNrYWdlcyA9IHBhY2thZ2VfanNvbi5wYWNrYWdlcztcblxuICAvLyBjb21wdXRlIHRoZSBpbnZlcnRlZCBpbmRleCBmb3IgaW1wb3J0cyB0byBwYWNrYWdlIG5hbWVzXG4gIE1vZHVsZS5faW1wb3J0X25hbWVfdG9fcGFja2FnZV9uYW1lID0gbmV3IE1hcCgpO1xuICBmb3IgKGxldCBuYW1lIG9mIE9iamVjdC5rZXlzKE1vZHVsZS5wYWNrYWdlcykpIHtcbiAgICBmb3IgKGxldCBpbXBvcnRfbmFtZSBvZiBNb2R1bGUucGFja2FnZXNbbmFtZV0uaW1wb3J0cykge1xuICAgICAgTW9kdWxlLl9pbXBvcnRfbmFtZV90b19wYWNrYWdlX25hbWUuc2V0KGltcG9ydF9uYW1lLCBuYW1lKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9mZXRjaEJpbmFyeUZpbGUoaW5kZXhVUkwsIHBhdGgpIHtcbiAgaWYgKElOX05PREUpIHtcbiAgICBjb25zdCBmc1Byb21pc2VzID0gYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gXCJmcy9wcm9taXNlc1wiKTtcbiAgICBjb25zdCB0YXJfYnVmZmVyID0gYXdhaXQgZnNQcm9taXNlcy5yZWFkRmlsZShgJHtpbmRleFVSTH0ke3BhdGh9YCk7XG4gICAgcmV0dXJuIHRhcl9idWZmZXIuYnVmZmVyO1xuICB9IGVsc2Uge1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2luZGV4VVJMfSR7cGF0aH1gKTtcbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgfVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFBhY2thZ2UgbG9hZGluZ1xuY29uc3QgREVGQVVMVF9DSEFOTkVMID0gXCJkZWZhdWx0IGNoYW5uZWxcIjtcblxuLy8gUmVnZXhwIGZvciB2YWxpZGF0aW5nIHBhY2thZ2UgbmFtZSBhbmQgVVJJXG5jb25zdCBwYWNrYWdlX3VyaV9yZWdleHAgPSAvXi4qPyhbXlxcL10qKVxcLmpzJC87XG5cbmZ1bmN0aW9uIF91cmlfdG9fcGFja2FnZV9uYW1lKHBhY2thZ2VfdXJpKSB7XG4gIGxldCBtYXRjaCA9IHBhY2thZ2VfdXJpX3JlZ2V4cC5leGVjKHBhY2thZ2VfdXJpKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoWzFdLnRvTG93ZXJDYXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZykgdXJsXG4gKiBAYXN5bmNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBsZXQgbG9hZFNjcmlwdDtcbmlmIChnbG9iYWxUaGlzLmRvY3VtZW50KSB7XG4gIC8vIGJyb3dzZXJcbiAgbG9hZFNjcmlwdCA9IGFzeW5jICh1cmwpID0+IGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVybCk7XG59IGVsc2UgaWYgKGdsb2JhbFRoaXMuaW1wb3J0U2NyaXB0cykge1xuICAvLyB3ZWJ3b3JrZXJcbiAgbG9hZFNjcmlwdCA9IGFzeW5jICh1cmwpID0+IHtcbiAgICAvLyBUaGlzIGlzIGFzeW5jIG9ubHkgZm9yIGNvbnNpc3RlbmN5XG4gICAgZ2xvYmFsVGhpcy5pbXBvcnRTY3JpcHRzKHVybCk7XG4gIH07XG59IGVsc2UgaWYgKElOX05PREUpIHtcbiAgY29uc3QgcGF0aFByb21pc2UgPSBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyBcInBhdGhcIikudGhlbihcbiAgICAoTSkgPT4gTS5kZWZhdWx0XG4gICk7XG4gIGNvbnN0IGZldGNoUHJvbWlzZSA9IGltcG9ydChcIm5vZGUtZmV0Y2hcIikudGhlbigoTSkgPT4gTS5kZWZhdWx0KTtcbiAgY29uc3Qgdm1Qcm9taXNlID0gaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gXCJ2bVwiKS50aGVuKFxuICAgIChNKSA9PiBNLmRlZmF1bHRcbiAgKTtcbiAgbG9hZFNjcmlwdCA9IGFzeW5jICh1cmwpID0+IHtcbiAgICBpZiAodXJsLmluY2x1ZGVzKFwiOi8vXCIpKSB7XG4gICAgICAvLyBJZiBpdCdzIGEgdXJsLCBoYXZlIHRvIGxvYWQgaXQgd2l0aCBmZXRjaCBhbmQgdGhlbiBldmFsIGl0LlxuICAgICAgY29uc3QgZmV0Y2ggPSBhd2FpdCBmZXRjaFByb21pc2U7XG4gICAgICBjb25zdCB2bSA9IGF3YWl0IHZtUHJvbWlzZTtcbiAgICAgIHZtLnJ1bkluVGhpc0NvbnRleHQoYXdhaXQgKGF3YWl0IGZldGNoKHVybCkpLnRleHQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgaG9wZWZ1bGx5IGl0IGlzIGEgcmVsYXRpdmUgcGF0aCB3ZSBjYW4gbG9hZCBmcm9tIHRoZSBmaWxlXG4gICAgICAvLyBzeXN0ZW0uXG4gICAgICBjb25zdCBwYXRoID0gYXdhaXQgcGF0aFByb21pc2U7XG4gICAgICBhd2FpdCBpbXBvcnQocGF0aC5yZXNvbHZlKHVybCkpO1xuICAgIH1cbiAgfTtcbn0gZWxzZSB7XG4gIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBkZXRlcm1pbmUgcnVudGltZSBlbnZpcm9ubWVudFwiKTtcbn1cblxuZnVuY3Rpb24gYWRkUGFja2FnZVRvTG9hZChuYW1lLCB0b0xvYWQpIHtcbiAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKHRvTG9hZC5oYXMobmFtZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdG9Mb2FkLnNldChuYW1lLCBERUZBVUxUX0NIQU5ORUwpO1xuICAvLyBJZiB0aGUgcGFja2FnZSBpcyBhbHJlYWR5IGxvYWRlZCwgd2UgZG9uJ3QgYWRkIGRlcGVuZGVuY2llcywgYnV0IHdhcm5cbiAgLy8gdGhlIHVzZXIgbGF0ZXIuIFRoaXMgaXMgZXNwZWNpYWxseSBpbXBvcnRhbnQgaWYgdGhlIGxvYWRlZCBwYWNrYWdlIGlzXG4gIC8vIGZyb20gYSBjdXN0b20gdXJsLCBpbiB3aGljaCBjYXNlIGFkZGluZyBkZXBlbmRlbmNpZXMgaXMgd3JvbmcuXG4gIGlmIChsb2FkZWRQYWNrYWdlc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAobGV0IGRlcF9uYW1lIG9mIE1vZHVsZS5wYWNrYWdlc1tuYW1lXS5kZXBlbmRzKSB7XG4gICAgYWRkUGFja2FnZVRvTG9hZChkZXBfbmFtZSwgdG9Mb2FkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWN1cnNpdmVEZXBlbmRlbmNpZXMoXG4gIG5hbWVzLFxuICBfbWVzc2FnZUNhbGxiYWNrLFxuICBlcnJvckNhbGxiYWNrLFxuICBzaGFyZWRMaWJzT25seVxuKSB7XG4gIGNvbnN0IHRvTG9hZCA9IG5ldyBNYXAoKTtcbiAgZm9yIChsZXQgbmFtZSBvZiBuYW1lcykge1xuICAgIGNvbnN0IHBrZ25hbWUgPSBfdXJpX3RvX3BhY2thZ2VfbmFtZShuYW1lKTtcbiAgICBpZiAodG9Mb2FkLmhhcyhwa2duYW1lKSAmJiB0b0xvYWQuZ2V0KHBrZ25hbWUpICE9PSBuYW1lKSB7XG4gICAgICBlcnJvckNhbGxiYWNrKFxuICAgICAgICBgTG9hZGluZyBzYW1lIHBhY2thZ2UgJHtwa2duYW1lfSBmcm9tICR7bmFtZX0gYW5kICR7dG9Mb2FkLmdldChcbiAgICAgICAgICBwa2duYW1lXG4gICAgICAgICl9YFxuICAgICAgKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAocGtnbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0b0xvYWQuc2V0KHBrZ25hbWUsIG5hbWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG5hbWUgaW4gTW9kdWxlLnBhY2thZ2VzKSB7XG4gICAgICBhZGRQYWNrYWdlVG9Mb2FkKG5hbWUsIHRvTG9hZCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZXJyb3JDYWxsYmFjayhgU2tpcHBpbmcgdW5rbm93biBwYWNrYWdlICcke25hbWV9J2ApO1xuICB9XG4gIGlmIChzaGFyZWRMaWJzT25seSkge1xuICAgIGxldCBvbmx5U2hhcmVkTGlicyA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGxldCBjIG9mIHRvTG9hZCkge1xuICAgICAgbGV0IG5hbWUgPSBjWzBdO1xuICAgICAgaWYgKE1vZHVsZS5wYWNrYWdlc1tuYW1lXS5zaGFyZWRfbGlicmFyeSkge1xuICAgICAgICBvbmx5U2hhcmVkTGlicy5zZXQobmFtZSwgdG9Mb2FkLmdldChuYW1lKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvbmx5U2hhcmVkTGlicztcbiAgfVxuICByZXR1cm4gdG9Mb2FkO1xufVxuXG4vLyBsb2NhdGVGaWxlIGlzIHRoZSBmdW5jdGlvbiB1c2VkIGJ5IHRoZSAuanMgZmlsZSB0byBsb2NhdGUgdGhlIC5kYXRhIGZpbGVcbi8vIGdpdmVuIHRoZSBmaWxlbmFtZVxuTW9kdWxlLmxvY2F0ZUZpbGUgPSBmdW5jdGlvbiAocGF0aCkge1xuICAvLyBoYW5kbGUgcGFja2FnZXMgbG9hZGVkIGZyb20gY3VzdG9tIFVSTHNcbiAgbGV0IHBrZyA9IHBhdGgucmVwbGFjZSgvXFwuZGF0YSQvLCBcIlwiKTtcbiAgY29uc3QgdG9Mb2FkID0gTW9kdWxlLmxvY2F0ZUZpbGVfcGFja2FnZXNUb0xvYWQ7XG4gIGlmICh0b0xvYWQgJiYgdG9Mb2FkLmhhcyhwa2cpKSB7XG4gICAgbGV0IHBhY2thZ2VfdXJpID0gdG9Mb2FkLmdldChwa2cpO1xuICAgIGlmIChwYWNrYWdlX3VyaSAhPSBERUZBVUxUX0NIQU5ORUwpIHtcbiAgICAgIHJldHVybiBwYWNrYWdlX3VyaS5yZXBsYWNlKC9cXC5qcyQvLCBcIi5kYXRhXCIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmFzZVVSTCArIHBhdGg7XG59O1xuXG4vLyBXaGVuIHRoZSBKUyBsb2FkcywgaXQgc3luY2hyb25vdXNseSBhZGRzIGEgcnVuRGVwZW5kZW5jeSB0byBlbXNjcmlwdGVuLiBJdFxuLy8gdGhlbiBsb2FkcyB0aGUgZGF0YSBmaWxlLCBhbmQgcmVtb3ZlcyB0aGUgcnVuRGVwZW5kZW5jeSBmcm9tIGVtc2NyaXB0ZW4uXG4vLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGVyZSBhcmUgbm8gcGVuZGluZ1xuLy8gcnVuRGVwZW5kZW5jaWVzLlxuZnVuY3Rpb24gd2FpdFJ1bkRlcGVuZGVuY3koKSB7XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocikgPT4ge1xuICAgIE1vZHVsZS5tb25pdG9yUnVuRGVwZW5kZW5jaWVzID0gKG4pID0+IHtcbiAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgIHIoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbiAgLy8gSWYgdGhlcmUgYXJlIG5vIHBlbmRpbmcgZGVwZW5kZW5jaWVzIGxlZnQsIG1vbml0b3JSdW5EZXBlbmRlbmNpZXMgd2lsbFxuICAvLyBuZXZlciBiZSBjYWxsZWQuIFNpbmNlIHdlIGNhbid0IGNoZWNrIHRoZSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzLFxuICAvLyBtYW51YWxseSB0cmlnZ2VyIGEgY2FsbC5cbiAgTW9kdWxlLmFkZFJ1bkRlcGVuZGVuY3koXCJkdW1teVwiKTtcbiAgTW9kdWxlLnJlbW92ZVJ1bkRlcGVuZGVuY3koXCJkdW1teVwiKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9sb2FkUGFja2FnZShuYW1lcywgbWVzc2FnZUNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XG4gIC8vIHRvTG9hZCBpcyBhIG1hcCBwa2dfbmFtZSA9PiBwa2dfdXJpXG4gIGxldCB0b0xvYWQgPSByZWN1cnNpdmVEZXBlbmRlbmNpZXMobmFtZXMsIG1lc3NhZ2VDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG4gIC8vIFRlbGwgTW9kdWxlLmxvY2F0ZUZpbGUgYWJvdXQgdGhlIHBhY2thZ2VzIHdlJ3JlIGxvYWRpbmdcbiAgTW9kdWxlLmxvY2F0ZUZpbGVfcGFja2FnZXNUb0xvYWQgPSB0b0xvYWQ7XG4gIGlmICh0b0xvYWQuc2l6ZSA9PT0gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXCJObyBuZXcgcGFja2FnZXMgdG8gbG9hZFwiKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcGFja2FnZU5hbWVzID0gQXJyYXkuZnJvbSh0b0xvYWQua2V5cygpKS5qb2luKFwiLCBcIik7XG4gICAgbWVzc2FnZUNhbGxiYWNrKGBMb2FkaW5nICR7cGFja2FnZU5hbWVzfWApO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBhIGNvbGxlY3Rpb24gb2YgcHJvbWlzZXMgdGhhdCByZXNvbHZlIHdoZW4gdGhlIHBhY2thZ2UncyBKUyBmaWxlIGlzXG4gIC8vIGxvYWRlZC4gVGhlIHByb21pc2VzIGFscmVhZHkgaGFuZGxlIGVycm9yIGFuZCBuZXZlciBmYWlsLlxuICBsZXQgc2NyaXB0UHJvbWlzZXMgPSBbXTtcblxuICBmb3IgKGxldCBbcGtnLCB1cmldIG9mIHRvTG9hZCkge1xuICAgIGxldCBsb2FkZWQgPSBsb2FkZWRQYWNrYWdlc1twa2ddO1xuICAgIGlmIChsb2FkZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gSWYgdXJpIGlzIGZyb20gdGhlIERFRkFVTFRfQ0hBTk5FTCwgd2UgYXNzdW1lIGl0IHdhcyBhZGRlZCBhcyBhXG4gICAgICAvLyBkZXBlZGVuY3ksIHdoaWNoIHdhcyBwcmV2aW91c2x5IG92ZXJyaWRkZW4uXG4gICAgICBpZiAobG9hZGVkID09PSB1cmkgfHwgdXJpID09PSBERUZBVUxUX0NIQU5ORUwpIHtcbiAgICAgICAgbWVzc2FnZUNhbGxiYWNrKGAke3BrZ30gYWxyZWFkeSBsb2FkZWQgZnJvbSAke2xvYWRlZH1gKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvckNhbGxiYWNrKFxuICAgICAgICAgIGBVUkkgbWlzbWF0Y2gsIGF0dGVtcHRpbmcgdG8gbG9hZCBwYWNrYWdlICR7cGtnfSBmcm9tICR7dXJpfSBgICtcbiAgICAgICAgICAgIGB3aGlsZSBpdCBpcyBhbHJlYWR5IGxvYWRlZCBmcm9tICR7bG9hZGVkfS4gVG8gb3ZlcnJpZGUgYSBkZXBlbmRlbmN5LCBgICtcbiAgICAgICAgICAgIGBsb2FkIHRoZSBjdXN0b20gcGFja2FnZSBmaXJzdC5gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgcGtnbmFtZSA9IChNb2R1bGUucGFja2FnZXNbcGtnXSAmJiBNb2R1bGUucGFja2FnZXNbcGtnXS5uYW1lKSB8fCBwa2c7XG4gICAgbGV0IHNjcmlwdFNyYyA9IHVyaSA9PT0gREVGQVVMVF9DSEFOTkVMID8gYCR7YmFzZVVSTH0ke3BrZ25hbWV9LmpzYCA6IHVyaTtcbiAgICBtZXNzYWdlQ2FsbGJhY2soYExvYWRpbmcgJHtwa2d9IGZyb20gJHtzY3JpcHRTcmN9YCk7XG4gICAgc2NyaXB0UHJvbWlzZXMucHVzaChcbiAgICAgIGxvYWRTY3JpcHQoc2NyaXB0U3JjKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBlcnJvckNhbGxiYWNrKGBDb3VsZG4ndCBsb2FkIHBhY2thZ2UgZnJvbSBVUkwgJHtzY3JpcHRTcmN9YCwgZSk7XG4gICAgICAgIHRvTG9hZC5kZWxldGUocGtnKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8vIFdlIG11c3Qgc3RhcnQgd2FpdGluZyBmb3IgcnVuRGVwZW5kZW5jaWVzICphZnRlciogYWxsIHRoZSBKUyBmaWxlcyBhcmVcbiAgLy8gbG9hZGVkLCBzaW5jZSB0aGUgbnVtYmVyIG9mIHJ1bkRlcGVuZGVuY2llcyBtYXkgaGFwcGVuIHRvIGVxdWFsIHplcm9cbiAgLy8gYmV0d2VlbiBwYWNrYWdlIGZpbGVzIGxvYWRpbmcuXG4gIHRyeSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoc2NyaXB0UHJvbWlzZXMpLnRoZW4od2FpdFJ1bkRlcGVuZGVuY3kpO1xuICB9IGZpbmFsbHkge1xuICAgIGRlbGV0ZSBNb2R1bGUubW9uaXRvclJ1bkRlcGVuZGVuY2llcztcbiAgfVxuXG4gIGxldCBwYWNrYWdlTGlzdCA9IFtdO1xuICBmb3IgKGxldCBbcGtnLCB1cmldIG9mIHRvTG9hZCkge1xuICAgIGxvYWRlZFBhY2thZ2VzW3BrZ10gPSB1cmk7XG4gICAgcGFja2FnZUxpc3QucHVzaChwa2cpO1xuICB9XG5cbiAgbGV0IHJlc29sdmVNc2c7XG4gIGlmIChwYWNrYWdlTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgbGV0IHBhY2thZ2VOYW1lcyA9IHBhY2thZ2VMaXN0LmpvaW4oXCIsIFwiKTtcbiAgICByZXNvbHZlTXNnID0gYExvYWRlZCAke3BhY2thZ2VOYW1lc31gO1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmVNc2cgPSBcIk5vIHBhY2thZ2VzIGxvYWRlZFwiO1xuICB9XG5cbiAgTW9kdWxlLnJlcG9ydFVuZGVmaW5lZFN5bWJvbHMoKTtcblxuICBtZXNzYWdlQ2FsbGJhY2socmVzb2x2ZU1zZyk7XG5cbiAgLy8gV2UgaGF2ZSB0byBpbnZhbGlkYXRlIFB5dGhvbidzIGltcG9ydCBjYWNoZXMsIG9yIGl0IHdvbid0XG4gIC8vIHNlZSB0aGUgbmV3IGZpbGVzLlxuICBNb2R1bGUuaW1wb3J0bGliLmludmFsaWRhdGVfY2FjaGVzKCk7XG59XG5cbi8vIFRoaXMgaXMgYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgaWZmIHRoZXJlIGFyZSBubyBwZW5kaW5nIHBhY2thZ2UgbG9hZHMuIEl0XG4vLyBuZXZlciBmYWlscy5cbmxldCBfcGFja2FnZV9sb2NrID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbi8qKlxuICogQW4gYXN5bmMgbG9jayBmb3IgcGFja2FnZSBsb2FkaW5nLiBQcmV2ZW50cyByYWNlIGNvbmRpdGlvbnMgaW4gbG9hZFBhY2thZ2UuXG4gKiBAcmV0dXJucyBBIHplcm8gYXJndW1lbnQgZnVuY3Rpb24gdGhhdCByZWxlYXNlcyB0aGUgbG9jay5cbiAqIEBwcml2YXRlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFjcXVpcmVQYWNrYWdlTG9jaygpIHtcbiAgbGV0IG9sZF9sb2NrID0gX3BhY2thZ2VfbG9jaztcbiAgbGV0IHJlbGVhc2VMb2NrO1xuICBfcGFja2FnZV9sb2NrID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IChyZWxlYXNlTG9jayA9IHJlc29sdmUpKTtcbiAgYXdhaXQgb2xkX2xvY2s7XG4gIHJldHVybiByZWxlYXNlTG9jaztcbn1cblxuLyoqXG4gKlxuICogVGhlIGxpc3Qgb2YgcGFja2FnZXMgdGhhdCBQeW9kaWRlIGhhcyBsb2FkZWQuXG4gKiBVc2UgYGBPYmplY3Qua2V5cyhweW9kaWRlLmxvYWRlZFBhY2thZ2VzKWBgIHRvIGdldCB0aGUgbGlzdCBvZiBuYW1lcyBvZlxuICogbG9hZGVkIHBhY2thZ2VzLCBhbmQgYGBweW9kaWRlLmxvYWRlZFBhY2thZ2VzW3BhY2thZ2VfbmFtZV1gYCB0byBhY2Nlc3NcbiAqIGluc3RhbGwgbG9jYXRpb24gZm9yIGEgcGFydGljdWxhciBgYHBhY2thZ2VfbmFtZWBgLlxuICpcbiAqIEB0eXBlIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBsZXQgbG9hZGVkUGFja2FnZXMgPSB7fTtcblxubGV0IHNoYXJlZExpYnJhcnlXYXNtUGx1Z2luO1xubGV0IG9yaWdXYXNtUGx1Z2luO1xubGV0IHdhc21QbHVnaW5JbmRleDtcbmZ1bmN0aW9uIGluaXRTaGFyZWRMaWJyYXJ5V2FzbVBsdWdpbigpIHtcbiAgZm9yIChsZXQgcCBpbiBNb2R1bGUucHJlbG9hZFBsdWdpbnMpIHtcbiAgICBpZiAoTW9kdWxlLnByZWxvYWRQbHVnaW5zW3BdLmNhbkhhbmRsZShcInRlc3Quc29cIikpIHtcbiAgICAgIG9yaWdXYXNtUGx1Z2luID0gTW9kdWxlLnByZWxvYWRQbHVnaW5zW3BdO1xuICAgICAgd2FzbVBsdWdpbkluZGV4ID0gcDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzaGFyZWRMaWJyYXJ5V2FzbVBsdWdpbiA9IHtcbiAgICBjYW5IYW5kbGU6IG9yaWdXYXNtUGx1Z2luLmNhbkhhbmRsZSxcbiAgICBoYW5kbGUoYnl0ZUFycmF5LCBuYW1lLCBvbmxvYWQsIG9uZXJyb3IpIHtcbiAgICAgIG9yaWdXYXNtUGx1Z2luLmhhbmRsZShieXRlQXJyYXksIG5hbWUsIG9ubG9hZCwgb25lcnJvcik7XG4gICAgICBvcmlnV2FzbVBsdWdpbi5hc3luY1dhc21Mb2FkUHJvbWlzZSA9IChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IG9yaWdXYXNtUGx1Z2luLmFzeW5jV2FzbUxvYWRQcm9taXNlO1xuICAgICAgICBNb2R1bGUubG9hZER5bmFtaWNMaWJyYXJ5KG5hbWUsIHtcbiAgICAgICAgICBnbG9iYWw6IHRydWUsXG4gICAgICAgICAgbm9kZWxldGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSkoKTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyBvdmVycmlkZSB0aGUgbG9hZCBwbHVnaW4gc28gdGhhdCBpdCBjYWxscyBcIk1vZHVsZS5sb2FkRHluYW1pY0xpYnJhcnlcIiBvbiBhbnlcbi8vIC5zbyBmaWxlcy5cbi8vIHRoaXMgb25seSBuZWVkcyB0byBiZSBkb25lIGZvciBzaGFyZWQgbGlicmFyeSBwYWNrYWdlcyBiZWNhdXNlIHdlIGFzc3VtZSB0aGF0XG4vLyBpZiBhIHBhY2thZ2UgZGVwZW5kcyBvbiBhIHNoYXJlZCBsaWJyYXJ5IGl0IG5lZWRzIHRvIGhhdmUgYWNjZXNzIHRvIGl0LiBub3Rcbi8vIG5lZWRlZCBmb3IgLnNvIGluIHN0YW5kYXJkIG1vZHVsZSBiZWNhdXNlIHRob3NlIGFyZSBsaW5rZWQgdG9nZXRoZXJcbi8vIGNvcnJlY3RseSwgaXQgaXMgb25seSB3aGVyZSBsaW5raW5nIGdvZXMgYWNyb3NzIG1vZHVsZXMgdGhhdCBpdCBuZWVkcyB0byBiZVxuLy8gZG9uZS4gSGVuY2UsIHdlIG9ubHkgcHV0IHRoaXMgZXh0cmEgcHJlbG9hZCBwbHVnaW4gaW4gZHVyaW5nIHRoZSBzaGFyZWRcbi8vIGxpYnJhcnkgbG9hZFxuZnVuY3Rpb24gdXNlU2hhcmVkTGlicmFyeVdhc21QbHVnaW4oKSB7XG4gIGlmICghc2hhcmVkTGlicmFyeVdhc21QbHVnaW4pIHtcbiAgICBpbml0U2hhcmVkTGlicmFyeVdhc21QbHVnaW4oKTtcbiAgfVxuICBNb2R1bGUucHJlbG9hZFBsdWdpbnNbd2FzbVBsdWdpbkluZGV4XSA9IHNoYXJlZExpYnJhcnlXYXNtUGx1Z2luO1xufVxuXG5mdW5jdGlvbiByZXN0b3JlT3JpZ1dhc21QbHVnaW4oKSB7XG4gIE1vZHVsZS5wcmVsb2FkUGx1Z2luc1t3YXNtUGx1Z2luSW5kZXhdID0gb3JpZ1dhc21QbHVnaW47XG59XG5cbi8qKlxuICogQGNhbGxiYWNrIExvZ0ZuXG4gKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBMb2FkIGEgcGFja2FnZSBvciBhIGxpc3Qgb2YgcGFja2FnZXMgb3ZlciB0aGUgbmV0d29yay4gVGhpcyBpbnN0YWxscyB0aGVcbiAqIHBhY2thZ2UgaW4gdGhlIHZpcnR1YWwgZmlsZXN5c3RlbS4gVGhlIHBhY2thZ2UgbmVlZHMgdG8gYmUgaW1wb3J0ZWQgZnJvbVxuICogUHl0aG9uIGJlZm9yZSBpdCBjYW4gYmUgdXNlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IHN0cmluZ1tdIHwgUHlQcm94eX0gbmFtZXMgRWl0aGVyIGEgc2luZ2xlIHBhY2thZ2UgbmFtZSBvclxuICogVVJMIG9yIGEgbGlzdCBvZiB0aGVtLiBVUkxzIGNhbiBiZSBhYnNvbHV0ZSBvciByZWxhdGl2ZS4gVGhlIFVSTHMgbXVzdCBoYXZlXG4gKiBmaWxlIG5hbWUgYGA8cGFja2FnZS1uYW1lPi5qc2BgIGFuZCB0aGVyZSBtdXN0IGJlIGEgZmlsZSBjYWxsZWRcbiAqIGBgPHBhY2thZ2UtbmFtZT4uZGF0YWBgIGluIHRoZSBzYW1lIGRpcmVjdG9yeS4gVGhlIGFyZ3VtZW50IGNhbiBiZSBhXG4gKiBgYFB5UHJveHlgYCBvZiBhIGxpc3QsIGluIHdoaWNoIGNhc2UgdGhlIGxpc3Qgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gSmF2YVNjcmlwdFxuICogYW5kIHRoZSBgYFB5UHJveHlgYCB3aWxsIGJlIGRlc3Ryb3llZC5cbiAqIEBwYXJhbSB7TG9nRm49fSBtZXNzYWdlQ2FsbGJhY2sgQSBjYWxsYmFjaywgY2FsbGVkIHdpdGggcHJvZ3Jlc3MgbWVzc2FnZXNcbiAqICAgIChvcHRpb25hbClcbiAqIEBwYXJhbSB7TG9nRm49fSBlcnJvckNhbGxiYWNrIEEgY2FsbGJhY2ssIGNhbGxlZCB3aXRoIGVycm9yL3dhcm5pbmcgbWVzc2FnZXNcbiAqICAgIChvcHRpb25hbClcbiAqIEBhc3luY1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFBhY2thZ2UobmFtZXMsIG1lc3NhZ2VDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICBpZiAoTW9kdWxlLmlzUHlQcm94eShuYW1lcykpIHtcbiAgICBsZXQgdGVtcDtcbiAgICB0cnkge1xuICAgICAgdGVtcCA9IG5hbWVzLnRvSnMoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgbmFtZXMuZGVzdHJveSgpO1xuICAgIH1cbiAgICBuYW1lcyA9IHRlbXA7XG4gIH1cblxuICBpZiAoIUFycmF5LmlzQXJyYXkobmFtZXMpKSB7XG4gICAgbmFtZXMgPSBbbmFtZXNdO1xuICB9XG4gIC8vIGdldCBzaGFyZWQgbGlicmFyeSBwYWNrYWdlcyBhbmQgbG9hZCB0aG9zZSBmaXJzdFxuICAvLyBvdGhlcndpc2UgYmFkIHRoaW5ncyBoYXBwZW4gd2l0aCBsaW5raW5nIHRoZW0gaW4gZmlyZWZveC5cbiAgbGV0IHNoYXJlZExpYnJhcnlOYW1lcyA9IFtdO1xuICB0cnkge1xuICAgIGxldCBzaGFyZWRMaWJyYXJ5UGFja2FnZXNUb0xvYWQgPSByZWN1cnNpdmVEZXBlbmRlbmNpZXMoXG4gICAgICBuYW1lcyxcbiAgICAgIG1lc3NhZ2VDYWxsYmFjayxcbiAgICAgIGVycm9yQ2FsbGJhY2ssXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBmb3IgKGxldCBwa2cgb2Ygc2hhcmVkTGlicmFyeVBhY2thZ2VzVG9Mb2FkKSB7XG4gICAgICBzaGFyZWRMaWJyYXJ5TmFtZXMucHVzaChwa2dbMF0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGRvIG5vdGhpbmcgLSBsZXQgdGhlIG1haW4gbG9hZCB0aHJvdyBhbnkgZXJyb3JzXG4gIH1cblxuICBsZXQgcmVsZWFzZUxvY2sgPSBhd2FpdCBhY3F1aXJlUGFja2FnZUxvY2soKTtcbiAgdHJ5IHtcbiAgICB1c2VTaGFyZWRMaWJyYXJ5V2FzbVBsdWdpbigpO1xuICAgIGF3YWl0IF9sb2FkUGFja2FnZShcbiAgICAgIHNoYXJlZExpYnJhcnlOYW1lcyxcbiAgICAgIG1lc3NhZ2VDYWxsYmFjayB8fCBjb25zb2xlLmxvZyxcbiAgICAgIGVycm9yQ2FsbGJhY2sgfHwgY29uc29sZS5lcnJvclxuICAgICk7XG4gICAgcmVzdG9yZU9yaWdXYXNtUGx1Z2luKCk7XG4gICAgYXdhaXQgX2xvYWRQYWNrYWdlKFxuICAgICAgbmFtZXMsXG4gICAgICBtZXNzYWdlQ2FsbGJhY2sgfHwgY29uc29sZS5sb2csXG4gICAgICBlcnJvckNhbGxiYWNrIHx8IGNvbnNvbGUuZXJyb3JcbiAgICApO1xuICB9IGZpbmFsbHkge1xuICAgIHJlc3RvcmVPcmlnV2FzbVBsdWdpbigpO1xuICAgIHJlbGVhc2VMb2NrKCk7XG4gIH1cbn1cbiIsICIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IGFwcGx5aW5nIHRoZSBDIHByZXByb2Nlc3NvciB0byBjb3JlL3B5cHJveHkuanNcbi8vIEl0IHVzZXMgdGhlIG1hY3JvcyBkZWZpbmVkIGluIGNvcmUvcHlwcm94eS5jXG4vLyBEbyBub3QgZWRpdCBpdCBkaXJlY3RseSFcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8qKlxuICogRXZlcnkgcHVibGljIFB5dGhvbiBlbnRyeXBvaW50IGdvZXMgdGhyb3VnaCB0aGlzIGZpbGUhIFRoZSBtYWluIGVudHJ5cG9pbnQgaXNcbiAqIHRoZSBjYWxsUHlPYmplY3QgbWV0aG9kLCBidXQgb2YgY291cnNlIG9uZSBjYW4gYWxzbyBleGVjdXRlIGFyYml0cmFyeSBjb2RlXG4gKiB2aWEgdGhlIHZhcmlvdXMgX19kdW5kZXJtZXRob2RzX18gYXNzb2NpYXRlZCB0byBjbGFzc2VzLlxuICpcbiAqIEFueSB0aW1lIHdlIGNhbGwgaW50byB3YXNtLCB0aGUgY2FsbCBzaG91bGQgYmUgd3JhcHBlZCBpbiBhIHRyeSBjYXRjaCBibG9jay5cbiAqIFRoaXMgd2F5IGlmIGEgSmF2YVNjcmlwdCBlcnJvciBlbWVyZ2VzIGZyb20gdGhlIHdhc20sIHdlIGNhbiBlc2NhbGF0ZSBpdCB0byBhXG4gKiBmYXRhbCBlcnJvci5cbiAqXG4gKiBUaGlzIGlzIGZpbGUgaXMgcHJlcHJvY2Vzc2VkIHdpdGggLWltYWNyb3MgXCJweXByb3h5LmNcIi4gQXMgYSByZXN1bHQgb2YgdGhpcyxcbiAqIGFueSBtYWNyb3MgYXZhaWxhYmxlIGluIHB5cHJveHkuYyBhcmUgYXZhaWxhYmxlIGhlcmUuIFdlIG9ubHkgbmVlZCB0aGUgZmxhZ3NcbiAqIG1hY3JvcyBIQVNfTEVOR1RILCBldGMuXG4gKlxuICogU2VlIE1ha2VmaWxlIHJlY2lwZSBmb3Igc3JjL2pzL3B5cHJveHkuanNcbiAqL1xuXG5pbXBvcnQgeyBNb2R1bGUgfSBmcm9tIFwiLi9tb2R1bGUuanNcIjtcblxuLyoqXG4gKiBJcyB0aGUgYXJndW1lbnQgYSA6YW55OmBQeVByb3h5YD9cbiAqIEBwYXJhbSBqc29iaiB7YW55fSBPYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm5zIHtqc29iaiBpcyBQeVByb3h5fSBJcyBgYGpzb2JqYGAgYSA6YW55OmBQeVByb3h5YD9cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHlQcm94eShqc29iaikge1xuICByZXR1cm4gISFqc29iaiAmJiBqc29iai4kJCAhPT0gdW5kZWZpbmVkICYmIGpzb2JqLiQkLnR5cGUgPT09IFwiUHlQcm94eVwiO1xufVxuTW9kdWxlLmlzUHlQcm94eSA9IGlzUHlQcm94eTtcblxuaWYgKGdsb2JhbFRoaXMuRmluYWxpemF0aW9uUmVnaXN0cnkpIHtcbiAgTW9kdWxlLmZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChbcHRyLCBjYWNoZV0pID0+IHtcbiAgICBjYWNoZS5sZWFrZWQgPSAoISExKTtcbiAgICBweXByb3h5X2RlY3JlZl9jYWNoZShjYWNoZSk7XG4gICAgdHJ5IHtcbiAgICAgIE1vZHVsZS5fUHlfRGVjUmVmKHB0cik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gSSdtIG5vdCByZWFsbHkgc3VyZSB3aGF0IGhhcHBlbnMgaWYgYW4gZXJyb3Igb2NjdXJzIGluc2lkZSBvZiBhXG4gICAgICAvLyBmaW5hbGl6ZXIuLi5cbiAgICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgICB9XG4gIH0pO1xuICAvLyBGb3Igc29tZSB1bmNsZWFyIHJlYXNvbiB0aGlzIGNvZGUgc2NyZXdzIHVwIHNlbGVuaXVtIEZpcmVmb3hEcml2ZXIuIFdvcmtzXG4gIC8vIGZpbmUgaW4gY2hyb21lIGFuZCB3aGVuIEkgdGVzdCBpdCBpbiBicm93c2VyLiBJdCBzZWVtcyB0byBiZSBzZW5zaXRpdmUgdG9cbiAgLy8gY2hhbmdlcyB0aGF0IGRvbid0IG1ha2UgYSBkaWZmZXJlbmNlIHRvIHRoZSBzZW1hbnRpY3MuXG4gIC8vIFRPRE86IGFmdGVyIDAuMTguMCwgZml4IHNlbGVuaXVtIGlzc3VlcyB3aXRoIHRoaXMgY29kZS5cbiAgLy8gTW9kdWxlLmJ1ZmZlckZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChwdHIpID0+IHtcbiAgLy8gICB0cnkge1xuICAvLyAgICAgTW9kdWxlLl9QeUJ1ZmZlcl9SZWxlYXNlKHB0cik7XG4gIC8vICAgICBNb2R1bGUuX1B5TWVtX0ZyZWUocHRyKTtcbiAgLy8gICB9IGNhdGNoIChlKSB7XG4gIC8vICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gIC8vICAgfVxuICAvLyB9KTtcbn0gZWxzZSB7XG4gIE1vZHVsZS5maW5hbGl6YXRpb25SZWdpc3RyeSA9IHsgcmVnaXN0ZXIoKSB7fSwgdW5yZWdpc3RlcigpIHt9IH07XG4gIC8vIE1vZHVsZS5idWZmZXJGaW5hbGl6YXRpb25SZWdpc3RyeSA9IGZpbmFsaXphdGlvblJlZ2lzdHJ5O1xufVxuXG5sZXQgcHlwcm94eV9hbGxvY19tYXAgPSBuZXcgTWFwKCk7XG5Nb2R1bGUucHlwcm94eV9hbGxvY19tYXAgPSBweXByb3h5X2FsbG9jX21hcDtcbmxldCB0cmFjZV9weXByb3h5X2FsbG9jO1xubGV0IHRyYWNlX3B5cHJveHlfZGVhbGxvYztcblxuTW9kdWxlLmVuYWJsZV9weXByb3h5X2FsbG9jYXRpb25fdHJhY2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgdHJhY2VfcHlwcm94eV9hbGxvYyA9IGZ1bmN0aW9uIChwcm94eSkge1xuICAgIHB5cHJveHlfYWxsb2NfbWFwLnNldChwcm94eSwgRXJyb3IoKS5zdGFjayk7XG4gIH07XG4gIHRyYWNlX3B5cHJveHlfZGVhbGxvYyA9IGZ1bmN0aW9uIChwcm94eSkge1xuICAgIHB5cHJveHlfYWxsb2NfbWFwLmRlbGV0ZShwcm94eSk7XG4gIH07XG59O1xuTW9kdWxlLmRpc2FibGVfcHlwcm94eV9hbGxvY2F0aW9uX3RyYWNpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHRyYWNlX3B5cHJveHlfYWxsb2MgPSBmdW5jdGlvbiAocHJveHkpIHt9O1xuICB0cmFjZV9weXByb3h5X2RlYWxsb2MgPSBmdW5jdGlvbiAocHJveHkpIHt9O1xufTtcbk1vZHVsZS5kaXNhYmxlX3B5cHJveHlfYWxsb2NhdGlvbl90cmFjaW5nKCk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IFB5UHJveHkgd3JhcGluZyBwdHJvYmogd2hpY2ggaXMgYSBQeU9iamVjdCouXG4gKlxuICogVGhlIGFyZ3VtZW50IGNhY2hlIGlzIG9ubHkgbmVlZGVkIHRvIGltcGxlbWVudCB0aGUgUHlQcm94eS5jb3B5IEFQSSwgaXRcbiAqIGFsbG93cyB0aGUgY29weSBvZiB0aGUgUHlQcm94eSB0byBzaGFyZSBpdHMgYXR0cmlidXRlIGNhY2hlIHdpdGggdGhlIG9yaWdpbmFsXG4gKiB2ZXJzaW9uLiBJbiBhbGwgb3RoZXIgY2FzZXMsIHB5cHJveHlfbmV3IHNob3VsZCBiZSBjYWxsZWQgd2l0aCBvbmUgYXJndW1lbnQuXG4gKlxuICogSW4gdGhlIGNhc2UgdGhhdCB0aGUgUHl0aG9uIG9iamVjdCBpcyBjYWxsYWJsZSwgUHlQcm94eUNsYXNzIGluaGVyaXRzIGZyb21cbiAqIEZ1bmN0aW9uIHNvIHRoYXQgUHlQcm94eSBvYmplY3RzIGNhbiBiZSBjYWxsYWJsZS4gSW4gdGhhdCBjYXNlIHdlIE1VU1QgZXhwb3NlXG4gKiBjZXJ0YWluIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gRnVuY3Rpb24sIGJ1dCB3ZSBkbyBvdXIgYmVzdCB0byByZW1vdmUgYXNcbiAqIG1hbnkgYXMgcG9zc2libGUuXG4gKiBAcHJpdmF0ZVxuICovXG5Nb2R1bGUucHlwcm94eV9uZXcgPSBmdW5jdGlvbiAocHRyb2JqLCBjYWNoZSkge1xuICBsZXQgZmxhZ3MgPSBNb2R1bGUuX3B5cHJveHlfZ2V0ZmxhZ3MocHRyb2JqKTtcbiAgbGV0IGNscyA9IE1vZHVsZS5nZXRQeVByb3h5Q2xhc3MoZmxhZ3MpO1xuICAvLyBSZWZsZWN0LmNvbnN0cnVjdCBjYWxscyB0aGUgY29uc3RydWN0b3Igb2YgTW9kdWxlLlB5UHJveHlDbGFzcyBidXQgc2V0c1xuICAvLyB0aGUgcHJvdG90eXBlIGFzIGNscy5wcm90b3R5cGUuIFRoaXMgZ2l2ZXMgdXMgYSB3YXkgdG8gZHluYW1pY2FsbHkgY3JlYXRlXG4gIC8vIHN1YmNsYXNzZXMgb2YgUHlQcm94eUNsYXNzIChhcyBsb25nIGFzIHdlIGRvbid0IG5lZWQgdG8gdXNlIHRoZSBcIm5ld1xuICAvLyBjbHMocHRyb2JqKVwiIHN5bnRheCkuXG4gIGxldCB0YXJnZXQ7XG4gIGlmIChmbGFncyAmICgxIDw8IDgpKSB7XG4gICAgLy8gVG8gbWFrZSBhIGNhbGxhYmxlIHByb3h5LCB3ZSBtdXN0IGNhbGwgdGhlIEZ1bmN0aW9uIGNvbnN0cnVjdG9yLlxuICAgIC8vIEluIHRoaXMgY2FzZSB3ZSBhcmUgZWZmZWN0aXZlbHkgc3ViY2xhc3NpbmcgRnVuY3Rpb24uXG4gICAgdGFyZ2V0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoRnVuY3Rpb24sIFtdLCBjbHMpO1xuICAgIC8vIFJlbW92ZSB1bmRlc2lyYWJsZSBwcm9wZXJ0aWVzIGFkZGVkIGJ5IEZ1bmN0aW9uIGNvbnN0cnVjdG9yLiBOb3RlOiB3ZVxuICAgIC8vIGNhbid0IHJlbW92ZSBcImFyZ3VtZW50c1wiIG9yIFwiY2FsbGVyXCIgYmVjYXVzZSB0aGV5IGFyZSBub3QgY29uZmlndXJhYmxlXG4gICAgLy8gYW5kIG5vdCB3cml0YWJsZVxuICAgIGRlbGV0ZSB0YXJnZXQubGVuZ3RoO1xuICAgIGRlbGV0ZSB0YXJnZXQubmFtZTtcbiAgICAvLyBwcm90b3R5cGUgaXNuJ3QgY29uZmlndXJhYmxlIHNvIHdlIGNhbid0IGRlbGV0ZSBpdCBidXQgaXQncyB3cml0YWJsZS5cbiAgICB0YXJnZXQucHJvdG90eXBlID0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IE9iamVjdC5jcmVhdGUoY2xzLnByb3RvdHlwZSk7XG4gIH1cbiAgaWYgKCFjYWNoZSkge1xuICAgIC8vIFRoZSBjYWNoZSBuZWVkcyB0byBiZSBhY2Nlc3NlZCBwcmltYXJpbHkgZnJvbSB0aGUgQyBmdW5jdGlvblxuICAgIC8vIF9weXByb3h5X2dldGF0dHIgc28gd2UgbWFrZSBhIGhpd2lyZSBpZC5cbiAgICBsZXQgY2FjaGVJZCA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKG5ldyBNYXAoKSk7XG4gICAgY2FjaGUgPSB7IGNhY2hlSWQsIHJlZmNudDogMCB9O1xuICB9XG4gIGNhY2hlLnJlZmNudCsrO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBcIiQkXCIsIHtcbiAgICB2YWx1ZTogeyBwdHI6IHB0cm9iaiwgdHlwZTogXCJQeVByb3h5XCIsIGNhY2hlIH0sXG4gIH0pO1xuICBNb2R1bGUuX1B5X0luY1JlZihwdHJvYmopO1xuICBsZXQgcHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCBQeVByb3h5SGFuZGxlcnMpO1xuICB0cmFjZV9weXByb3h5X2FsbG9jKHByb3h5KTtcbiAgTW9kdWxlLmZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHByb3h5LCBbcHRyb2JqLCBjYWNoZV0sIHByb3h5KTtcbiAgcmV0dXJuIHByb3h5O1xufTtcblxuZnVuY3Rpb24gX2dldFB0cihqc29iaikge1xuICBsZXQgcHRyID0ganNvYmouJCQucHRyO1xuICBpZiAocHRyID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAganNvYmouJCQuZGVzdHJveWVkX21zZyB8fCBcIk9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZFwiXG4gICAgKTtcbiAgfVxuICByZXR1cm4gcHRyO1xufVxuXG5sZXQgcHlwcm94eUNsYXNzTWFwID0gbmV3IE1hcCgpO1xuLyoqXG4gKiBSZXRyZWl2ZSB0aGUgYXBwcm9wcmlhdGUgbWl4aW5zIGJhc2VkIG9uIHRoZSBmZWF0dXJlcyByZXF1ZXN0ZWQgaW4gZmxhZ3MuXG4gKiBVc2VkIGJ5IHB5cHJveHlfbmV3LiBUaGUgXCJmbGFnc1wiIHZhcmlhYmxlIGlzIHByb2R1Y2VkIGJ5IHRoZSBDIGZ1bmN0aW9uXG4gKiBweXByb3h5X2dldGZsYWdzLiBNdWx0aXBsZSBQeVByb3hpZXMgd2l0aCB0aGUgc2FtZSBzZXQgb2YgZmVhdHVyZSBmbGFnc1xuICogd2lsbCBzaGFyZSB0aGUgc2FtZSBwcm90b3R5cGUsIHNvIHRoZSBtZW1vcnkgZm9vdHByaW50IG9mIGVhY2ggaW5kaXZpZHVhbFxuICogUHlQcm94eSBpcyBtaW5pbWFsLlxuICogQHByaXZhdGVcbiAqL1xuTW9kdWxlLmdldFB5UHJveHlDbGFzcyA9IGZ1bmN0aW9uIChmbGFncykge1xuICBsZXQgcmVzdWx0ID0gcHlwcm94eUNsYXNzTWFwLmdldChmbGFncyk7XG4gIGlmIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGxldCBkZXNjcmlwdG9ycyA9IHt9O1xuICBmb3IgKGxldCBbZmVhdHVyZV9mbGFnLCBtZXRob2RzXSBvZiBbXG4gICAgWygxIDw8IDApLCBQeVByb3h5TGVuZ3RoTWV0aG9kc10sXG4gICAgWygxIDw8IDEpLCBQeVByb3h5R2V0SXRlbU1ldGhvZHNdLFxuICAgIFsoMSA8PCAyKSwgUHlQcm94eVNldEl0ZW1NZXRob2RzXSxcbiAgICBbKDEgPDwgMyksIFB5UHJveHlDb250YWluc01ldGhvZHNdLFxuICAgIFsoMSA8PCA0KSwgUHlQcm94eUl0ZXJhYmxlTWV0aG9kc10sXG4gICAgWygxIDw8IDUpLCBQeVByb3h5SXRlcmF0b3JNZXRob2RzXSxcbiAgICBbKDEgPDwgNiksIFB5UHJveHlBd2FpdGFibGVNZXRob2RzXSxcbiAgICBbKDEgPDwgNyksIFB5UHJveHlCdWZmZXJNZXRob2RzXSxcbiAgICBbKDEgPDwgOCksIFB5UHJveHlDYWxsYWJsZU1ldGhvZHNdLFxuICBdKSB7XG4gICAgaWYgKGZsYWdzICYgZmVhdHVyZV9mbGFnKSB7XG4gICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICBkZXNjcmlwdG9ycyxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobWV0aG9kcy5wcm90b3R5cGUpXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvLyBVc2UgYmFzZSBjb25zdHJ1Y3RvciAoanVzdCB0aHJvd3MgYW4gZXJyb3IgaWYgY29uc3RydWN0aW9uIGlzIGF0dGVtcHRlZCkuXG4gIGRlc2NyaXB0b3JzLmNvbnN0cnVjdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICBQeVByb3h5Q2xhc3MucHJvdG90eXBlLFxuICAgIFwiY29uc3RydWN0b3JcIlxuICApO1xuICBPYmplY3QuYXNzaWduKFxuICAgIGRlc2NyaXB0b3JzLFxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHsgJCRmbGFnczogZmxhZ3MgfSlcbiAgKTtcbiAgbGV0IG5ld19wcm90byA9IE9iamVjdC5jcmVhdGUoUHlQcm94eUNsYXNzLnByb3RvdHlwZSwgZGVzY3JpcHRvcnMpO1xuICBmdW5jdGlvbiBOZXdQeVByb3h5Q2xhc3MoKSB7fVxuICBOZXdQeVByb3h5Q2xhc3MucHJvdG90eXBlID0gbmV3X3Byb3RvO1xuICBweXByb3h5Q2xhc3NNYXAuc2V0KGZsYWdzLCBOZXdQeVByb3h5Q2xhc3MpO1xuICByZXR1cm4gTmV3UHlQcm94eUNsYXNzO1xufTtcblxuLy8gU3RhdGljIG1ldGhvZHNcbk1vZHVsZS5QeVByb3h5X2dldFB0ciA9IF9nZXRQdHI7XG5cbmNvbnN0IHB5cHJveHlfY2FjaGVfZGVzdHJveWVkX21zZyA9XG4gIFwiVGhpcyBib3Jyb3dlZCBhdHRyaWJ1dGUgcHJveHkgd2FzIGF1dG9tYXRpY2FsbHkgZGVzdHJveWVkIGluIHRoZSBcIiArXG4gIFwicHJvY2VzcyBvZiBkZXN0cm95aW5nIHRoZSBwcm94eSBpdCB3YXMgYm9ycm93ZWQgZnJvbS4gVHJ5IHVzaW5nIHRoZSAnY29weScgbWV0aG9kLlwiO1xuXG5mdW5jdGlvbiBweXByb3h5X2RlY3JlZl9jYWNoZShjYWNoZSkge1xuICBpZiAoIWNhY2hlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNhY2hlLnJlZmNudC0tO1xuICBpZiAoY2FjaGUucmVmY250ID09PSAwKSB7XG4gICAgbGV0IGNhY2hlX21hcCA9IE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGNhY2hlLmNhY2hlSWQpO1xuICAgIGZvciAobGV0IHByb3h5X2lkIG9mIGNhY2hlX21hcC52YWx1ZXMoKSkge1xuICAgICAgY29uc3QgY2FjaGVfZW50cnkgPSBNb2R1bGUuaGl3aXJlLnBvcF92YWx1ZShwcm94eV9pZCk7XG4gICAgICBpZiAoIWNhY2hlLmxlYWtlZCkge1xuICAgICAgICBNb2R1bGUucHlwcm94eV9kZXN0cm95KGNhY2hlX2VudHJ5LCBweXByb3h5X2NhY2hlX2Rlc3Ryb3llZF9tc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5Nb2R1bGUucHlwcm94eV9kZXN0cm95ID0gZnVuY3Rpb24gKHByb3h5LCBkZXN0cm95ZWRfbXNnKSB7XG4gIGlmIChwcm94eS4kJC5wdHIgPT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHB0cm9iaiA9IF9nZXRQdHIocHJveHkpO1xuICBNb2R1bGUuZmluYWxpemF0aW9uUmVnaXN0cnkudW5yZWdpc3Rlcihwcm94eSk7XG4gIC8vIE1heWJlIHRoZSBkZXN0cnVjdG9yIHdpbGwgY2FsbCBKYXZhU2NyaXB0IGNvZGUgdGhhdCB3aWxsIHNvbWVob3cgdHJ5XG4gIC8vIHRvIHVzZSB0aGlzIHByb3h5LiBNYXJrIGl0IGRlbGV0ZWQgYmVmb3JlIGRlY3JlbWVudGluZyByZWZlcmVuY2UgY291bnRcbiAgLy8ganVzdCBpbiBjYXNlIVxuICBwcm94eS4kJC5wdHIgPSBudWxsO1xuICBwcm94eS4kJC5kZXN0cm95ZWRfbXNnID0gZGVzdHJveWVkX21zZztcbiAgcHlwcm94eV9kZWNyZWZfY2FjaGUocHJveHkuJCQuY2FjaGUpO1xuICB0cnkge1xuICAgIE1vZHVsZS5fUHlfRGVjUmVmKHB0cm9iaik7XG4gICAgdHJhY2VfcHlwcm94eV9kZWFsbG9jKHByb3h5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgfVxufTtcblxuLy8gTm93IGEgbG90IG9mIGJvaWxlcnBsYXRlIHRvIHdyYXAgdGhlIGFic3RyYWN0IE9iamVjdCBwcm90b2NvbCB3cmFwcGVyc1xuLy8gZGVmaW5lZCBpbiBweXByb3h5LmMgaW4gSmF2YVNjcmlwdCBmdW5jdGlvbnMuXG5cbk1vZHVsZS5jYWxsUHlPYmplY3RLd2FyZ3MgPSBmdW5jdGlvbiAocHRyb2JqLCAuLi5qc2FyZ3MpIHtcbiAgLy8gV2UgZG9uJ3QgZG8gYW55IGNoZWNraW5nIGZvciBrd2FyZ3MsIGNoZWNrcyBhcmUgaW4gUHlQcm94eS5jYWxsS3dhcmdzXG4gIC8vIHdoaWNoIG9ubHkgaXMgdXNlZCB3aGVuIHRoZSBrZXl3b3JkIGFyZ3VtZW50cyBjb21lIGZyb20gdGhlIHVzZXIuXG4gIGxldCBrd2FyZ3MgPSBqc2FyZ3MucG9wKCk7XG4gIGxldCBudW1fcG9zX2FyZ3MgPSBqc2FyZ3MubGVuZ3RoO1xuICBsZXQga3dhcmdzX25hbWVzID0gT2JqZWN0LmtleXMoa3dhcmdzKTtcbiAgbGV0IGt3YXJnc192YWx1ZXMgPSBPYmplY3QudmFsdWVzKGt3YXJncyk7XG4gIGxldCBudW1fa3dhcmdzID0ga3dhcmdzX25hbWVzLmxlbmd0aDtcbiAganNhcmdzLnB1c2goLi4ua3dhcmdzX3ZhbHVlcyk7XG5cbiAgbGV0IGlkYXJncyA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGpzYXJncyk7XG4gIGxldCBpZGt3bmFtZXMgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShrd2FyZ3NfbmFtZXMpO1xuICBsZXQgaWRyZXN1bHQ7XG4gIHRyeSB7XG4gICAgaWRyZXN1bHQgPSBNb2R1bGUuX19weXByb3h5X2FwcGx5KFxuICAgICAgcHRyb2JqLFxuICAgICAgaWRhcmdzLFxuICAgICAgbnVtX3Bvc19hcmdzLFxuICAgICAgaWRrd25hbWVzLFxuICAgICAgbnVtX2t3YXJnc1xuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gIH0gZmluYWxseSB7XG4gICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYoaWRhcmdzKTtcbiAgICBNb2R1bGUuaGl3aXJlLmRlY3JlZihpZGt3bmFtZXMpO1xuICB9XG4gIGlmIChpZHJlc3VsdCA9PT0gMCkge1xuICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gIH1cbiAgcmV0dXJuIE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGlkcmVzdWx0KTtcbn07XG5cbk1vZHVsZS5jYWxsUHlPYmplY3QgPSBmdW5jdGlvbiAocHRyb2JqLCAuLi5qc2FyZ3MpIHtcbiAgcmV0dXJuIE1vZHVsZS5jYWxsUHlPYmplY3RLd2FyZ3MocHRyb2JqLCAuLi5qc2FyZ3MsIHt9KTtcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgeyhQeVByb3h5Q2xhc3MgJiB7W3ggOiBzdHJpbmddIDogUHkySnNSZXN1bHR9KX0gUHlQcm94eVxuICogQHR5cGVkZWYgeyBQeVByb3h5IHwgbnVtYmVyIHwgYmlnaW50IHwgc3RyaW5nIHwgYm9vbGVhbiB8IHVuZGVmaW5lZCB9IFB5MkpzUmVzdWx0XG4gKi9cbmNsYXNzIFB5UHJveHlDbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQeVByb3h5IGlzIG5vdCBhIGNvbnN0cnVjdG9yXCIpO1xuICB9XG5cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuICAgIHJldHVybiBcIlB5UHJveHlcIjtcbiAgfVxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHR5cGUgb2YgdGhlIG9iamVjdC5cbiAgICpcbiAgICogVXN1YWxseSB0aGUgdmFsdWUgaXMgYGBcIm1vZHVsZS5uYW1lXCJgYCBidXQgZm9yIGJ1aWx0aW5zIG9yXG4gICAqIGludGVycHJldGVyLWRlZmluZWQgdHlwZXMgaXQgaXMganVzdCBgYFwibmFtZVwiYGAuIEFzIHBzZXVkb2NvZGUgdGhpcyBpczpcbiAgICpcbiAgICogLi4gY29kZS1ibG9jazo6IHB5dGhvblxuICAgKlxuICAgKiAgICB0eSA9IHR5cGUoeClcbiAgICogICAgaWYgdHkuX19tb2R1bGVfXyA9PSAnYnVpbHRpbnMnIG9yIHR5Ll9fbW9kdWxlX18gPT0gXCJfX21haW5fX1wiOlxuICAgKiAgICAgICAgcmV0dXJuIHR5Ll9fbmFtZV9fXG4gICAqICAgIGVsc2U6XG4gICAqICAgICAgICB0eS5fX21vZHVsZV9fICsgXCIuXCIgKyB0eS5fX25hbWVfX1xuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgbGV0IHB0cm9iaiA9IF9nZXRQdHIodGhpcyk7XG4gICAgcmV0dXJuIE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKE1vZHVsZS5fX3B5cHJveHlfdHlwZShwdHJvYmopKTtcbiAgfVxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCBwdHJvYmogPSBfZ2V0UHRyKHRoaXMpO1xuICAgIGxldCBqc3JlZl9yZXByO1xuICAgIHRyeSB7XG4gICAgICBqc3JlZl9yZXByID0gTW9kdWxlLl9fcHlwcm94eV9yZXByKHB0cm9iaik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgTW9kdWxlLmZhdGFsX2Vycm9yKGUpO1xuICAgIH1cbiAgICBpZiAoanNyZWZfcmVwciA9PT0gMCkge1xuICAgICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgICB9XG4gICAgcmV0dXJuIE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGpzcmVmX3JlcHIpO1xuICB9XG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBgYFB5UHJveHlgYC4gVGhpcyB3aWxsIHJlbGVhc2UgdGhlIG1lbW9yeS4gQW55IGZ1cnRoZXJcbiAgICogYXR0ZW1wdCB0byB1c2UgdGhlIG9iamVjdCB3aWxsIHJhaXNlIGFuIGVycm9yLlxuICAgKlxuICAgKiBJbiBhIGJyb3dzZXIgc3VwcG9ydGluZyBgRmluYWxpemF0aW9uUmVnaXN0cnlcbiAgICogPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0ZpbmFsaXphdGlvblJlZ2lzdHJ5PmBfXG4gICAqIFB5b2RpZGUgd2lsbCBhdXRvbWF0aWNhbGx5IGRlc3Ryb3kgdGhlIGBgUHlQcm94eWBgIHdoZW4gaXQgaXMgZ2FyYmFnZVxuICAgKiBjb2xsZWN0ZWQsIGhvd2V2ZXIgdGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgdGhlIGZpbmFsaXplciB3aWxsIGJlIHJ1blxuICAgKiBpbiBhIHRpbWVseSBtYW5uZXIgc28gaXQgaXMgYmV0dGVyIHRvIGBgZGVzdHJveWBgIHRoZSBwcm94eSBleHBsaWNpdGx5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc3Ryb3llZF9tc2ddIFRoZSBlcnJvciBtZXNzYWdlIHRvIHByaW50IGlmIHVzZSBpc1xuICAgKiAgICAgICAgYXR0ZW1wdGVkIGFmdGVyIGRlc3Ryb3lpbmcuIERlZmF1bHRzIHRvIFwiT2JqZWN0IGhhcyBhbHJlYWR5IGJlZW5cbiAgICogICAgICAgIGRlc3Ryb3llZFwiLlxuICAgKi9cbiAgZGVzdHJveShkZXN0cm95ZWRfbXNnKSB7XG4gICAgTW9kdWxlLnB5cHJveHlfZGVzdHJveSh0aGlzLCBkZXN0cm95ZWRfbXNnKTtcbiAgfVxuICAvKipcbiAgICogTWFrZSBhIG5ldyBQeVByb3h5IHBvaW50aW5nIHRvIHRoZSBzYW1lIFB5dGhvbiBvYmplY3QuXG4gICAqIFVzZWZ1bCBpZiB0aGUgUHlQcm94eSBpcyBkZXN0cm95ZWQgc29tZXdoZXJlIGVsc2UuXG4gICAqIEByZXR1cm5zIHtQeVByb3h5fVxuICAgKi9cbiAgY29weSgpIHtcbiAgICBsZXQgcHRyb2JqID0gX2dldFB0cih0aGlzKTtcbiAgICByZXR1cm4gTW9kdWxlLnB5cHJveHlfbmV3KHB0cm9iaiwgdGhpcy4kJC5jYWNoZSk7XG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBgYFB5UHJveHlgYCBpbnRvIGEgSmF2YVNjcmlwdCBvYmplY3QgYXMgYmVzdCBhcyBwb3NzaWJsZS4gQnlcbiAgICogZGVmYXVsdCBkb2VzIGEgZGVlcCBjb252ZXJzaW9uLCBpZiBhIHNoYWxsb3cgY29udmVyc2lvbiBpcyBkZXNpcmVkLCB5b3UgY2FuXG4gICAqIHVzZSBgYHByb3h5LnRvSnMoe2RlcHRoIDogMX0pYGAuIFNlZSA6cmVmOmBFeHBsaWNpdCBDb252ZXJzaW9uIG9mIFB5UHJveHlcbiAgICogPHR5cGUtdHJhbnNsYXRpb25zLXB5cHJveHktdG8tanM+YCBmb3IgbW9yZSBpbmZvLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZGVwdGhdIEhvdyBtYW55IGxheWVycyBkZWVwIHRvIHBlcmZvcm0gdGhlXG4gICAqIGNvbnZlcnNpb24uIERlZmF1bHRzIHRvIGluZmluaXRlLlxuICAgKiBAcGFyYW0ge2FycmF5fSBbb3B0aW9ucy5weXByb3hpZXNdIElmIHByb3ZpZGVkLCBgYHRvSnNgYCB3aWxsIHN0b3JlIGFsbFxuICAgKiBQeVByb3hpZXMgY3JlYXRlZCBpbiB0aGlzIGxpc3QuIFRoaXMgYWxsb3dzIHlvdSB0byBlYXNpbHkgZGVzdHJveSBhbGwgdGhlXG4gICAqIFB5UHJveGllcyBieSBpdGVyYXRpbmcgdGhlIGxpc3Qgd2l0aG91dCBoYXZpbmcgdG8gcmVjdXJzZSBvdmVyIHRoZVxuICAgKiBnZW5lcmF0ZWQgc3RydWN0dXJlLiBUaGUgbW9zdCBjb21tb24gdXNlIGNhc2UgaXMgdG8gY3JlYXRlIGEgbmV3IGVtcHR5XG4gICAqIGxpc3QsIHBhc3MgdGhlIGxpc3QgYXMgYHB5cHJveGllc2AsIGFuZCB0aGVuIGxhdGVyIGl0ZXJhdGUgb3ZlciBgcHlwcm94aWVzYFxuICAgKiB0byBkZXN0cm95IGFsbCBvZiBjcmVhdGVkIHByb3hpZXMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY3JlYXRlX3B5cHJveGllc10gSWYgZmFsc2UsIGBgdG9Kc2BgIHdpbGwgdGhyb3cgYVxuICAgKiBgYENvbnZlcnNpb25FcnJvcmBgIHJhdGhlciB0aGFuIHByb2R1Y2luZyBhIGBgUHlQcm94eWBgLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmRpY3RfY29udmVydGVyXSBBIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBhblxuICAgKiBpdGVyYWJsZSBvZiBwYWlycyBgYFtrZXksIHZhbHVlXWBgLiBDb252ZXJ0IHRoaXMgaXRlcmFibGUgb2YgcGFpcnMgdG8gdGhlXG4gICAqIGRlc2lyZWQgb3V0cHV0LiBGb3IgaW5zdGFuY2UsIGBgT2JqZWN0LmZyb21FbnRyaWVzYGAgd291bGQgY29udmVydCB0aGUgZGljdFxuICAgKiB0byBhbiBvYmplY3QsIGBgQXJyYXkuZnJvbWBgIGNvbnZlcnRzIGl0IHRvIGFuIGFycmF5IG9mIGVudHJpZXMsIGFuZCBgYChpdCkgPT5cbiAgICogbmV3IE1hcChpdClgYCBjb252ZXJ0cyBpdCB0byBhIGBgTWFwYGAgKHdoaWNoIGlzIHRoZSBkZWZhdWx0IGJlaGF2aW9yKS5cbiAgICogQHJldHVybiB7YW55fSBUaGUgSmF2YVNjcmlwdCBvYmplY3QgcmVzdWx0aW5nIGZyb20gdGhlIGNvbnZlcnNpb24uXG4gICAqL1xuICB0b0pzKHtcbiAgICBkZXB0aCA9IC0xLFxuICAgIHB5cHJveGllcyxcbiAgICBjcmVhdGVfcHlwcm94aWVzID0gKCEhMSksXG4gICAgZGljdF9jb252ZXJ0ZXIsXG4gIH0gPSB7fSkge1xuICAgIGxldCBwdHJvYmogPSBfZ2V0UHRyKHRoaXMpO1xuICAgIGxldCBpZHJlc3VsdDtcbiAgICBsZXQgcHJveGllc19pZDtcbiAgICBsZXQgZGljdF9jb252ZXJ0ZXJfaWQgPSAwO1xuICAgIGlmICghY3JlYXRlX3B5cHJveGllcykge1xuICAgICAgcHJveGllc19pZCA9IDA7XG4gICAgfSBlbHNlIGlmIChweXByb3hpZXMpIHtcbiAgICAgIHByb3hpZXNfaWQgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShweXByb3hpZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94aWVzX2lkID0gTW9kdWxlLmhpd2lyZS5uZXdfdmFsdWUoW10pO1xuICAgIH1cbiAgICBpZiAoZGljdF9jb252ZXJ0ZXIpIHtcbiAgICAgIGRpY3RfY29udmVydGVyX2lkID0gTW9kdWxlLmhpd2lyZS5uZXdfdmFsdWUoZGljdF9jb252ZXJ0ZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWRyZXN1bHQgPSBNb2R1bGUuX3B5dGhvbjJqc19jdXN0b21fZGljdF9jb252ZXJ0ZXIoXG4gICAgICAgIHB0cm9iaixcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIHByb3hpZXNfaWQsXG4gICAgICAgIGRpY3RfY29udmVydGVyX2lkXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYocHJveGllc19pZCk7XG4gICAgICBNb2R1bGUuaGl3aXJlLmRlY3JlZihkaWN0X2NvbnZlcnRlcl9pZCk7XG4gICAgfVxuICAgIGlmIChpZHJlc3VsdCA9PT0gMCkge1xuICAgICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgICB9XG4gICAgcmV0dXJuIE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGlkcmVzdWx0KTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgOmFueTpgUHlQcm94eS5sZW5ndGhgIGdldHRlciBpcyBhdmFpbGFibGUgb24gdGhpcyBQeVByb3h5LiBBXG4gICAqIFR5cGVzY3JpcHQgdHlwZSBndWFyZC5cbiAgICogQHJldHVybnMge3RoaXMgaXMgUHlQcm94eVdpdGhMZW5ndGh9XG4gICAqL1xuICBzdXBwb3J0c0xlbmd0aCgpIHtcbiAgICByZXR1cm4gISEodGhpcy4kJGZsYWdzICYgKDEgPDwgMCkpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSA6YW55OmBQeVByb3h5LmdldGAgbWV0aG9kIGlzIGF2YWlsYWJsZSBvbiB0aGlzIFB5UHJveHkuIEFcbiAgICogVHlwZXNjcmlwdCB0eXBlIGd1YXJkLlxuICAgKiBAcmV0dXJucyB7dGhpcyBpcyBQeVByb3h5V2l0aEdldH1cbiAgICovXG4gIHN1cHBvcnRzR2V0KCkge1xuICAgIHJldHVybiAhISh0aGlzLiQkZmxhZ3MgJiAoMSA8PCAxKSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIDphbnk6YFB5UHJveHkuc2V0YCBtZXRob2QgaXMgYXZhaWxhYmxlIG9uIHRoaXMgUHlQcm94eS4gQVxuICAgKiBUeXBlc2NyaXB0IHR5cGUgZ3VhcmQuXG4gICAqIEByZXR1cm5zIHt0aGlzIGlzIFB5UHJveHlXaXRoU2V0fVxuICAgKi9cbiAgc3VwcG9ydHNTZXQoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuJCRmbGFncyAmICgxIDw8IDIpKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgOmFueTpgUHlQcm94eS5oYXNgIG1ldGhvZCBpcyBhdmFpbGFibGUgb24gdGhpcyBQeVByb3h5LiBBXG4gICAqIFR5cGVzY3JpcHQgdHlwZSBndWFyZC5cbiAgICogQHJldHVybnMge3RoaXMgaXMgUHlQcm94eVdpdGhIYXN9XG4gICAqL1xuICBzdXBwb3J0c0hhcygpIHtcbiAgICByZXR1cm4gISEodGhpcy4kJGZsYWdzICYgKDEgPDwgMykpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBQeVByb3h5IGlzIGl0ZXJhYmxlLiBBIFR5cGVzY3JpcHQgdHlwZSBndWFyZCBmb3JcbiAgICogOmFueTpgUHlQcm94eS5bU3ltYm9sLml0ZXJhdG9yXWAuXG4gICAqIEByZXR1cm5zIHt0aGlzIGlzIFB5UHJveHlJdGVyYWJsZX1cbiAgICovXG4gIGlzSXRlcmFibGUoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuJCRmbGFncyAmICgoMSA8PCA0KSB8ICgxIDw8IDUpKSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIFB5UHJveHkgaXMgaXRlcmFibGUuIEEgVHlwZXNjcmlwdCB0eXBlIGd1YXJkIGZvclxuICAgKiA6YW55OmBQeVByb3h5Lm5leHRgLlxuICAgKiBAcmV0dXJucyB7dGhpcyBpcyBQeVByb3h5SXRlcmF0b3J9XG4gICAqL1xuICBpc0l0ZXJhdG9yKCkge1xuICAgIHJldHVybiAhISh0aGlzLiQkZmxhZ3MgJiAoMSA8PCA1KSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIFB5UHJveHkgaXMgYXdhaXRhYmxlLiBBIFR5cGVzY3JpcHQgdHlwZSBndWFyZCwgaWYgdGhpc1xuICAgKiBmdW5jdGlvbiByZXR1cm5zIHRydWUgVHlwZXNjcmlwdCBjb25zaWRlcnMgdGhlIFB5UHJveHkgdG8gYmUgYSBgYFByb21pc2VgYC5cbiAgICogQHJldHVybnMge3RoaXMgaXMgUHlQcm94eUF3YWl0YWJsZX1cbiAgICovXG4gIGlzQXdhaXRhYmxlKCkge1xuICAgIHJldHVybiAhISh0aGlzLiQkZmxhZ3MgJiAoMSA8PCA2KSk7XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlIFB5UHJveHkgaXMgYSBidWZmZXIuIEEgVHlwZXNjcmlwdCB0eXBlIGd1YXJkIGZvclxuICAgKiA6YW55OmBQeVByb3h5LmdldEJ1ZmZlcmAuXG4gICAqIEByZXR1cm5zIHt0aGlzIGlzIFB5UHJveHlCdWZmZXJ9XG4gICAqL1xuICBpc0J1ZmZlcigpIHtcbiAgICByZXR1cm4gISEodGhpcy4kJGZsYWdzICYgKDEgPDwgNykpO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBQeVByb3h5IGlzIGEgQ2FsbGFibGUuIEEgVHlwZXNjcmlwdCB0eXBlIGd1YXJkLCBpZiB0aGlzXG4gICAqIHJldHVybnMgdHJ1ZSB0aGVuIFR5cGVzY3JpcHQgY29uc2lkZXJzIHRoZSBQcm94eSB0byBiZSBjYWxsYWJsZSBvZlxuICAgKiBzaWduYXR1cmUgYGAoYXJncy4uLiA6IGFueVtdKSA9PiBQeVByb3h5IHwgbnVtYmVyIHwgYmlnaW50IHwgc3RyaW5nIHxcbiAgICogYm9vbGVhbiB8IHVuZGVmaW5lZGBgLlxuICAgKiBAcmV0dXJucyB7dGhpcyBpcyBQeVByb3h5Q2FsbGFibGV9XG4gICAqL1xuICBpc0NhbGxhYmxlKCkge1xuICAgIHJldHVybiAhISh0aGlzLiQkZmxhZ3MgJiAoMSA8PCA4KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7IFB5UHJveHkgJiBQeVByb3h5TGVuZ3RoTWV0aG9kcyB9IFB5UHJveHlXaXRoTGVuZ3RoXG4gKi9cbi8vIENvbnRyb2xsZWQgYnkgSEFTX0xFTkdUSCwgYXBwZWFycyBmb3IgYW55IG9iamVjdCB3aXRoIF9fbGVuX18gb3Igc3FfbGVuZ3RoXG4vLyBvciBtcF9sZW5ndGggbWV0aG9kc1xuY2xhc3MgUHlQcm94eUxlbmd0aE1ldGhvZHMge1xuICAvKipcbiAgICogVGhlIGxlbmd0aCBvZiB0aGUgb2JqZWN0LlxuICAgKlxuICAgKiBQcmVzZW50IG9ubHkgaWYgdGhlIHByb3hpZWQgUHl0aG9uIG9iamVjdCBoYXMgYSBgYF9fbGVuX19gYCBtZXRob2QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgbGVuZ3RoKCkge1xuICAgIGxldCBwdHJvYmogPSBfZ2V0UHRyKHRoaXMpO1xuICAgIGxldCBsZW5ndGg7XG4gICAgdHJ5IHtcbiAgICAgIGxlbmd0aCA9IE1vZHVsZS5fUHlPYmplY3RfU2l6ZShwdHJvYmopO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA9PT0gLTEpIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7UHlQcm94eSAmIFB5UHJveHlHZXRJdGVtTWV0aG9kc30gUHlQcm94eVdpdGhHZXRcbiAqL1xuXG4vLyBDb250cm9sbGVkIGJ5IEhBU19HRVQsIGFwcGVhcnMgZm9yIGFueSBjbGFzcyB3aXRoIF9fZ2V0aXRlbV9fLFxuLy8gbXBfc3Vic2NyaXB0LCBvciBzcV9pdGVtIG1ldGhvZHNcbi8qKlxuICogQGludGVyZmFjZVxuICovXG5jbGFzcyBQeVByb3h5R2V0SXRlbU1ldGhvZHMge1xuICAvKipcbiAgICogVGhpcyB0cmFuc2xhdGVzIHRvIHRoZSBQeXRob24gY29kZSBgYG9ialtrZXldYGAuXG4gICAqXG4gICAqIFByZXNlbnQgb25seSBpZiB0aGUgcHJveGllZCBQeXRob24gb2JqZWN0IGhhcyBhIGBgX19nZXRpdGVtX19gYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBrZXkgVGhlIGtleSB0byBsb29rIHVwLlxuICAgKiBAcmV0dXJucyB7UHkySnNSZXN1bHR9IFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgZ2V0KGtleSkge1xuICAgIGxldCBwdHJvYmogPSBfZ2V0UHRyKHRoaXMpO1xuICAgIGxldCBpZGtleSA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGtleSk7XG4gICAgbGV0IGlkcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICBpZHJlc3VsdCA9IE1vZHVsZS5fX3B5cHJveHlfZ2V0aXRlbShwdHJvYmosIGlka2V5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKGlka2V5KTtcbiAgICB9XG4gICAgaWYgKGlkcmVzdWx0ID09PSAwKSB7XG4gICAgICBpZiAoTW9kdWxlLl9QeUVycl9PY2N1cnJlZCgpKSB7XG4gICAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gTW9kdWxlLmhpd2lyZS5wb3BfdmFsdWUoaWRyZXN1bHQpO1xuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYge1B5UHJveHkgJiBQeVByb3h5U2V0SXRlbU1ldGhvZHN9IFB5UHJveHlXaXRoU2V0XG4gKi9cbi8vIENvbnRyb2xsZWQgYnkgSEFTX1NFVCwgYXBwZWFycyBmb3IgYW55IGNsYXNzIHdpdGggX19zZXRpdGVtX18sIF9fZGVsaXRlbV9fLFxuLy8gbXBfYXNzX3N1YnNjcmlwdCwgIG9yIHNxX2Fzc19pdGVtLlxuY2xhc3MgUHlQcm94eVNldEl0ZW1NZXRob2RzIHtcbiAgLyoqXG4gICAqIFRoaXMgdHJhbnNsYXRlcyB0byB0aGUgUHl0aG9uIGNvZGUgYGBvYmpba2V5XSA9IHZhbHVlYGAuXG4gICAqXG4gICAqIFByZXNlbnQgb25seSBpZiB0aGUgcHJveGllZCBQeXRob24gb2JqZWN0IGhhcyBhIGBgX19zZXRpdGVtX19gYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7YW55fSBrZXkgVGhlIGtleSB0byBzZXQuXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IGl0IHRvLlxuICAgKi9cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICBsZXQgcHRyb2JqID0gX2dldFB0cih0aGlzKTtcbiAgICBsZXQgaWRrZXkgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShrZXkpO1xuICAgIGxldCBpZHZhbCA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKHZhbHVlKTtcbiAgICBsZXQgZXJyY29kZTtcbiAgICB0cnkge1xuICAgICAgZXJyY29kZSA9IE1vZHVsZS5fX3B5cHJveHlfc2V0aXRlbShwdHJvYmosIGlka2V5LCBpZHZhbCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgTW9kdWxlLmZhdGFsX2Vycm9yKGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBNb2R1bGUuaGl3aXJlLmRlY3JlZihpZGtleSk7XG4gICAgICBNb2R1bGUuaGl3aXJlLmRlY3JlZihpZHZhbCk7XG4gICAgfVxuICAgIGlmIChlcnJjb2RlID09PSAtMSkge1xuICAgICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFRoaXMgdHJhbnNsYXRlcyB0byB0aGUgUHl0aG9uIGNvZGUgYGBkZWwgb2JqW2tleV1gYC5cbiAgICpcbiAgICogUHJlc2VudCBvbmx5IGlmIHRoZSBwcm94aWVkIFB5dGhvbiBvYmplY3QgaGFzIGEgYGBfX2RlbGl0ZW1fX2BgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHthbnl9IGtleSBUaGUga2V5IHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZShrZXkpIHtcbiAgICBsZXQgcHRyb2JqID0gX2dldFB0cih0aGlzKTtcbiAgICBsZXQgaWRrZXkgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShrZXkpO1xuICAgIGxldCBlcnJjb2RlO1xuICAgIHRyeSB7XG4gICAgICBlcnJjb2RlID0gTW9kdWxlLl9fcHlwcm94eV9kZWxpdGVtKHB0cm9iaiwgaWRrZXkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYoaWRrZXkpO1xuICAgIH1cbiAgICBpZiAoZXJyY29kZSA9PT0gLTEpIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYge1B5UHJveHkgJiBQeVByb3h5Q29udGFpbnNNZXRob2RzfSBQeVByb3h5V2l0aEhhc1xuICovXG5cbi8vIENvbnRyb2xsZWQgYnkgSEFTX0NPTlRBSU5TIGZsYWcsIGFwcGVhcnMgZm9yIGFueSBjbGFzcyB3aXRoIF9fY29udGFpbnNfXyBvclxuLy8gc3FfY29udGFpbnNcbmNsYXNzIFB5UHJveHlDb250YWluc01ldGhvZHMge1xuICAvKipcbiAgICogVGhpcyB0cmFuc2xhdGVzIHRvIHRoZSBQeXRob24gY29kZSBgYGtleSBpbiBvYmpgYC5cbiAgICpcbiAgICogUHJlc2VudCBvbmx5IGlmIHRoZSBwcm94aWVkIFB5dGhvbiBvYmplY3QgaGFzIGEgYGBfX2NvbnRhaW5zX19gYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSXMgYGBrZXlgYCBwcmVzZW50P1xuICAgKi9cbiAgaGFzKGtleSkge1xuICAgIGxldCBwdHJvYmogPSBfZ2V0UHRyKHRoaXMpO1xuICAgIGxldCBpZGtleSA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGtleSk7XG4gICAgbGV0IHJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gTW9kdWxlLl9fcHlwcm94eV9jb250YWlucyhwdHJvYmosIGlka2V5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKGlka2V5KTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PT0gLTEpIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQgPT09IDE7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmb3IgW1N5bWJvbC5pdGVyYXRvcl0uXG4gKlxuICogQmVjYXVzZSBcIml0IGlzIHBvc3NpYmxlIGZvciBhIGdlbmVyYXRvciB0byBiZSBnYXJiYWdlIGNvbGxlY3RlZCB3aXRob3V0XG4gKiBldmVyIHJ1bm5pbmcgaXRzIGZpbmFsbHkgYmxvY2tcIiwgd2UgdGFrZSBleHRyYSBjYXJlIHRvIHRyeSB0byBlbnN1cmUgdGhhdFxuICogd2UgZG9uJ3QgbGVhayB0aGUgaXRlcmF0b3IuIFdlIHJlZ2lzdGVyIGl0IHdpdGggdGhlIGZpbmFsaXphdGlvblJlZ2lzdHJ5LFxuICogYnV0IGlmIHRoZSBmaW5hbGx5IGJsb2NrIGlzIGV4ZWN1dGVkLCB3ZSBkZWNyZWYgdGhlIHBvaW50ZXIgYW5kIHVucmVnaXN0ZXIuXG4gKlxuICogSW4gb3JkZXIgdG8gZG8gdGhpcywgd2UgY3JlYXRlIHRoZSBnZW5lcmF0b3Igd2l0aCB0aGlzIGlubmVyIG1ldGhvZCxcbiAqIHJlZ2lzdGVyIHRoZSBmaW5hbGl6ZXIsIGFuZCB0aGVuIHJldHVybiBpdC5cbiAqXG4gKiBRdW90ZSBmcm9tOlxuICogaHR0cHM6Ly9oYWNrcy5tb3ppbGxhLm9yZy8yMDE1LzA3L2VzNi1pbi1kZXB0aC1nZW5lcmF0b3JzLWNvbnRpbnVlZC9cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiogaXRlcl9oZWxwZXIoaXRlcnB0ciwgdG9rZW4pIHtcbiAgdHJ5IHtcbiAgICBsZXQgaXRlbTtcbiAgICB3aGlsZSAoKGl0ZW0gPSBNb2R1bGUuX19weXByb3h5X2l0ZXJfbmV4dChpdGVycHRyKSkpIHtcbiAgICAgIHlpZWxkIE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGl0ZW0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBNb2R1bGUuZmluYWxpemF0aW9uUmVnaXN0cnkudW5yZWdpc3Rlcih0b2tlbik7XG4gICAgTW9kdWxlLl9QeV9EZWNSZWYoaXRlcnB0cik7XG4gIH1cbiAgaWYgKE1vZHVsZS5fUHlFcnJfT2NjdXJyZWQoKSkge1xuICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7UHlQcm94eSAmIFB5UHJveHlJdGVyYWJsZU1ldGhvZHN9IFB5UHJveHlJdGVyYWJsZVxuICovXG5cbi8vIENvbnRyb2xsZWQgYnkgSVNfSVRFUkFCTEUsIGFwcGVhcnMgZm9yIGFueSBvYmplY3Qgd2l0aCBfX2l0ZXJfXyBvciB0cF9pdGVyLFxuLy8gdW5sZXNzIHRoZXkgYXJlIGl0ZXJhdG9ycy4gU2VlOiBodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2MtYXBpL2l0ZXIuaHRtbFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvSXRlcmF0aW9uX3Byb3RvY29sc1xuLy8gVGhpcyBhdm9pZHMgYWxsb2NhdGluZyBhIFB5UHJveHkgd3JhcHBlciBmb3IgdGhlIHRlbXBvcmFyeSBpdGVyYXRvci5cbmNsYXNzIFB5UHJveHlJdGVyYWJsZU1ldGhvZHMge1xuICAvKipcbiAgICogVGhpcyB0cmFuc2xhdGVzIHRvIHRoZSBQeXRob24gY29kZSBgYGl0ZXIob2JqKWBgLiBSZXR1cm4gYW4gaXRlcmF0b3JcbiAgICogYXNzb2NpYXRlZCB0byB0aGUgcHJveHkuIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgYFN5bWJvbC5pdGVyYXRvclxuICAgKiA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3ltYm9sL2l0ZXJhdG9yPmBfLlxuICAgKlxuICAgKiBQcmVzZW50IG9ubHkgaWYgdGhlIHByb3hpZWQgUHl0aG9uIG9iamVjdCBpcyBpdGVyYWJsZSAoaS5lLiwgaGFzIGFuXG4gICAqIGBgX19pdGVyX19gYCBtZXRob2QpLlxuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgdXNlZCBpbXBsaWNpdGx5IGJ5IGBgZm9yKGxldCB4IG9mIHByb3h5KXt9YGAuXG4gICAqXG4gICAqIEByZXR1cm5zIHtJdGVyYXRvcjxQeTJKc1Jlc3VsdCwgUHkySnNSZXN1bHQsIGFueT59IEFuIGl0ZXJhdG9yIGZvciB0aGUgcHJveGllZCBQeXRob24gb2JqZWN0LlxuICAgKi9cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgbGV0IHB0cm9iaiA9IF9nZXRQdHIodGhpcyk7XG4gICAgbGV0IHRva2VuID0ge307XG4gICAgbGV0IGl0ZXJwdHI7XG4gICAgdHJ5IHtcbiAgICAgIGl0ZXJwdHIgPSBNb2R1bGUuX1B5T2JqZWN0X0dldEl0ZXIocHRyb2JqKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfVxuICAgIGlmIChpdGVycHRyID09PSAwKSB7XG4gICAgICBNb2R1bGUuX3B5dGhvbmV4YzJqcygpO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSBpdGVyX2hlbHBlcihpdGVycHRyLCB0b2tlbik7XG4gICAgTW9kdWxlLmZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHJlc3VsdCwgW2l0ZXJwdHIsIHVuZGVmaW5lZF0sIHRva2VuKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYge1B5UHJveHkgJiBQeVByb3h5SXRlcmF0b3JNZXRob2RzfSBQeVByb3h5SXRlcmF0b3JcbiAqL1xuXG4vLyBDb250cm9sbGVkIGJ5IElTX0lURVJBVE9SLCBhcHBlYXJzIGZvciBhbnkgb2JqZWN0IHdpdGggYSBfX25leHRfXyBvclxuLy8gdHBfaXRlcm5leHQgbWV0aG9kLlxuY2xhc3MgUHlQcm94eUl0ZXJhdG9yTWV0aG9kcyB7XG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8qKlxuICAgKiBUaGlzIHRyYW5zbGF0ZXMgdG8gdGhlIFB5dGhvbiBjb2RlIGBgbmV4dChvYmopYGAuIFJldHVybnMgdGhlIG5leHQgdmFsdWVcbiAgICogb2YgdGhlIGdlbmVyYXRvci4gU2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciBgR2VuZXJhdG9yLnByb3RvdHlwZS5uZXh0XG4gICAqIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9HZW5lcmF0b3IvbmV4dD5gXy5cbiAgICogVGhlIGFyZ3VtZW50IHdpbGwgYmUgc2VudCB0byB0aGUgUHl0aG9uIGdlbmVyYXRvci5cbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHVzZWQgaW1wbGljaXRseSBieSBgYGZvcihsZXQgeCBvZiBwcm94eSl7fWBgLlxuICAgKlxuICAgKiBQcmVzZW50IG9ubHkgaWYgdGhlIHByb3hpZWQgUHl0aG9uIG9iamVjdCBpcyBhIGdlbmVyYXRvciBvciBpdGVyYXRvclxuICAgKiAoaS5lLiwgaGFzIGEgYGBzZW5kYGAgb3IgYGBfX25leHRfX2BgIG1ldGhvZCkuXG4gICAqXG4gICAqIEBwYXJhbSB7YW55PX0gW3ZhbHVlXSBUaGUgdmFsdWUgdG8gc2VuZCB0byB0aGUgZ2VuZXJhdG9yLiBUaGUgdmFsdWUgd2lsbCBiZVxuICAgKiBhc3NpZ25lZCBhcyBhIHJlc3VsdCBvZiBhIHlpZWxkIGV4cHJlc3Npb24uXG4gICAqIEByZXR1cm5zIHtJdGVyYXRvclJlc3VsdDxQeTJKc1Jlc3VsdCwgUHkySnNSZXN1bHQ+fSBBbiBPYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczogYGBkb25lYGAgYW5kIGBgdmFsdWVgYC5cbiAgICogV2hlbiB0aGUgZ2VuZXJhdG9yIHlpZWxkcyBgYHNvbWVfdmFsdWVgYCwgYGBuZXh0YGAgcmV0dXJucyBgYHtkb25lIDpcbiAgICogZmFsc2UsIHZhbHVlIDogc29tZV92YWx1ZX1gYC4gV2hlbiB0aGUgZ2VuZXJhdG9yIHJhaXNlcyBhXG4gICAqIGBgU3RvcEl0ZXJhdGlvbihyZXN1bHRfdmFsdWUpYGAgZXhjZXB0aW9uLCBgYG5leHRgYCByZXR1cm5zIGBge2RvbmUgOlxuICAgKiB0cnVlLCB2YWx1ZSA6IHJlc3VsdF92YWx1ZX1gYC5cbiAgICovXG4gIG5leHQoYXJnID0gdW5kZWZpbmVkKSB7XG4gICAgbGV0IGlkcmVzdWx0O1xuICAgIC8vIE5vdGU6IGFyZyBpcyBvcHRpb25hbCwgaWYgYXJnIGlzIG5vdCBzdXBwbGllZCwgaXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgICAvLyB3aGljaCBnZXRzIGNvbnZlcnRlZCB0byBcIlB5X05vbmVcIi4gVGhpcyBpcyBhcyBpbnRlbmRlZC5cbiAgICBsZXQgaWRhcmcgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShhcmcpO1xuICAgIGxldCBkb25lO1xuICAgIHRyeSB7XG4gICAgICBpZHJlc3VsdCA9IE1vZHVsZS5fX3B5cHJveHlHZW5fU2VuZChfZ2V0UHRyKHRoaXMpLCBpZGFyZyk7XG4gICAgICBkb25lID0gaWRyZXN1bHQgPT09IDA7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBpZHJlc3VsdCA9IE1vZHVsZS5fX3B5cHJveHlHZW5fRmV0Y2hTdG9wSXRlcmF0aW9uVmFsdWUoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKGlkYXJnKTtcbiAgICB9XG4gICAgaWYgKGRvbmUgJiYgaWRyZXN1bHQgPT09IDApIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKGlkcmVzdWx0KTtcbiAgICByZXR1cm4geyBkb25lLCB2YWx1ZSB9O1xuICB9XG59XG5cbi8vIEFub3RoZXIgbGF5ZXIgb2YgYm9pbGVycGxhdGUuIFRoZSBQeVByb3h5SGFuZGxlcnMgaGF2ZSBzb21lIGFubm95aW5nIGxvZ2ljXG4vLyB0byBkZWFsIHdpdGggc3RyYWluaW5nIG91dCB0aGUgc3B1cmlvdXMgXCJGdW5jdGlvblwiIHByb3BlcnRpZXMgXCJwcm90b3R5cGVcIixcbi8vIFwiYXJndW1lbnRzXCIsIGFuZCBcImxlbmd0aFwiLCB0byBkZWFsIHdpdGggY29ycmVjdGx5IHNhdGlzZnlpbmcgdGhlIFByb3h5XG4vLyBpbnZhcmlhbnRzLCBhbmQgdG8gZGVhbCB3aXRoIHRoZSBtcm9cbmZ1bmN0aW9uIHB5dGhvbl9oYXNhdHRyKGpzb2JqLCBqc2tleSkge1xuICBsZXQgcHRyb2JqID0gX2dldFB0cihqc29iaik7XG4gIGxldCBpZGtleSA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGpza2V5KTtcbiAgbGV0IHJlc3VsdDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBNb2R1bGUuX19weXByb3h5X2hhc2F0dHIocHRyb2JqLCBpZGtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gIH0gZmluYWxseSB7XG4gICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYoaWRrZXkpO1xuICB9XG4gIGlmIChyZXN1bHQgPT09IC0xKSB7XG4gICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0ICE9PSAwO1xufVxuXG4vLyBSZXR1cm5zIGEgSnNSZWYgaW4gb3JkZXIgdG8gYWxsb3cgdXMgdG8gZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIFwibm90IGZvdW5kXCJcbi8vIChpbiB3aGljaCBjYXNlIHdlIHJldHVybiAwKSBhbmQgXCJmb3VuZCAnTm9uZSdcIiAoaW4gd2hpY2ggY2FzZSB3ZSByZXR1cm5cbi8vIEpzX3VuZGVmaW5lZCkuXG5mdW5jdGlvbiBweXRob25fZ2V0YXR0cihqc29iaiwganNrZXkpIHtcbiAgbGV0IHB0cm9iaiA9IF9nZXRQdHIoanNvYmopO1xuICBsZXQgaWRrZXkgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShqc2tleSk7XG4gIGxldCBpZHJlc3VsdDtcbiAgbGV0IGNhY2hlSWQgPSBqc29iai4kJC5jYWNoZS5jYWNoZUlkO1xuICB0cnkge1xuICAgIGlkcmVzdWx0ID0gTW9kdWxlLl9fcHlwcm94eV9nZXRhdHRyKHB0cm9iaiwgaWRrZXksIGNhY2hlSWQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgTW9kdWxlLmZhdGFsX2Vycm9yKGUpO1xuICB9IGZpbmFsbHkge1xuICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKGlka2V5KTtcbiAgfVxuICBpZiAoaWRyZXN1bHQgPT09IDApIHtcbiAgICBpZiAoTW9kdWxlLl9QeUVycl9PY2N1cnJlZCgpKSB7XG4gICAgICBNb2R1bGUuX3B5dGhvbmV4YzJqcygpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaWRyZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHB5dGhvbl9zZXRhdHRyKGpzb2JqLCBqc2tleSwganN2YWwpIHtcbiAgbGV0IHB0cm9iaiA9IF9nZXRQdHIoanNvYmopO1xuICBsZXQgaWRrZXkgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShqc2tleSk7XG4gIGxldCBpZHZhbCA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGpzdmFsKTtcbiAgbGV0IGVycmNvZGU7XG4gIHRyeSB7XG4gICAgZXJyY29kZSA9IE1vZHVsZS5fX3B5cHJveHlfc2V0YXR0cihwdHJvYmosIGlka2V5LCBpZHZhbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gIH0gZmluYWxseSB7XG4gICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYoaWRrZXkpO1xuICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKGlkdmFsKTtcbiAgfVxuICBpZiAoZXJyY29kZSA9PT0gLTEpIHtcbiAgICBNb2R1bGUuX3B5dGhvbmV4YzJqcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB5dGhvbl9kZWxhdHRyKGpzb2JqLCBqc2tleSkge1xuICBsZXQgcHRyb2JqID0gX2dldFB0cihqc29iaik7XG4gIGxldCBpZGtleSA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKGpza2V5KTtcbiAgbGV0IGVycmNvZGU7XG4gIHRyeSB7XG4gICAgZXJyY29kZSA9IE1vZHVsZS5fX3B5cHJveHlfZGVsYXR0cihwdHJvYmosIGlka2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBNb2R1bGUuaGl3aXJlLmRlY3JlZihpZGtleSk7XG4gIH1cbiAgaWYgKGVycmNvZGUgPT09IC0xKSB7XG4gICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgfVxufVxuXG4vLyBTZWUgZXhwbGFuYXRpb24gb2Ygd2hpY2ggbWV0aG9kcyBzaG91bGQgYmUgZGVmaW5lZCBoZXJlIGFuZCB3aGF0IHRoZXkgZG9cbi8vIGhlcmU6XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm94eVxubGV0IFB5UHJveHlIYW5kbGVycyA9IHtcbiAgaXNFeHRlbnNpYmxlKCkge1xuICAgIHJldHVybiAoISExKTtcbiAgfSxcbiAgaGFzKGpzb2JqLCBqc2tleSkge1xuICAgIC8vIE5vdGU6IG11c3QgcmVwb3J0IFwicHJvdG90eXBlXCIgaW4gcHJveHkgd2hlbiB3ZSBhcmUgY2FsbGFibGUuXG4gICAgLy8gKFdlIGNhbiByZXR1cm4gdGhlIHdyb25nIHZhbHVlIGZyb20gXCJnZXRcIiBoYW5kbGVyIHRob3VnaC4pXG4gICAgbGV0IG9iakhhc0tleSA9IFJlZmxlY3QuaGFzKGpzb2JqLCBqc2tleSk7XG4gICAgaWYgKG9iakhhc0tleSkge1xuICAgICAgcmV0dXJuICghITEpO1xuICAgIH1cbiAgICAvLyBweXRob25faGFzYXR0ciB3aWxsIGNyYXNoIGlmIGdpdmVuIGEgU3ltYm9sLlxuICAgIGlmICh0eXBlb2YganNrZXkgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgIHJldHVybiAoISEwKTtcbiAgICB9XG4gICAgaWYgKGpza2V5LnN0YXJ0c1dpdGgoXCIkXCIpKSB7XG4gICAgICBqc2tleSA9IGpza2V5LnNsaWNlKDEpO1xuICAgIH1cbiAgICByZXR1cm4gcHl0aG9uX2hhc2F0dHIoanNvYmosIGpza2V5KTtcbiAgfSxcbiAgZ2V0KGpzb2JqLCBqc2tleSkge1xuICAgIC8vIFByZWZlcmVuY2Ugb3JkZXI6XG4gICAgLy8gMS4gc3R1ZmYgZnJvbSBKYXZhU2NyaXB0XG4gICAgLy8gMi4gdGhlIHJlc3VsdCBvZiBQeXRob24gZ2V0YXR0clxuXG4gICAgLy8gcHl0aG9uX2dldGF0dHIgd2lsbCBjcmFzaCBpZiBnaXZlbiBhIFN5bWJvbC5cbiAgICBpZiAoanNrZXkgaW4ganNvYmogfHwgdHlwZW9mIGpza2V5ID09PSBcInN5bWJvbFwiKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXQoanNvYmosIGpza2V5KTtcbiAgICB9XG4gICAgLy8gSWYga2V5cyBzdGFydCB3aXRoICQgcmVtb3ZlIHRoZSAkLiBVc2VyIGNhbiB1c2UgaW5pdGlhbCAkIHRvXG4gICAgLy8gdW5hbWJpZ3VvdXNseSBhc2sgZm9yIGEga2V5IG9uIHRoZSBQeXRob24gb2JqZWN0LlxuICAgIGlmIChqc2tleS5zdGFydHNXaXRoKFwiJFwiKSkge1xuICAgICAganNrZXkgPSBqc2tleS5zbGljZSgxKTtcbiAgICB9XG4gICAgLy8gMi4gVGhlIHJlc3VsdCBvZiBnZXRhdHRyXG4gICAgbGV0IGlkcmVzdWx0ID0gcHl0aG9uX2dldGF0dHIoanNvYmosIGpza2V5KTtcbiAgICBpZiAoaWRyZXN1bHQgIT09IDApIHtcbiAgICAgIHJldHVybiBNb2R1bGUuaGl3aXJlLnBvcF92YWx1ZShpZHJlc3VsdCk7XG4gICAgfVxuICB9LFxuICBzZXQoanNvYmosIGpza2V5LCBqc3ZhbCkge1xuICAgIGxldCBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoanNvYmosIGpza2V5KTtcbiAgICBpZiAoZGVzY3IgJiYgIWRlc2NyLndyaXRhYmxlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBDYW5ub3Qgc2V0IHJlYWQgb25seSBmaWVsZCAnJHtqc2tleX0nYCk7XG4gICAgfVxuICAgIC8vIHB5dGhvbl9zZXRhdHRyIHdpbGwgY3Jhc2ggaWYgZ2l2ZW4gYSBTeW1ib2wuXG4gICAgaWYgKHR5cGVvZiBqc2tleSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KGpzb2JqLCBqc2tleSwganN2YWwpO1xuICAgIH1cbiAgICBpZiAoanNrZXkuc3RhcnRzV2l0aChcIiRcIikpIHtcbiAgICAgIGpza2V5ID0ganNrZXkuc2xpY2UoMSk7XG4gICAgfVxuICAgIHB5dGhvbl9zZXRhdHRyKGpzb2JqLCBqc2tleSwganN2YWwpO1xuICAgIHJldHVybiAoISExKTtcbiAgfSxcbiAgZGVsZXRlUHJvcGVydHkoanNvYmosIGpza2V5KSB7XG4gICAgbGV0IGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihqc29iaiwganNrZXkpO1xuICAgIGlmIChkZXNjciAmJiAhZGVzY3Iud3JpdGFibGUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCBkZWxldGUgcmVhZCBvbmx5IGZpZWxkICcke2pza2V5fSdgKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBqc2tleSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoanNvYmosIGpza2V5KTtcbiAgICB9XG4gICAgaWYgKGpza2V5LnN0YXJ0c1dpdGgoXCIkXCIpKSB7XG4gICAgICBqc2tleSA9IGpza2V5LnNsaWNlKDEpO1xuICAgIH1cbiAgICBweXRob25fZGVsYXR0cihqc29iaiwganNrZXkpO1xuICAgIC8vIE11c3QgcmV0dXJuIFwiZmFsc2VcIiBpZiBcImpza2V5XCIgaXMgYSBub25jb25maWd1cmFibGUgb3duIHByb3BlcnR5LlxuICAgIC8vIE90aGVyd2lzZSBKYXZhU2NyaXB0IHdpbGwgdGhyb3cgYSBUeXBlRXJyb3IuXG4gICAgcmV0dXJuICFkZXNjciB8fCBkZXNjci5jb25maWd1cmFibGU7XG4gIH0sXG4gIG93bktleXMoanNvYmopIHtcbiAgICBsZXQgcHRyb2JqID0gX2dldFB0cihqc29iaik7XG4gICAgbGV0IGlkcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICBpZHJlc3VsdCA9IE1vZHVsZS5fX3B5cHJveHlfb3duS2V5cyhwdHJvYmopO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIE1vZHVsZS5mYXRhbF9lcnJvcihlKTtcbiAgICB9XG4gICAgaWYgKGlkcmVzdWx0ID09PSAwKSB7XG4gICAgICBNb2R1bGUuX3B5dGhvbmV4YzJqcygpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gTW9kdWxlLmhpd2lyZS5wb3BfdmFsdWUoaWRyZXN1bHQpO1xuICAgIHJlc3VsdC5wdXNoKC4uLlJlZmxlY3Qub3duS2V5cyhqc29iaikpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIGFwcGx5KGpzb2JqLCBqc3RoaXMsIGpzYXJncykge1xuICAgIHJldHVybiBqc29iai5hcHBseShqc3RoaXMsIGpzYXJncyk7XG4gIH0sXG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQeVByb3h5ICYgUHJvbWlzZTxQeTJKc1Jlc3VsdD59IFB5UHJveHlBd2FpdGFibGVcbiAqL1xuXG4vKipcbiAqIFRoZSBQcm9taXNlIC8gSmF2YVNjcmlwdCBhd2FpdGFibGUgQVBJLlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHlQcm94eUF3YWl0YWJsZU1ldGhvZHMge1xuICAvKipcbiAgICogVGhpcyB3cmFwcyBfX3B5cHJveHlfZW5zdXJlX2Z1dHVyZSBhbmQgbWFrZXMgYSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGFcbiAgICogUHl0aG9uIGF3YWl0YWJsZSB0byBhIHByb21pc2UsIHNjaGVkdWxpbmcgdGhlIGF3YWl0YWJsZSBvbiB0aGUgUHl0aG9uXG4gICAqIGV2ZW50IGxvb3AgaWYgbmVjZXNzYXJ5LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2Vuc3VyZV9mdXR1cmUoKSB7XG4gICAgaWYgKHRoaXMuJCQucHJvbWlzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuJCQucHJvbWlzZTtcbiAgICB9XG4gICAgbGV0IHB0cm9iaiA9IF9nZXRQdHIodGhpcyk7XG4gICAgbGV0IHJlc29sdmVIYW5kbGU7XG4gICAgbGV0IHJlamVjdEhhbmRsZTtcbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVIYW5kbGUgPSByZXNvbHZlO1xuICAgICAgcmVqZWN0SGFuZGxlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGxldCByZXNvbHZlX2hhbmRsZV9pZCA9IE1vZHVsZS5oaXdpcmUubmV3X3ZhbHVlKHJlc29sdmVIYW5kbGUpO1xuICAgIGxldCByZWplY3RfaGFuZGxlX2lkID0gTW9kdWxlLmhpd2lyZS5uZXdfdmFsdWUocmVqZWN0SGFuZGxlKTtcbiAgICBsZXQgZXJyY29kZTtcbiAgICB0cnkge1xuICAgICAgZXJyY29kZSA9IE1vZHVsZS5fX3B5cHJveHlfZW5zdXJlX2Z1dHVyZShcbiAgICAgICAgcHRyb2JqLFxuICAgICAgICByZXNvbHZlX2hhbmRsZV9pZCxcbiAgICAgICAgcmVqZWN0X2hhbmRsZV9pZFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKHJlamVjdF9oYW5kbGVfaWQpO1xuICAgICAgTW9kdWxlLmhpd2lyZS5kZWNyZWYocmVzb2x2ZV9oYW5kbGVfaWQpO1xuICAgIH1cbiAgICBpZiAoZXJyY29kZSA9PT0gLTEpIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICAgIHRoaXMuJCQucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbiAgLyoqXG4gICAqIFJ1bnMgYGBhc3luY2lvLmVuc3VyZV9mdXR1cmUoYXdhaXRhYmxlKWBgLCBleGVjdXRlc1xuICAgKiBgYG9uRnVsZmlsbGVkKHJlc3VsdClgYCB3aGVuIHRoZSBgYEZ1dHVyZWBgIHJlc29sdmVzIHN1Y2Nlc3NmdWxseSxcbiAgICogZXhlY3V0ZXMgYGBvblJlamVjdGVkKGVycm9yKWBgIHdoZW4gdGhlIGBgRnV0dXJlYGAgZmFpbHMuIFdpbGwgYmUgdXNlZFxuICAgKiBpbXBsaWN0bHkgYnkgYGBhd2FpdCBvYmpgYC5cbiAgICpcbiAgICogU2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvclxuICAgKiBgUHJvbWlzZS50aGVuXG4gICAqIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm9taXNlL3RoZW4+YF9cbiAgICpcbiAgICogUHJlc2VudCBvbmx5IGlmIHRoZSBwcm94aWVkIFB5dGhvbiBvYmplY3QgaXMgYGF3YWl0YWJsZVxuICAgKiA8aHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvMy9saWJyYXJ5L2FzeW5jaW8tdGFzay5odG1sP2hpZ2hsaWdodD1hd2FpdGFibGUjYXdhaXRhYmxlcz5gXy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWQgQSBoYW5kbGVyIGNhbGxlZCB3aXRoIHRoZSByZXN1bHQgYXMgYW5cbiAgICogYXJndW1lbnQgaWYgdGhlIGF3YWl0YWJsZSBzdWNjZWVkcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZCBBIGhhbmRsZXIgY2FsbGVkIHdpdGggdGhlIGVycm9yIGFzIGFuXG4gICAqIGFyZ3VtZW50IGlmIHRoZSBhd2FpdGFibGUgZmFpbHMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcmVzdWx0aW5nIFByb21pc2UuXG4gICAqL1xuICB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLl9lbnN1cmVfZnV0dXJlKCk7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgLyoqXG4gICAqIFJ1bnMgYGBhc3luY2lvLmVuc3VyZV9mdXR1cmUoYXdhaXRhYmxlKWBgIGFuZCBleGVjdXRlc1xuICAgKiBgYG9uUmVqZWN0ZWQoZXJyb3IpYGAgaWYgdGhlIGZ1dHVyZSBmYWlscy5cbiAgICpcbiAgICogU2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvclxuICAgKiBgUHJvbWlzZS5jYXRjaFxuICAgKiA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJvbWlzZS9jYXRjaD5gXy5cbiAgICpcbiAgICogUHJlc2VudCBvbmx5IGlmIHRoZSBwcm94aWVkIFB5dGhvbiBvYmplY3QgaXMgYGF3YWl0YWJsZVxuICAgKiA8aHR0cHM6Ly9kb2NzLnB5dGhvbi5vcmcvMy9saWJyYXJ5L2FzeW5jaW8tdGFzay5odG1sP2hpZ2hsaWdodD1hd2FpdGFibGUjYXdhaXRhYmxlcz5gXy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZCBBIGhhbmRsZXIgY2FsbGVkIHdpdGggdGhlIGVycm9yIGFzIGFuXG4gICAqIGFyZ3VtZW50IGlmIHRoZSBhd2FpdGFibGUgZmFpbHMuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgcmVzdWx0aW5nIFByb21pc2UuXG4gICAqL1xuICBjYXRjaChvblJlamVjdGVkKSB7XG4gICAgbGV0IHByb21pc2UgPSB0aGlzLl9lbnN1cmVfZnV0dXJlKCk7XG4gICAgcmV0dXJuIHByb21pc2UuY2F0Y2gob25SZWplY3RlZCk7XG4gIH1cbiAgLyoqXG4gICAqIFJ1bnMgYGBhc3luY2lvLmVuc3VyZV9mdXR1cmUoYXdhaXRhYmxlKWBgIGFuZCBleGVjdXRlc1xuICAgKiBgYG9uRmluYWxseShlcnJvcilgYCB3aGVuIHRoZSBmdXR1cmUgcmVzb2x2ZXMuXG4gICAqXG4gICAqIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiBmb3JcbiAgICogYFByb21pc2UuZmluYWxseVxuICAgKiA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJvbWlzZS9maW5hbGx5PmBfLlxuICAgKlxuICAgKiBQcmVzZW50IG9ubHkgaWYgdGhlIHByb3hpZWQgUHl0aG9uIG9iamVjdCBpcyBgYXdhaXRhYmxlXG4gICAqIDxodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvYXN5bmNpby10YXNrLmh0bWw/aGlnaGxpZ2h0PWF3YWl0YWJsZSNhd2FpdGFibGVzPmBfLlxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZpbmFsbHkgQSBoYW5kbGVyIHRoYXQgaXMgY2FsbGVkIHdpdGggemVybyBhcmd1bWVudHNcbiAgICogd2hlbiB0aGUgYXdhaXRhYmxlIHJlc29sdmVzLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgb3IgcmVqZWN0cyB3aXRoIHRoZSBzYW1lXG4gICAqIHJlc3VsdCBhcyB0aGUgb3JpZ2luYWwgUHJvbWlzZSwgYnV0IG9ubHkgYWZ0ZXIgZXhlY3V0aW5nIHRoZVxuICAgKiBgYG9uRmluYWxseWBgIGhhbmRsZXIuXG4gICAqL1xuICBmaW5hbGx5KG9uRmluYWxseSkge1xuICAgIGxldCBwcm9taXNlID0gdGhpcy5fZW5zdXJlX2Z1dHVyZSgpO1xuICAgIHJldHVybiBwcm9taXNlLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgfVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHsgUHlQcm94eSAmIFB5UHJveHlDYWxsYWJsZU1ldGhvZHMgJiAoKC4uLmFyZ3MgOiBhbnlbXSkgPT4gUHkySnNSZXN1bHQpIH0gUHlQcm94eUNhbGxhYmxlXG4gKi9cbmNsYXNzIFB5UHJveHlDYWxsYWJsZU1ldGhvZHMge1xuICBhcHBseShqc3RoaXMsIGpzYXJncykge1xuICAgIHJldHVybiBNb2R1bGUuY2FsbFB5T2JqZWN0KF9nZXRQdHIodGhpcyksIC4uLmpzYXJncyk7XG4gIH1cbiAgY2FsbChqc3RoaXMsIC4uLmpzYXJncykge1xuICAgIHJldHVybiBNb2R1bGUuY2FsbFB5T2JqZWN0KF9nZXRQdHIodGhpcyksIC4uLmpzYXJncyk7XG4gIH1cbiAgLyoqXG4gICAqIENhbGwgdGhlIGZ1bmN0aW9uIHdpdGgga2V5IHdvcmQgYXJndW1lbnRzLlxuICAgKiBUaGUgbGFzdCBhcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIHRoZSBrZXl3b3JkIGFyZ3VtZW50cy5cbiAgICovXG4gIGNhbGxLd2FyZ3MoLi4uanNhcmdzKSB7XG4gICAgaWYgKGpzYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgIFwiY2FsbEt3YXJncyByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQgKHRoZSBrZXkgd29yZCBhcmd1bWVudCBvYmplY3QpXCJcbiAgICAgICk7XG4gICAgfVxuICAgIGxldCBrd2FyZ3MgPSBqc2FyZ3NbanNhcmdzLmxlbmd0aCAtIDFdO1xuICAgIGlmIChcbiAgICAgIGt3YXJncy5jb25zdHJ1Y3RvciAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBrd2FyZ3MuY29uc3RydWN0b3IubmFtZSAhPT0gXCJPYmplY3RcIlxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImt3YXJncyBhcmd1bWVudCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gTW9kdWxlLmNhbGxQeU9iamVjdEt3YXJncyhfZ2V0UHRyKHRoaXMpLCAuLi5qc2FyZ3MpO1xuICB9XG59XG5QeVByb3h5Q2FsbGFibGVNZXRob2RzLnByb3RvdHlwZS5wcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbmxldCB0eXBlX3RvX2FycmF5X21hcCA9IG5ldyBNYXAoW1xuICBbXCJpOFwiLCBJbnQ4QXJyYXldLFxuICBbXCJ1OFwiLCBVaW50OEFycmF5XSxcbiAgW1widThjbGFtcGVkXCIsIFVpbnQ4Q2xhbXBlZEFycmF5XSxcbiAgW1wiaTE2XCIsIEludDE2QXJyYXldLFxuICBbXCJ1MTZcIiwgVWludDE2QXJyYXldLFxuICBbXCJpMzJcIiwgSW50MzJBcnJheV0sXG4gIFtcInUzMlwiLCBVaW50MzJBcnJheV0sXG4gIFtcImkzMlwiLCBJbnQzMkFycmF5XSxcbiAgW1widTMyXCIsIFVpbnQzMkFycmF5XSxcbiAgLy8gaWYgdGhlc2UgYXJlbid0IGF2YWlsYWJsZSwgd2lsbCBiZSBnbG9iYWxUaGlzLkJpZ0ludDY0QXJyYXkgd2lsbCBiZVxuICAvLyB1bmRlZmluZWQgcmF0aGVyIHRoYW4gcmFpc2luZyBhIFJlZmVyZW5jZUVycm9yLlxuICBbXCJpNjRcIiwgZ2xvYmFsVGhpcy5CaWdJbnQ2NEFycmF5XSxcbiAgW1widTY0XCIsIGdsb2JhbFRoaXMuQmlnVWludDY0QXJyYXldLFxuICBbXCJmMzJcIiwgRmxvYXQzMkFycmF5XSxcbiAgW1wiZjY0XCIsIEZsb2F0NjRBcnJheV0sXG4gIFtcImRhdGF2aWV3XCIsIERhdGFWaWV3XSxcbl0pO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQeVByb3h5ICYgUHlQcm94eUJ1ZmZlck1ldGhvZHN9IFB5UHJveHlCdWZmZXJcbiAqL1xuY2xhc3MgUHlQcm94eUJ1ZmZlck1ldGhvZHMge1xuICAvKipcbiAgICogR2V0IGEgdmlldyBvZiB0aGUgYnVmZmVyIGRhdGEgd2hpY2ggaXMgdXNhYmxlIGZyb20gSmF2YVNjcmlwdC4gTm8gY29weSBpc1xuICAgKiBldmVyIHBlcmZvcm1lZC5cbiAgICpcbiAgICogUHJlc2VudCBvbmx5IGlmIHRoZSBwcm94aWVkIFB5dGhvbiBvYmplY3Qgc3VwcG9ydHMgdGhlIGBQeXRob24gQnVmZmVyXG4gICAqIFByb3RvY29sIDxodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2MtYXBpL2J1ZmZlci5odG1sPmBfLlxuICAgKlxuICAgKiBXZSBkbyBub3Qgc3VwcG9ydCBzdWJvZmZzZXRzLCBpZiB0aGUgYnVmZmVyIHJlcXVpcmVzIHN1Ym9mZnNldHMgd2Ugd2lsbFxuICAgKiB0aHJvdyBhbiBlcnJvci4gSmF2YVNjcmlwdCBuZCBhcnJheSBsaWJyYXJpZXMgY2FuJ3QgaGFuZGxlIHN1Ym9mZnNldHNcbiAgICogYW55d2F5cy4gSW4gdGhpcyBjYXNlLCB5b3Ugc2hvdWxkIHVzZSB0aGUgOmFueTpgdG9Kc2AgYXBpIG9yIGNvcHkgdGhlXG4gICAqIGJ1ZmZlciB0byBvbmUgdGhhdCBkb2Vzbid0IHVzZSBzdWJvZmZldHMgKHVzaW5nIGUuZy4sXG4gICAqIGBudW1weS5hc2NvbnRpZ3VvdXNhcnJheVxuICAgKiA8aHR0cHM6Ly9udW1weS5vcmcvZG9jL3N0YWJsZS9yZWZlcmVuY2UvZ2VuZXJhdGVkL251bXB5LmFzY29udGlndW91c2FycmF5Lmh0bWw+YF8pLlxuICAgKlxuICAgKiBJZiB0aGUgYnVmZmVyIHN0b3JlcyBiaWcgZW5kaWFuIGRhdGEgb3IgaGFsZiBmbG9hdHMsIHRoaXMgZnVuY3Rpb24gd2lsbFxuICAgKiBmYWlsIHdpdGhvdXQgYW4gZXhwbGljaXQgdHlwZSBhcmd1bWVudC4gRm9yIGJpZyBlbmRpYW4gZGF0YSB5b3UgY2FuIHVzZVxuICAgKiBgYHRvSnNgYC4gYERhdGFWaWV3c1xuICAgKiA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0YVZpZXc+YF9cbiAgICogaGF2ZSBzdXBwb3J0IGZvciBiaWcgZW5kaWFuIGRhdGEsIHNvIHlvdSBtaWdodCB3YW50IHRvIHBhc3NcbiAgICogYGAnZGF0YXZpZXcnYGAgYXMgdGhlIHR5cGUgYXJndW1lbnQgaW4gdGhhdCBjYXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IFt0eXBlXSBUaGUgdHlwZSBvZiB0aGUgOmFueTpgUHlCdWZmZXIuZGF0YSA8cHlvZGlkZS5QeUJ1ZmZlci5kYXRhPmAgZmllbGQgaW4gdGhlXG4gICAqIG91dHB1dC4gU2hvdWxkIGJlIG9uZSBvZjogYGBcImk4XCJgYCwgYGBcInU4XCJgYCwgYGBcInU4Y2xhbXBlZFwiYGAsIGBgXCJpMTZcImBgLFxuICAgKiBgYFwidTE2XCJgYCwgYGBcImkzMlwiYGAsIGBgXCJ1MzJcImBgLCBgYFwiaTMyXCJgYCwgYGBcInUzMlwiYGAsIGBgXCJpNjRcImBgLFxuICAgKiBgYFwidTY0XCJgYCwgYGBcImYzMlwiYGAsIGBgXCJmNjRgYCwgb3IgYGBcImRhdGF2aWV3XCJgYC4gVGhpcyBhcmd1bWVudCBpc1xuICAgKiBvcHRpb25hbCwgaWYgYWJzZW50IGBgZ2V0QnVmZmVyYGAgd2lsbCB0cnkgdG8gZGV0ZXJtaW5lIHRoZSBhcHByb3ByaWF0ZVxuICAgKiBvdXRwdXQgdHlwZSBiYXNlZCBvbiB0aGUgYnVmZmVyIGBmb3JtYXQgc3RyaW5nXG4gICAqIDxodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvc3RydWN0Lmh0bWwjZm9ybWF0LXN0cmluZ3M+YF8uXG4gICAqIEByZXR1cm5zIHtQeUJ1ZmZlcn0gOmFueTpgUHlCdWZmZXIgPHB5b2RpZGUuUHlCdWZmZXI+YFxuICAgKi9cbiAgZ2V0QnVmZmVyKHR5cGUpIHtcbiAgICBsZXQgQXJyYXlUeXBlID0gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlKSB7XG4gICAgICBBcnJheVR5cGUgPSB0eXBlX3RvX2FycmF5X21hcC5nZXQodHlwZSk7XG4gICAgICBpZiAoQXJyYXlUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHR5cGUgJHt0eXBlfWApO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgSEVBUFUzMiA9IE1vZHVsZS5IRUFQVTMyO1xuICAgIGxldCBvcmlnX3N0YWNrX3B0ciA9IE1vZHVsZS5zdGFja1NhdmUoKTtcbiAgICBsZXQgYnVmZmVyX3N0cnVjdF9wdHIgPSBNb2R1bGUuc3RhY2tBbGxvYyhcbiAgICAgIEhFQVBVMzJbKE1vZHVsZS5fYnVmZmVyX3N0cnVjdF9zaXplID4+IDIpICsgMF1cbiAgICApO1xuICAgIGxldCB0aGlzX3B0ciA9IF9nZXRQdHIodGhpcyk7XG4gICAgbGV0IGVycmNvZGU7XG4gICAgdHJ5IHtcbiAgICAgIGVycmNvZGUgPSBNb2R1bGUuX19weXByb3h5X2dldF9idWZmZXIoYnVmZmVyX3N0cnVjdF9wdHIsIHRoaXNfcHRyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfVxuICAgIGlmIChlcnJjb2RlID09PSAtMSkge1xuICAgICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGhhcyB0byBtYXRjaCB0aGUgZmllbGRzIGluIGJ1ZmZlcl9zdHJ1Y3RcbiAgICBsZXQgc3RhcnRCeXRlT2Zmc2V0ID0gSEVBUFUzMlsoYnVmZmVyX3N0cnVjdF9wdHIgPj4gMikgKyAwXTtcbiAgICBsZXQgbWluQnl0ZU9mZnNldCA9IEhFQVBVMzJbKGJ1ZmZlcl9zdHJ1Y3RfcHRyID4+IDIpICsgMV07XG4gICAgbGV0IG1heEJ5dGVPZmZzZXQgPSBIRUFQVTMyWyhidWZmZXJfc3RydWN0X3B0ciA+PiAyKSArIDJdO1xuXG4gICAgbGV0IHJlYWRvbmx5ID0gISFIRUFQVTMyWyhidWZmZXJfc3RydWN0X3B0ciA+PiAyKSArIDNdO1xuICAgIGxldCBmb3JtYXRfcHRyID0gSEVBUFUzMlsoYnVmZmVyX3N0cnVjdF9wdHIgPj4gMikgKyA0XTtcbiAgICBsZXQgaXRlbXNpemUgPSBIRUFQVTMyWyhidWZmZXJfc3RydWN0X3B0ciA+PiAyKSArIDVdO1xuICAgIGxldCBzaGFwZSA9IE1vZHVsZS5oaXdpcmUucG9wX3ZhbHVlKEhFQVBVMzJbKGJ1ZmZlcl9zdHJ1Y3RfcHRyID4+IDIpICsgNl0pO1xuICAgIGxldCBzdHJpZGVzID0gTW9kdWxlLmhpd2lyZS5wb3BfdmFsdWUoSEVBUFUzMlsoYnVmZmVyX3N0cnVjdF9wdHIgPj4gMikgKyA3XSk7XG5cbiAgICBsZXQgdmlld19wdHIgPSBIRUFQVTMyWyhidWZmZXJfc3RydWN0X3B0ciA+PiAyKSArIDhdO1xuICAgIGxldCBjX2NvbnRpZ3VvdXMgPSAhIUhFQVBVMzJbKGJ1ZmZlcl9zdHJ1Y3RfcHRyID4+IDIpICsgOV07XG4gICAgbGV0IGZfY29udGlndW91cyA9ICEhSEVBUFUzMlsoYnVmZmVyX3N0cnVjdF9wdHIgPj4gMikgKyAxMF07XG5cbiAgICBsZXQgZm9ybWF0ID0gTW9kdWxlLlVURjhUb1N0cmluZyhmb3JtYXRfcHRyKTtcbiAgICBNb2R1bGUuc3RhY2tSZXN0b3JlKG9yaWdfc3RhY2tfcHRyKTtcblxuICAgIGxldCBzdWNjZXNzID0gKCEhMCk7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBiaWdFbmRpYW4gPSAoISEwKTtcbiAgICAgIGlmIChBcnJheVR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBbQXJyYXlUeXBlLCBiaWdFbmRpYW5dID0gTW9kdWxlLnByb2Nlc3NCdWZmZXJGb3JtYXRTdHJpbmcoXG4gICAgICAgICAgZm9ybWF0LFxuICAgICAgICAgIFwiIEluIHRoaXMgY2FzZSwgeW91IGNhbiBwYXNzIGFuIGV4cGxpY2l0IHR5cGUgYXJndW1lbnQuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGxldCBhbGlnbm1lbnQgPSBwYXJzZUludChBcnJheVR5cGUubmFtZS5yZXBsYWNlKC9bXjAtOV0vZywgXCJcIikpIC8gOCB8fCAxO1xuICAgICAgaWYgKGJpZ0VuZGlhbiAmJiBhbGlnbm1lbnQgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkphdmFzY3JpcHQgaGFzIG5vIG5hdGl2ZSBzdXBwb3J0IGZvciBiaWcgZW5kaWFuIGJ1ZmZlcnMuIFwiICtcbiAgICAgICAgICAgIFwiSW4gdGhpcyBjYXNlLCB5b3UgY2FuIHBhc3MgYW4gZXhwbGljaXQgdHlwZSBhcmd1bWVudC4gXCIgK1xuICAgICAgICAgICAgXCJGb3IgaW5zdGFuY2UsIGBnZXRCdWZmZXIoJ2RhdGF2aWV3JylgIHdpbGwgcmV0dXJuIGEgYERhdGFWaWV3YFwiICtcbiAgICAgICAgICAgIFwid2hpY2ggaGFzIG5hdGl2ZSBzdXBwb3J0IGZvciByZWFkaW5nIGJpZyBlbmRpYW4gZGF0YS4gXCIgK1xuICAgICAgICAgICAgXCJBbHRlcm5hdGl2ZWx5LCB0b0pzIHdpbGwgYXV0b21hdGljYWxseSBjb252ZXJ0IHRoZSBidWZmZXIgXCIgK1xuICAgICAgICAgICAgXCJ0byBsaXR0bGUgZW5kaWFuLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBsZXQgbnVtQnl0ZXMgPSBtYXhCeXRlT2Zmc2V0IC0gbWluQnl0ZU9mZnNldDtcbiAgICAgIGlmIChcbiAgICAgICAgbnVtQnl0ZXMgIT09IDAgJiZcbiAgICAgICAgKHN0YXJ0Qnl0ZU9mZnNldCAlIGFsaWdubWVudCAhPT0gMCB8fFxuICAgICAgICAgIG1pbkJ5dGVPZmZzZXQgJSBhbGlnbm1lbnQgIT09IDAgfHxcbiAgICAgICAgICBtYXhCeXRlT2Zmc2V0ICUgYWxpZ25tZW50ICE9PSAwKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQnVmZmVyIGRvZXMgbm90IGhhdmUgdmFsaWQgYWxpZ25tZW50IGZvciBhICR7QXJyYXlUeXBlLm5hbWV9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgbGV0IG51bUVudHJpZXMgPSBudW1CeXRlcyAvIGFsaWdubWVudDtcbiAgICAgIGxldCBvZmZzZXQgPSAoc3RhcnRCeXRlT2Zmc2V0IC0gbWluQnl0ZU9mZnNldCkgLyBhbGlnbm1lbnQ7XG4gICAgICBsZXQgZGF0YTtcbiAgICAgIGlmIChudW1CeXRlcyA9PT0gMCkge1xuICAgICAgICBkYXRhID0gbmV3IEFycmF5VHlwZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IG5ldyBBcnJheVR5cGUoSEVBUFUzMi5idWZmZXIsIG1pbkJ5dGVPZmZzZXQsIG51bUVudHJpZXMpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSBvZiBzdHJpZGVzLmtleXMoKSkge1xuICAgICAgICBzdHJpZGVzW2ldIC89IGFsaWdubWVudDtcbiAgICAgIH1cblxuICAgICAgc3VjY2VzcyA9ICghITEpO1xuICAgICAgbGV0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUoXG4gICAgICAgIFB5QnVmZmVyLnByb3RvdHlwZSxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoe1xuICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICByZWFkb25seSxcbiAgICAgICAgICBmb3JtYXQsXG4gICAgICAgICAgaXRlbXNpemUsXG4gICAgICAgICAgbmRpbTogc2hhcGUubGVuZ3RoLFxuICAgICAgICAgIG5ieXRlczogbnVtQnl0ZXMsXG4gICAgICAgICAgc2hhcGUsXG4gICAgICAgICAgc3RyaWRlcyxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGNfY29udGlndW91cyxcbiAgICAgICAgICBmX2NvbnRpZ3VvdXMsXG4gICAgICAgICAgX3ZpZXdfcHRyOiB2aWV3X3B0cixcbiAgICAgICAgICBfcmVsZWFzZWQ6ICghITApLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICAgIC8vIE1vZHVsZS5idWZmZXJGaW5hbGl6YXRpb25SZWdpc3RyeS5yZWdpc3RlcihyZXN1bHQsIHZpZXdfcHRyLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgTW9kdWxlLl9QeUJ1ZmZlcl9SZWxlYXNlKHZpZXdfcHRyKTtcbiAgICAgICAgICBNb2R1bGUuX1B5TWVtX0ZyZWUodmlld19wdHIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgTW9kdWxlLmZhdGFsX2Vycm9yKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYge0ludDhBcnJheSB8IFVpbnQ4QXJyYXkgfCBJbnQxNkFycmF5IHwgVWludDE2QXJyYXkgfCBJbnQzMkFycmF5IHwgVWludDMyQXJyYXkgfCBVaW50OENsYW1wZWRBcnJheSB8IEZsb2F0MzJBcnJheSB8IEZsb2F0NjRBcnJheX0gVHlwZWRBcnJheTtcbiAqL1xuXG4vKipcbiAqIEEgY2xhc3MgdG8gYWxsb3cgYWNjZXNzIHRvIGEgUHl0aG9uIGRhdGEgYnVmZmVycyBmcm9tIEphdmFTY3JpcHQuIFRoZXNlIGFyZVxuICogcHJvZHVjZWQgYnkgOmFueTpgUHlQcm94eS5nZXRCdWZmZXJgIGFuZCBjYW5ub3QgYmUgY29uc3RydWN0ZWQgZGlyZWN0bHkuXG4gKiBXaGVuIHlvdSBhcmUgZG9uZSwgcmVsZWFzZSBpdCB3aXRoIHRoZSA6YW55OmByZWxlYXNlIDxQeUJ1ZmZlci5yZWxlYXNlPmBcbiAqIG1ldGhvZC4gIFNlZVxuICogYFB5dGhvbiBidWZmZXIgcHJvdG9jb2wgZG9jdW1lbnRhdGlvblxuICogPGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvYy1hcGkvYnVmZmVyLmh0bWw+YF8gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogVG8gZmluZCB0aGUgZWxlbWVudCBgYHhbYV8xLCAuLi4sIGFfbl1gYCwgeW91IGNvdWxkIHVzZSB0aGUgZm9sbG93aW5nIGNvZGU6XG4gKlxuICogLi4gY29kZS1ibG9jazo6IGpzXG4gKlxuICogICAgZnVuY3Rpb24gbXVsdGlJbmRleFRvSW5kZXgocHlidWZmLCBtdWx0aUluZGV4KXtcbiAqICAgICAgIGlmKG11bHRpbmRleC5sZW5ndGggIT09cHlidWZmLm5kaW0pe1xuICogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV3JvbmcgbGVuZ3RoIGluZGV4XCIpO1xuICogICAgICAgfVxuICogICAgICAgbGV0IGlkeCA9IHB5YnVmZi5vZmZzZXQ7XG4gKiAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcHlidWZmLm5kaW07IGkrKyl7XG4gKiAgICAgICAgICBpZihtdWx0aUluZGV4W2ldIDwgMCl7XG4gKiAgICAgICAgICAgICBtdWx0aUluZGV4W2ldID0gcHlidWZmLnNoYXBlW2ldIC0gbXVsdGlJbmRleFtpXTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICAgIGlmKG11bHRpSW5kZXhbaV0gPCAwIHx8IG11bHRpSW5kZXhbaV0gPj0gcHlidWZmLnNoYXBlW2ldKXtcbiAqICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZGV4IG91dCBvZiByYW5nZVwiKTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICAgIGlkeCArPSBtdWx0aUluZGV4W2ldICogcHlidWZmLnN0cmlkZVtpXTtcbiAqICAgICAgIH1cbiAqICAgICAgIHJldHVybiBpZHg7XG4gKiAgICB9XG4gKiAgICBjb25zb2xlLmxvZyhcImVudHJ5IGlzXCIsIHB5YnVmZi5kYXRhW211bHRpSW5kZXhUb0luZGV4KHB5YnVmZiwgWzIsIDAsIC0xXSldKTtcbiAqXG4gKiAuLiBhZG1vbml0aW9uOjogQ29udGlndWl0eVxuICogICAgOmNsYXNzOiB3YXJuaW5nXG4gKlxuICogICAgSWYgdGhlIGJ1ZmZlciBpcyBub3QgY29udGlndW91cywgdGhlIGBgZGF0YWBgIFR5cGVkQXJyYXkgd2lsbCBjb250YWluXG4gKiAgICBkYXRhIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIGJ1ZmZlci4gTW9kaWZ5aW5nIHRoaXMgZGF0YSBtYXkgbGVhZCB0b1xuICogICAgdW5kZWZpbmVkIGJlaGF2aW9yLlxuICpcbiAqIC4uIGFkbW9uaXRpb246OiBSZWFkb25seSBidWZmZXJzXG4gKiAgICA6Y2xhc3M6IHdhcm5pbmdcbiAqXG4gKiAgICBJZiBgYGJ1ZmZlci5yZWFkb25seWBgIGlzIGBgdHJ1ZWBgLCB5b3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIGJ1ZmZlci5cbiAqICAgIE1vZGlmeWluZyBhIHJlYWRvbmx5IGJ1ZmZlciBtYXkgbGVhZCB0byB1bmRlZmluZWQgYmVoYXZpb3IuXG4gKlxuICogLi4gYWRtb25pdGlvbjo6IENvbnZlcnRpbmcgYmV0d2VlbiBUeXBlZEFycmF5IHR5cGVzXG4gKiAgICA6Y2xhc3M6IHdhcm5pbmdcbiAqXG4gKiAgICBUaGUgZm9sbG93aW5nIG5haXZlIGNvZGUgdG8gY2hhbmdlIHRoZSB0eXBlIG9mIGEgdHlwZWQgYXJyYXkgZG9lcyBub3RcbiAqICAgIHdvcms6XG4gKlxuICogICAgLi4gY29kZS1ibG9jazo6IGpzXG4gKlxuICogICAgICAgIC8vIEluY29ycmVjdGx5IGNvbnZlcnQgYSBUeXBlZEFycmF5LlxuICogICAgICAgIC8vIFByb2R1Y2VzIGEgVWludDE2QXJyYXkgdGhhdCBwb2ludHMgdG8gdGhlIGVudGlyZSBXQVNNIG1lbW9yeSFcbiAqICAgICAgICBsZXQgbXlhcnJheSA9IG5ldyBVaW50MTZBcnJheShidWZmZXIuZGF0YS5idWZmZXIpO1xuICpcbiAqICAgIEluc3RlYWQsIGlmIHlvdSB3YW50IHRvIGNvbnZlcnQgdGhlIG91dHB1dCBUeXBlZEFycmF5LCB5b3UgbmVlZCB0byBzYXk6XG4gKlxuICogICAgLi4gY29kZS1ibG9jazo6IGpzXG4gKlxuICogICAgICAgIC8vIENvcnJlY3RseSBjb252ZXJ0IGEgVHlwZWRBcnJheS5cbiAqICAgICAgICBsZXQgbXlhcnJheSA9IG5ldyBVaW50MTZBcnJheShcbiAqICAgICAgICAgICAgYnVmZmVyLmRhdGEuYnVmZmVyLFxuICogICAgICAgICAgICBidWZmZXIuZGF0YS5ieXRlT2Zmc2V0LFxuICogICAgICAgICAgICBidWZmZXIuZGF0YS5ieXRlTGVuZ3RoXG4gKiAgICAgICAgKTtcbiAqL1xuZXhwb3J0IGNsYXNzIFB5QnVmZmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogVGhlIG9mZnNldCBvZiB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBGb3IgaW5zdGFuY2UgaWYgb3VyIGFycmF5XG4gICAgICogaXMgM2QsIHRoZW4geW91IHdpbGwgZmluZCBgYGFycmF5WzAsMCwwXWBgIGF0XG4gICAgICogYGBweWJ1Zi5kYXRhW3B5YnVmLm9mZnNldF1gYFxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5vZmZzZXQ7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZGF0YSBpcyByZWFkb25seSwgeW91IHNob3VsZCBub3QgbW9kaWZ5IGl0LiBUaGVyZSBpcyBubyB3YXlcbiAgICAgKiBmb3IgdXMgdG8gZW5mb3JjZSB0aGlzLCBidXQgaXQgbWF5IGNhdXNlIHZlcnkgd2VpcmQgYmVoYXZpb3IuXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5yZWFkb25seTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBmb3JtYXQgc3RyaW5nIGZvciB0aGUgYnVmZmVyLiBTZWUgYHRoZSBQeXRob24gZG9jdW1lbnRhdGlvbiBvblxuICAgICAqIGZvcm1hdCBzdHJpbmdzXG4gICAgICogPGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvbGlicmFyeS9zdHJ1Y3QuaHRtbCNmb3JtYXQtc3RyaW5ncz5gXy5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZm9ybWF0O1xuXG4gICAgLyoqXG4gICAgICogSG93IGxhcmdlIGlzIGVhY2ggZW50cnkgKGluIGJ5dGVzKT9cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaXRlbXNpemU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIGRpbWVuc2lvbnMgb2YgdGhlIGJ1ZmZlci4gSWYgYGBuZGltYGAgaXMgMCwgdGhlIGJ1ZmZlclxuICAgICAqIHJlcHJlc2VudHMgYSBzaW5nbGUgc2NhbGFyIG9yIHN0cnVjdC4gT3RoZXJ3aXNlLCBpdCByZXByZXNlbnRzIGFuXG4gICAgICogYXJyYXkuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm5kaW07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIHRoZSBidWZmZXIgdGFrZXMgdXAuIFRoaXMgaXMgZXF1YWwgdG9cbiAgICAgKiBgYGJ1ZmYuZGF0YS5ieXRlTGVuZ3RoYGAuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm5ieXRlcztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzaGFwZSBvZiB0aGUgYnVmZmVyLCB0aGF0IGlzIGhvdyBsb25nIGl0IGlzIGluIGVhY2ggZGltZW5zaW9uLlxuICAgICAqIFRoZSBsZW5ndGggd2lsbCBiZSBlcXVhbCB0byBgYG5kaW1gYC4gRm9yIGluc3RhbmNlLCBhIDJ4M3g0IGFycmF5XG4gICAgICogd291bGQgaGF2ZSBzaGFwZSBgYFsyLCAzLCA0XWBgLlxuICAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlO1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2Ygb2YgbGVuZ3RoIGBgbmRpbWBgIGdpdmluZyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXBcbiAgICAgKiB0byBnZXQgdG8gYSBuZXcgZWxlbWVudCBpbiBlYWNoIGRpbWVuc2lvbi4gU2VlIHRoZSBleGFtcGxlIGRlZmluaXRpb25cbiAgICAgKiBvZiBhIGBgbXVsdGlJbmRleFRvSW5kZXhgYCBmdW5jdGlvbiBhYm92ZS5cbiAgICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgICovXG4gICAgdGhpcy5zdHJpZGVzO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFjdHVhbCBkYXRhLiBBIHR5cGVkIGFycmF5IG9mIGFuIGFwcHJvcHJpYXRlIHNpemUgYmFja2VkIGJ5IGFcbiAgICAgKiBzZWdtZW50IG9mIHRoZSBXQVNNIG1lbW9yeS5cbiAgICAgKlxuICAgICAqIFRoZSBgYHR5cGVgYCBhcmd1bWVudCBvZiA6YW55OmBQeVByb3h5LmdldEJ1ZmZlcmBcbiAgICAgKiBkZXRlcm1pbmVzIHdoaWNoIHNvcnQgb2YgYGBUeXBlZEFycmF5YGAgdGhpcyBpcy4gQnkgZGVmYXVsdFxuICAgICAqIDphbnk6YFB5UHJveHkuZ2V0QnVmZmVyYCB3aWxsIGxvb2sgYXQgdGhlIGZvcm1hdCBzdHJpbmcgdG8gZGV0ZXJtaW5lIHRoZSBtb3N0XG4gICAgICogYXBwcm9wcmlhdGUgb3B0aW9uLlxuICAgICAqIEB0eXBlIHtUeXBlZEFycmF5fVxuICAgICAqL1xuICAgIHRoaXMuZGF0YTtcblxuICAgIC8qKlxuICAgICAqIElzIGl0IEMgY29udGlndW91cz9cbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmNfY29udGlndW91cztcblxuICAgIC8qKlxuICAgICAqIElzIGl0IEZvcnRyYW4gY29udGlndW91cz9cbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmZfY29udGlndW91cztcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHlCdWZmZXIgaXMgbm90IGEgY29uc3RydWN0b3JcIik7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZSB0aGUgYnVmZmVyLiBUaGlzIGFsbG93cyB0aGUgbWVtb3J5IHRvIGJlIHJlY2xhaW1lZC5cbiAgICovXG4gIHJlbGVhc2UoKSB7XG4gICAgaWYgKHRoaXMuX3JlbGVhc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIE1vZHVsZS5idWZmZXJGaW5hbGl6YXRpb25SZWdpc3RyeS51bnJlZ2lzdGVyKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBNb2R1bGUuX1B5QnVmZmVyX1JlbGVhc2UodGhpcy5fdmlld19wdHIpO1xuICAgICAgTW9kdWxlLl9QeU1lbV9GcmVlKHRoaXMuX3ZpZXdfcHRyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBNb2R1bGUuZmF0YWxfZXJyb3IoZSk7XG4gICAgfVxuICAgIHRoaXMuX3JlbGVhc2VkID0gKCEhMSk7XG4gICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgfVxufVxuIiwgImltcG9ydCB7IE1vZHVsZSB9IGZyb20gXCIuL21vZHVsZS5qc1wiO1xuaW1wb3J0IHsgbG9hZFBhY2thZ2UsIGxvYWRlZFBhY2thZ2VzIH0gZnJvbSBcIi4vbG9hZC1weW9kaWRlLmpzXCI7XG5pbXBvcnQgeyBpc1B5UHJveHksIFB5QnVmZmVyIH0gZnJvbSBcIi4vcHlwcm94eS5nZW4uanNcIjtcbmV4cG9ydCB7IGxvYWRQYWNrYWdlLCBsb2FkZWRQYWNrYWdlcywgaXNQeVByb3h5IH07XG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5MkpzUmVzdWx0fSBQeTJKc1Jlc3VsdFxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHl9IFB5UHJveHlcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcHlwcm94eS5nZW4nKS5UeXBlZEFycmF5fSBUeXBlZEFycmF5XG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdlbXNjcmlwdGVuJyl9IEVtc2NyaXB0ZW5cbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ2Vtc2NyaXB0ZW4nKS5Nb2R1bGUuRlN9IEZTXG4gKi9cblxuLyoqXG4gKiBBbiBhbGlhcyB0byB0aGUgUHl0aG9uIDpweTptb2Q6YHB5b2RpZGVgIHBhY2thZ2UuXG4gKlxuICogWW91IGNhbiB1c2UgdGhpcyB0byBjYWxsIGZ1bmN0aW9ucyBkZWZpbmVkIGluIHRoZSBQeW9kaWRlIFB5dGhvbiBwYWNrYWdlXG4gKiBmcm9tIEphdmFTY3JpcHQuXG4gKlxuICogQHR5cGUge1B5UHJveHl9XG4gKi9cbmxldCBweW9kaWRlX3B5ID0ge307IC8vIGFjdHVhbGx5IGRlZmluZWQgaW4gbG9hZFB5b2RpZGUgKHNlZSBweW9kaWRlLmpzKVxuXG4vKipcbiAqXG4gKiBBbiBhbGlhcyB0byB0aGUgZ2xvYmFsIFB5dGhvbiBuYW1lc3BhY2UuXG4gKlxuICogRm9yIGV4YW1wbGUsIHRvIGFjY2VzcyBhIHZhcmlhYmxlIGNhbGxlZCBgYGZvb2BgIGluIHRoZSBQeXRob24gZ2xvYmFsXG4gKiBzY29wZSwgdXNlIGBgcHlvZGlkZS5nbG9iYWxzLmdldChcImZvb1wiKWBgXG4gKlxuICogQHR5cGUge1B5UHJveHl9XG4gKi9cbmxldCBnbG9iYWxzID0ge307IC8vIGFjdHVhbGx5IGRlZmluZWQgaW4gbG9hZFB5b2RpZGUgKHNlZSBweW9kaWRlLmpzKVxuXG4vKipcbiAqIEEgSmF2YVNjcmlwdCBlcnJvciBjYXVzZWQgYnkgYSBQeXRob24gZXhjZXB0aW9uLlxuICpcbiAqIEluIG9yZGVyIHRvIHJlZHVjZSB0aGUgcmlzayBvZiBsYXJnZSBtZW1vcnkgbGVha3MsIHRoZSBgYFB5dGhvbkVycm9yYGBcbiAqIGNvbnRhaW5zIG5vIHJlZmVyZW5jZSB0byB0aGUgUHl0aG9uIGV4Y2VwdGlvbiB0aGF0IGNhdXNlZCBpdC4gWW91IGNhbiBmaW5kXG4gKiB0aGUgYWN0dWFsIFB5dGhvbiBleGNlcHRpb24gdGhhdCBjYXVzZWQgdGhpcyBlcnJvciBhcyBgc3lzLmxhc3RfdmFsdWVcbiAqIDxodHRwczovL2RvY3MucHl0aG9uLm9yZy8zL2xpYnJhcnkvc3lzLmh0bWwjc3lzLmxhc3RfdmFsdWU+YF8uXG4gKlxuICogU2VlIDpyZWY6YHR5cGUtdHJhbnNsYXRpb25zLWVycm9yc2AgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogLi4gYWRtb25pdGlvbjo6IEF2b2lkIFN0YWNrIEZyYW1lc1xuICogICAgOmNsYXNzOiB3YXJuaW5nXG4gKlxuICogICAgSWYgeW91IG1ha2UgYSA6YW55OmBQeVByb3h5YCBvZiBgYHN5cy5sYXN0X3ZhbHVlYGAsIHlvdSBzaG91bGQgYmVcbiAqICAgIGVzcGVjaWFsbHkgY2FyZWZ1bCB0byA6YW55OmBkZXN0cm95KCkgPFB5UHJveHkuZGVzdHJveT5gIGl0IHdoZW4geW91IGFyZVxuICogICAgZG9uZS4gWW91IG1heSBsZWFrIGEgbGFyZ2UgYW1vdW50IG9mIG1lbW9yeSBpbmNsdWRpbmcgdGhlIGxvY2FsXG4gKiAgICB2YXJpYWJsZXMgb2YgYWxsIHRoZSBzdGFjayBmcmFtZXMgaW4gdGhlIHRyYWNlYmFjayBpZiB5b3UgZG9uJ3QuIFRoZVxuICogICAgZWFzaWVzdCB3YXkgaXMgdG8gb25seSBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBpbiBQeXRob24uXG4gKlxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBQeXRob25FcnJvciB7XG4gIC8vIGFjdHVhbGx5IGRlZmluZWQgaW4gZXJyb3JfaGFuZGxpbmcuYy4gVE9ETzogd291bGQgYmUgZ29vZCB0byBtb3ZlIHRoaXNcbiAgLy8gZG9jdW1lbnRhdGlvbiBhbmQgdGhlIGRlZmluaXRpb24gb2YgUHl0aG9uRXJyb3IgdG8gZXJyb3JfaGFuZGxpbmcuanNcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogVGhlIFB5dGhvbiB0cmFjZWJhY2suXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm1lc3NhZ2U7XG4gIH1cbn1cblxuLyoqXG4gKlxuICogVGhlIFB5b2RpZGUgdmVyc2lvbi5cbiAqXG4gKiBJdCBjYW4gYmUgZWl0aGVyIHRoZSBleGFjdCByZWxlYXNlIHZlcnNpb24gKGUuZy4gYGAwLjEuMGBgKSwgb3JcbiAqIHRoZSBsYXRlc3QgcmVsZWFzZSB2ZXJzaW9uIGZvbGxvd2VkIGJ5IHRoZSBudW1iZXIgb2YgY29tbWl0cyBzaW5jZSwgYW5kXG4gKiB0aGUgZ2l0IGhhc2ggb2YgdGhlIGN1cnJlbnQgY29tbWl0IChlLmcuIGBgMC4xLjAtMS1iZDg0NjQ2YGApLlxuICpcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBsZXQgdmVyc2lvbiA9IFwiXCI7IC8vIGFjdHVhbGx5IGRlZmluZWQgaW4gbG9hZFB5b2RpZGUgKHNlZSBweW9kaWRlLmpzKVxuXG4vKipcbiAqIFJ1bnMgYSBzdHJpbmcgb2YgUHl0aG9uIGNvZGUgZnJvbSBKYXZhU2NyaXB0LlxuICpcbiAqIFRoZSBsYXN0IHBhcnQgb2YgdGhlIHN0cmluZyBtYXkgYmUgYW4gZXhwcmVzc2lvbiwgaW4gd2hpY2ggY2FzZSwgaXRzIHZhbHVlXG4gKiBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29kZSBQeXRob24gY29kZSB0byBldmFsdWF0ZVxuICogQHBhcmFtIHtQeVByb3h5PX0gZ2xvYmFscyBBbiBvcHRpb25hbCBQeXRob24gZGljdGlvbmFyeSB0byB1c2UgYXMgdGhlIGdsb2JhbHMuXG4gKiAgICAgICAgRGVmYXVsdHMgdG8gOmFueTpgcHlvZGlkZS5nbG9iYWxzYC4gVXNlcyB0aGUgUHl0aG9uIEFQSVxuICogICAgICAgIDphbnk6YHB5b2RpZGUuZXZhbF9jb2RlYCB0byBldmFsdWF0ZSB0aGUgY29kZS5cbiAqIEByZXR1cm5zIHtQeTJKc1Jlc3VsdH0gVGhlIHJlc3VsdCBvZiB0aGUgUHl0aG9uIGNvZGUgdHJhbnNsYXRlZCB0byBKYXZhU2NyaXB0LiBTZWUgdGhlXG4gKiAgICAgICAgICBkb2N1bWVudGF0aW9uIGZvciA6YW55OmBweW9kaWRlLmV2YWxfY29kZWAgZm9yIG1vcmUgaW5mby5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1blB5dGhvbihjb2RlLCBnbG9iYWxzID0gTW9kdWxlLmdsb2JhbHMpIHtcbiAgcmV0dXJuIE1vZHVsZS5weW9kaWRlX3B5LmV2YWxfY29kZShjb2RlLCBnbG9iYWxzKTtcbn1cbk1vZHVsZS5ydW5QeXRob24gPSBydW5QeXRob247XG5cbi8qKlxuICogQGNhbGxiYWNrIExvZ0ZuXG4gKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBJbnNwZWN0IGEgUHl0aG9uIGNvZGUgY2h1bmsgYW5kIHVzZSA6anM6ZnVuYzpgcHlvZGlkZS5sb2FkUGFja2FnZWAgdG8gaW5zdGFsbFxuICogYW55IGtub3duIHBhY2thZ2VzIHRoYXQgdGhlIGNvZGUgY2h1bmsgaW1wb3J0cy4gVXNlcyB0aGUgUHl0aG9uIEFQSVxuICogOmZ1bmM6YHB5b2RpZGUuZmluZFxcX2ltcG9ydHNgIHRvIGluc3BlY3QgdGhlIGNvZGUuXG4gKlxuICogRm9yIGV4YW1wbGUsIGdpdmVuIHRoZSBmb2xsb3dpbmcgY29kZSBhcyBpbnB1dFxuICpcbiAqIC4uIGNvZGUtYmxvY2s6OiBweXRob25cbiAqXG4gKiAgICBpbXBvcnQgbnVtcHkgYXMgbnAgeCA9IG5wLmFycmF5KFsxLCAyLCAzXSlcbiAqXG4gKiA6anM6ZnVuYzpgbG9hZFBhY2thZ2VzRnJvbUltcG9ydHNgIHdpbGwgY2FsbFxuICogYGBweW9kaWRlLmxvYWRQYWNrYWdlKFsnbnVtcHknXSlgYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29kZSBUaGUgY29kZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtMb2dGbj19IG1lc3NhZ2VDYWxsYmFjayBUaGUgYGBtZXNzYWdlQ2FsbGJhY2tgYCBhcmd1bWVudCBvZlxuICogOmFueTpgcHlvZGlkZS5sb2FkUGFja2FnZWAgKG9wdGlvbmFsKS5cbiAqIEBwYXJhbSB7TG9nRm49fSBlcnJvckNhbGxiYWNrIFRoZSBgYGVycm9yQ2FsbGJhY2tgYCBhcmd1bWVudCBvZlxuICogOmFueTpgcHlvZGlkZS5sb2FkUGFja2FnZWAgKG9wdGlvbmFsKS5cbiAqIEBhc3luY1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFBhY2thZ2VzRnJvbUltcG9ydHMoXG4gIGNvZGUsXG4gIG1lc3NhZ2VDYWxsYmFjayxcbiAgZXJyb3JDYWxsYmFja1xuKSB7XG4gIGxldCBweWltcG9ydHMgPSBNb2R1bGUucHlvZGlkZV9weS5maW5kX2ltcG9ydHMoY29kZSk7XG4gIGxldCBpbXBvcnRzO1xuICB0cnkge1xuICAgIGltcG9ydHMgPSBweWltcG9ydHMudG9KcygpO1xuICB9IGZpbmFsbHkge1xuICAgIHB5aW1wb3J0cy5kZXN0cm95KCk7XG4gIH1cbiAgaWYgKGltcG9ydHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHBhY2thZ2VOYW1lcyA9IE1vZHVsZS5faW1wb3J0X25hbWVfdG9fcGFja2FnZV9uYW1lO1xuICBsZXQgcGFja2FnZXMgPSBuZXcgU2V0KCk7XG4gIGZvciAobGV0IG5hbWUgb2YgaW1wb3J0cykge1xuICAgIGlmIChwYWNrYWdlTmFtZXMuaGFzKG5hbWUpKSB7XG4gICAgICBwYWNrYWdlcy5hZGQocGFja2FnZU5hbWVzLmdldChuYW1lKSk7XG4gICAgfVxuICB9XG4gIGlmIChwYWNrYWdlcy5zaXplKSB7XG4gICAgYXdhaXQgbG9hZFBhY2thZ2UoQXJyYXkuZnJvbShwYWNrYWdlcyksIG1lc3NhZ2VDYWxsYmFjaywgZXJyb3JDYWxsYmFjayk7XG4gIH1cbn1cblxuLyoqXG4gKiBSdW5zIFB5dGhvbiBjb2RlIHVzaW5nIGBQeUNGX0FMTE9XX1RPUF9MRVZFTF9BV0FJVFxuICogPGh0dHBzOi8vZG9jcy5weXRob24ub3JnLzMvbGlicmFyeS9hc3QuaHRtbD9oaWdobGlnaHQ9cHljZl9hbGxvd190b3BfbGV2ZWxfYXdhaXQjYXN0LlB5Q0ZfQUxMT1dfVE9QX0xFVkVMX0FXQUlUPmBfLlxuICpcbiAqIC4uIGFkbW9uaXRpb246OiBQeXRob24gaW1wb3J0c1xuICogICAgOmNsYXNzOiB3YXJuaW5nXG4gKlxuICogICAgU2luY2UgcHlvZGlkZSAwLjE4LjAsIHlvdSBtdXN0IGNhbGwgOmpzOmZ1bmM6YGxvYWRQYWNrYWdlc0Zyb21JbXBvcnRzYCB0b1xuICogICAgaW1wb3J0IGFueSBweXRob24gcGFja2FnZXMgcmVmZXJlbmNlZCB2aWEgYGltcG9ydGAgc3RhdGVtZW50cyBpbiB5b3VyIGNvZGUuXG4gKiAgICBUaGlzIGZ1bmN0aW9uIHdpbGwgbm8gbG9uZ2VyIGRvIGl0IGZvciB5b3UuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogLi4gY29kZS1ibG9jazo6IHB5b2RpZGVcbiAqXG4gKiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgcHlvZGlkZS5ydW5QeXRob25Bc3luYyhgXG4gKiAgICAgICAgZnJvbSBqcyBpbXBvcnQgZmV0Y2hcbiAqICAgICAgICByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiLi9wYWNrYWdlcy5qc29uXCIpXG4gKiAgICAgICAgcGFja2FnZXMgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAqICAgICAgICAjIElmIGZpbmFsIHN0YXRlbWVudCBpcyBhbiBleHByZXNzaW9uLCBpdHMgdmFsdWUgaXMgcmV0dXJuZWQgdG8gSmF2YVNjcmlwdFxuICogICAgICAgIGxlbihwYWNrYWdlcy5wYWNrYWdlcy5vYmplY3Rfa2V5cygpKVxuICogICAgYCk7XG4gKiAgICBjb25zb2xlLmxvZyhyZXN1bHQpOyAvLyA3OVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIFB5dGhvbiBjb2RlIHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0ge1B5UHJveHk9fSBnbG9iYWxzIEFuIG9wdGlvbmFsIFB5dGhvbiBkaWN0aW9uYXJ5IHRvIHVzZSBhcyB0aGUgZ2xvYmFscy5cbiAqICAgICAgICBEZWZhdWx0cyB0byA6YW55OmBweW9kaWRlLmdsb2JhbHNgLiBVc2VzIHRoZSBQeXRob24gQVBJXG4gKiAgICAgICAgOmFueTpgcHlvZGlkZS5ldmFsX2NvZGVfYXN5bmNgIHRvIGV2YWx1YXRlIHRoZSBjb2RlLlxuICogQHJldHVybnMge1B5MkpzUmVzdWx0fSBUaGUgcmVzdWx0IG9mIHRoZSBQeXRob24gY29kZSB0cmFuc2xhdGVkIHRvIEphdmFTY3JpcHQuXG4gKiBAYXN5bmNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blB5dGhvbkFzeW5jKGNvZGUsIGdsb2JhbHMgPSBNb2R1bGUuZ2xvYmFscykge1xuICByZXR1cm4gYXdhaXQgTW9kdWxlLnB5b2RpZGVfcHkuZXZhbF9jb2RlX2FzeW5jKGNvZGUsIGdsb2JhbHMpO1xufVxuTW9kdWxlLnJ1blB5dGhvbkFzeW5jID0gcnVuUHl0aG9uQXN5bmM7XG5cbi8qKlxuICogUmVnaXN0ZXJzIHRoZSBKYXZhU2NyaXB0IG9iamVjdCBgYG1vZHVsZWBgIGFzIGEgSmF2YVNjcmlwdCBtb2R1bGUgbmFtZWRcbiAqIGBgbmFtZWBgLiBUaGlzIG1vZHVsZSBjYW4gdGhlbiBiZSBpbXBvcnRlZCBmcm9tIFB5dGhvbiB1c2luZyB0aGUgc3RhbmRhcmRcbiAqIFB5dGhvbiBpbXBvcnQgc3lzdGVtLiBJZiBhbm90aGVyIG1vZHVsZSBieSB0aGUgc2FtZSBuYW1lIGhhcyBhbHJlYWR5IGJlZW5cbiAqIGltcG9ydGVkLCB0aGlzIHdvbid0IGhhdmUgbXVjaCBlZmZlY3QgdW5sZXNzIHlvdSBhbHNvIGRlbGV0ZSB0aGUgaW1wb3J0ZWRcbiAqIG1vZHVsZSBmcm9tIGBgc3lzLm1vZHVsZXNgYC4gVGhpcyBjYWxscyB0aGUgYGBweW9kaWRlX3B5YGAgQVBJXG4gKiA6ZnVuYzpgcHlvZGlkZS5yZWdpc3Rlcl9qc19tb2R1bGVgLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIEphdmFTY3JpcHQgbW9kdWxlIHRvIGFkZFxuICogQHBhcmFtIHtvYmplY3R9IG1vZHVsZSBKYXZhU2NyaXB0IG9iamVjdCBiYWNraW5nIHRoZSBtb2R1bGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVySnNNb2R1bGUobmFtZSwgbW9kdWxlKSB7XG4gIE1vZHVsZS5weW9kaWRlX3B5LnJlZ2lzdGVyX2pzX21vZHVsZShuYW1lLCBtb2R1bGUpO1xufVxuXG4vKipcbiAqIFRlbGwgUHlvZGlkZSBhYm91dCBDb21saW5rLlxuICogTmVjZXNzYXJ5IHRvIGVuYWJsZSBpbXBvcnRpbmcgQ29tbGluayBwcm94aWVzIGludG8gUHl0aG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21saW5rKENvbWxpbmspIHtcbiAgTW9kdWxlLl9Db21saW5rID0gQ29tbGluaztcbn1cblxuLyoqXG4gKiBVbnJlZ2lzdGVycyBhIEphdmFTY3JpcHQgbW9kdWxlIHdpdGggZ2l2ZW4gbmFtZSB0aGF0IGhhcyBiZWVuIHByZXZpb3VzbHlcbiAqIHJlZ2lzdGVyZWQgd2l0aCA6anM6ZnVuYzpgcHlvZGlkZS5yZWdpc3RlckpzTW9kdWxlYCBvclxuICogOmZ1bmM6YHB5b2RpZGUucmVnaXN0ZXJfanNfbW9kdWxlYC4gSWYgYSBKYXZhU2NyaXB0IG1vZHVsZSB3aXRoIHRoYXQgbmFtZVxuICogZG9lcyBub3QgYWxyZWFkeSBleGlzdCwgd2lsbCB0aHJvdyBhbiBlcnJvci4gTm90ZSB0aGF0IGlmIHRoZSBtb2R1bGUgaGFzXG4gKiBhbHJlYWR5IGJlZW4gaW1wb3J0ZWQsIHRoaXMgd29uJ3QgaGF2ZSBtdWNoIGVmZmVjdCB1bmxlc3MgeW91IGFsc28gZGVsZXRlXG4gKiB0aGUgaW1wb3J0ZWQgbW9kdWxlIGZyb20gYGBzeXMubW9kdWxlc2BgLiBUaGlzIGNhbGxzIHRoZSBgYHB5b2RpZGVfcHlgYCBBUElcbiAqIDpmdW5jOmBweW9kaWRlLnVucmVnaXN0ZXJfanNfbW9kdWxlYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBKYXZhU2NyaXB0IG1vZHVsZSB0byByZW1vdmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJKc01vZHVsZShuYW1lKSB7XG4gIE1vZHVsZS5weW9kaWRlX3B5LnVucmVnaXN0ZXJfanNfbW9kdWxlKG5hbWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIEphdmFTY3JpcHQgb2JqZWN0IHRvIGEgUHl0aG9uIG9iamVjdCBhcyBiZXN0IGFzIHBvc3NpYmxlLlxuICpcbiAqIFRoaXMgaXMgc2ltaWxhciB0byA6YW55OmBKc1Byb3h5LnRvX3B5YCBidXQgZm9yIHVzZSBmcm9tIEphdmFTY3JpcHQuIElmIHRoZVxuICogb2JqZWN0IGlzIGltbXV0YWJsZSBvciBhIDphbnk6YFB5UHJveHlgLCBpdCB3aWxsIGJlIHJldHVybmVkIHVuY2hhbmdlZC4gSWZcbiAqIHRoZSBvYmplY3QgY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIFB5dGhvbiwgaXQgd2lsbCBiZSByZXR1cm5lZCB1bmNoYW5nZWQuXG4gKlxuICogU2VlIDpyZWY6YHR5cGUtdHJhbnNsYXRpb25zLWpzcHJveHktdG8tcHlgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtudW1iZXI9fSBvcHRpb25zLmRlcHRoIE9wdGlvbmFsIGFyZ3VtZW50IHRvIGxpbWl0IHRoZSBkZXB0aCBvZiB0aGVcbiAqIGNvbnZlcnNpb24uXG4gKiBAcmV0dXJucyB7UHlQcm94eX0gVGhlIG9iamVjdCBjb252ZXJ0ZWQgdG8gUHl0aG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9QeShvYmosIHsgZGVwdGggPSAtMSB9ID0ge30pIHtcbiAgLy8gTm8gcG9pbnQgaW4gY29udmVydGluZyB0aGVzZSwgaXQnZCBiZSBkdW1iIHRvIHByb3h5IHRoZW0gc28gdGhleSdkIGp1c3RcbiAgLy8gZ2V0IGNvbnZlcnRlZCBiYWNrIGJ5IGBqczJweXRob25gIGF0IHRoZSBlbmRcbiAgc3dpdGNoICh0eXBlb2Ygb2JqKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICByZXR1cm4gb2JqO1xuICB9XG4gIGlmICghb2JqIHx8IE1vZHVsZS5pc1B5UHJveHkob2JqKSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgbGV0IG9ial9pZCA9IDA7XG4gIGxldCBweV9yZXN1bHQgPSAwO1xuICBsZXQgcmVzdWx0ID0gMDtcbiAgdHJ5IHtcbiAgICBvYmpfaWQgPSBNb2R1bGUuaGl3aXJlLm5ld192YWx1ZShvYmopO1xuICAgIHRyeSB7XG4gICAgICBweV9yZXN1bHQgPSBNb2R1bGUuanMycHl0aG9uX2NvbnZlcnQob2JqX2lkLCBuZXcgTWFwKCksIGRlcHRoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIE1vZHVsZS5fUHJvcGFnYXRlUHl0aG9uRXJyb3IpIHtcbiAgICAgICAgTW9kdWxlLl9weXRob25leGMyanMoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICAgIGlmIChNb2R1bGUuX0pzUHJveHlfQ2hlY2socHlfcmVzdWx0KSkge1xuICAgICAgLy8gT29wcywganVzdCBjcmVhdGVkIGEgSnNQcm94eS4gUmV0dXJuIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICByZXR1cm4gb2JqO1xuICAgICAgLy8gcmV0dXJuIE1vZHVsZS5weXByb3h5X25ldyhweV9yZXN1bHQpO1xuICAgIH1cbiAgICByZXN1bHQgPSBNb2R1bGUuX3B5dGhvbjJqcyhweV9yZXN1bHQpO1xuICAgIGlmIChyZXN1bHQgPT09IDApIHtcbiAgICAgIE1vZHVsZS5fcHl0aG9uZXhjMmpzKCk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIE1vZHVsZS5oaXdpcmUuZGVjcmVmKG9ial9pZCk7XG4gICAgTW9kdWxlLl9QeV9EZWNSZWYocHlfcmVzdWx0KTtcbiAgfVxuICByZXR1cm4gTW9kdWxlLmhpd2lyZS5wb3BfdmFsdWUocmVzdWx0KTtcbn1cblxuLyoqXG4gKiBJbXBvcnRzIGEgbW9kdWxlIGFuZCByZXR1cm5zIGl0LlxuICpcbiAqIC4uIGFkbW9uaXRpb246OiBXYXJuaW5nXG4gKiAgICA6Y2xhc3M6IHdhcm5pbmdcbiAqXG4gKiAgICBUaGlzIGZ1bmN0aW9uIGhhcyBhIGNvbXBsZXRlbHkgZGlmZmVyZW50IGJlaGF2aW9yIHRoYW4gdGhlIG9sZCByZW1vdmVkIHB5aW1wb3J0IGZ1bmN0aW9uIVxuICpcbiAqICAgIGBgcHlpbXBvcnRgYCBpcyByb3VnaGx5IGVxdWl2YWxlbnQgdG86XG4gKlxuICogICAgLi4gY29kZS1ibG9jazo6IGpzXG4gKlxuICogICAgICBweW9kaWRlLnJ1blB5dGhvbihgaW1wb3J0ICR7cGtnbmFtZX07ICR7cGtnbmFtZX1gKTtcbiAqXG4gKiAgICBleGNlcHQgdGhhdCB0aGUgZ2xvYmFsIG5hbWVzcGFjZSB3aWxsIG5vdCBjaGFuZ2UuXG4gKlxuICogICAgRXhhbXBsZTpcbiAqXG4gKiAgICAuLiBjb2RlLWJsb2NrOjoganNcbiAqXG4gKiAgICAgIGxldCBzeXNtb2R1bGUgPSBweW9kaWRlLnB5aW1wb3J0KFwic3lzXCIpO1xuICogICAgICBsZXQgcmVjdXJzaW9uTGltaXQgPSBzeXMuZ2V0cmVjdXJzaW9ubGltaXQoKTtcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kX25hbWUgVGhlIG5hbWUgb2YgdGhlIG1vZHVsZSB0byBpbXBvcnRcbiAqIEByZXR1cm5zIEEgUHlQcm94eSBmb3IgdGhlIGltcG9ydGVkIG1vZHVsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcHlpbXBvcnQobW9kX25hbWUpIHtcbiAgcmV0dXJuIE1vZHVsZS5pbXBvcnRsaWIuaW1wb3J0X21vZHVsZShtb2RfbmFtZSk7XG59XG5cbi8qKlxuICogVW5wYWNrIGFuIGFyY2hpdmUgaW50byBhIHRhcmdldCBkaXJlY3RvcnkuXG4gKlxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYnVmZmVyIFRoZSBhcmNoaXZlIGFzIGFuIEFycmF5QnVmZmVyIChpdCdzIGFsc28gZmluZSB0byBwYXNzIGEgVHlwZWRBcnJheSkuXG4gKiBAcGFyYW0ge3N0cmluZ30gZm9ybWF0IFRoZSBmb3JtYXQgb2YgdGhlIGFyY2hpdmUuIFNob3VsZCBiZSBvbmUgb2YgdGhlIGZvcm1hdHMgcmVjb2duaXplZCBieSBgc2h1dGlsLnVucGFja19hcmNoaXZlYC5cbiAqIEJ5IGRlZmF1bHQgdGhlIG9wdGlvbnMgYXJlICdienRhcicsICdnenRhcicsICd0YXInLCAnemlwJywgYW5kICd3aGVlbCcuIFNldmVyYWwgc3lub255bXMgYXJlIGFjY2VwdGVkIGZvciBlYWNoIGZvcm1hdCwgZS5nLixcbiAqIGZvciAnZ3p0YXInIGFueSBvZiAnLmd6dGFyJywgJy50YXIuZ3onLCAnLnRneicsICd0YXIuZ3onIG9yICd0Z3onIGFyZSBjb25zaWRlcmVkIHRvIGJlIHN5bm9ueW1zLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gZXh0cmFjdF9kaXIgVGhlIGRpcmVjdG9yeSB0byB1bnBhY2sgdGhlIGFyY2hpdmUgaW50by4gRGVmYXVsdHMgdG8gdGhlIHdvcmtpbmcgZGlyZWN0b3J5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5wYWNrQXJjaGl2ZShidWZmZXIsIGZvcm1hdCwgZXh0cmFjdF9kaXIpIHtcbiAgaWYgKCFNb2R1bGUuX3V0aWxfbW9kdWxlKSB7XG4gICAgTW9kdWxlLl91dGlsX21vZHVsZSA9IHB5aW1wb3J0KFwicHlvZGlkZS5fdXRpbFwiKTtcbiAgfVxuICBNb2R1bGUuX3V0aWxfbW9kdWxlLnVucGFja19idWZmZXJfYXJjaGl2ZS5jYWxsS3dhcmdzKGJ1ZmZlciwge1xuICAgIGZvcm1hdCxcbiAgICBleHRyYWN0X2RpcixcbiAgfSk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuTW9kdWxlLnNhdmVTdGF0ZSA9ICgpID0+IE1vZHVsZS5weW9kaWRlX3B5Ll9zdGF0ZS5zYXZlX3N0YXRlKCk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuTW9kdWxlLnJlc3RvcmVTdGF0ZSA9IChzdGF0ZSkgPT4gTW9kdWxlLnB5b2RpZGVfcHkuX3N0YXRlLnJlc3RvcmVfc3RhdGUoc3RhdGUpO1xuXG4vKipcbiAqIFNldHMgdGhlIGludGVycnVwdCBidWZmZXIgdG8gYmUgYGludGVycnVwdF9idWZmZXJgLiBUaGlzIGlzIG9ubHkgdXNlZnVsIHdoZW5cbiAqIFB5b2RpZGUgaXMgdXNlZCBpbiBhIHdlYndvcmtlci4gVGhlIGJ1ZmZlciBzaG91bGQgYmUgYSBgU2hhcmVkQXJyYXlCdWZmZXJgXG4gKiBzaGFyZWQgd2l0aCB0aGUgbWFpbiBicm93c2VyIHRocmVhZCAob3IgYW5vdGhlciB3b3JrZXIpLiBUbyByZXF1ZXN0IGFuXG4gKiBpbnRlcnJ1cHQsIGEgYDJgIHNob3VsZCBiZSB3cml0dGVuIGludG8gYGludGVycnVwdF9idWZmZXJgICgyIGlzIHRoZSBwb3NpeFxuICogY29uc3RhbnQgZm9yIFNJR0lOVCkuXG4gKlxuICogQHBhcmFtIHtUeXBlZEFycmF5fSBpbnRlcnJ1cHRfYnVmZmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRJbnRlcnJ1cHRCdWZmZXIoaW50ZXJydXB0X2J1ZmZlcikge1xuICBNb2R1bGUuaW50ZXJydXB0X2J1ZmZlciA9IGludGVycnVwdF9idWZmZXI7XG4gIE1vZHVsZS5fc2V0X3B5b2RpZGVfY2FsbGJhY2soISFpbnRlcnJ1cHRfYnVmZmVyKTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBLZXlib2FyZEludGVycnVwdCBlcnJvciBpZiBhIEtleWJvYXJkSW50ZXJydXB0IGhhcyBiZWVuIHJlcXVlc3RlZFxuICogdmlhIHRoZSBpbnRlcnJ1cHQgYnVmZmVyLlxuICpcbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gZW5hYmxlIGtleWJvYXJkIGludGVycnVwdHMgZHVyaW5nIGV4ZWN1dGlvbiBvZiBKYXZhU2NyaXB0XG4gKiBjb2RlLCBqdXN0IGFzIGBQeUVycl9DaGVja1NpZ25hbHNgIGlzIHVzZWQgdG8gZW5hYmxlIGtleWJvYXJkIGludGVycnVwdHNcbiAqIGR1cmluZyBleGVjdXRpb24gb2YgQyBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJbnRlcnJ1cHQoKSB7XG4gIGlmIChNb2R1bGUuaW50ZXJydXB0X2J1ZmZlclswXSA9PT0gMikge1xuICAgIE1vZHVsZS5pbnRlcnJ1cHRfYnVmZmVyWzBdID0gMDtcbiAgICBNb2R1bGUuX1B5RXJyX1NldEludGVycnVwdCgpO1xuICAgIE1vZHVsZS5ydW5QeXRob24oXCJcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQdWJsaWNBUEkoKSB7XG4gIC8qKlxuICAgKiBBbiBhbGlhcyB0byB0aGUgYEVtc2NyaXB0ZW4gRmlsZSBTeXN0ZW0gQVBJXG4gICAqIDxodHRwczovL2Vtc2NyaXB0ZW4ub3JnL2RvY3MvYXBpX3JlZmVyZW5jZS9GaWxlc3lzdGVtLUFQSS5odG1sPmBfLlxuICAgKlxuICAgKiBUaGlzIHByb3ZpZGVzIGEgd2lkZSByYW5nZSBvZiBQT1NJWC1gbGlrZWAgZmlsZS9kZXZpY2Ugb3BlcmF0aW9ucywgaW5jbHVkaW5nXG4gICAqIGBtb3VudFxuICAgKiA8aHR0cHM6Ly9lbXNjcmlwdGVuLm9yZy9kb2NzL2FwaV9yZWZlcmVuY2UvRmlsZXN5c3RlbS1BUEkuaHRtbCNGUy5tb3VudD5gX1xuICAgKiB3aGljaCBjYW4gYmUgdXNlZCB0byBleHRlbmQgdGhlIGluLW1lbW9yeSBmaWxlc3lzdGVtIHdpdGggZmVhdHVyZXMgbGlrZSBgcGVyc2lzdGVuY2VcbiAgICogPGh0dHBzOi8vZW1zY3JpcHRlbi5vcmcvZG9jcy9hcGlfcmVmZXJlbmNlL0ZpbGVzeXN0ZW0tQVBJLmh0bWwjcGVyc2lzdGVudC1kYXRhPmBfLlxuICAgKlxuICAgKiBXaGlsZSBhbGwgdGhlIGZpbGUgc3lzdGVtcyBpbXBsZW1lbnRhdGlvbnMgYXJlIGVuYWJsZWQsIG9ubHkgdGhlIGRlZmF1bHRcbiAgICogYGBNRU1GU2BgIGlzIGd1YXJhbnRlZWQgdG8gd29yayBpbiBhbGwgcnVudGltZSBzZXR0aW5ncy4gVGhlIGltcGxlbWVudGF0aW9uc1xuICAgKiBhcmUgYXZhaWxhYmxlIGFzIG1lbWJlcnMgb2YgYGBGUy5maWxlc3lzdGVtc2BgOlxuICAgKiBgYElEQkZTYGAsIGBgTk9ERUZTYGAsIGBgUFJPWFlGU2BgLCBgYFdPUktFUkZTYGAuXG4gICAqXG4gICAqIEB0eXBlIHtGU31cbiAgICovXG4gIGNvbnN0IEZTID0gTW9kdWxlLkZTO1xuICBsZXQgbmFtZXNwYWNlID0ge1xuICAgIGdsb2JhbHMsXG4gICAgRlMsXG4gICAgcHlvZGlkZV9weSxcbiAgICB2ZXJzaW9uLFxuICAgIGxvYWRQYWNrYWdlLFxuICAgIGxvYWRQYWNrYWdlc0Zyb21JbXBvcnRzLFxuICAgIGxvYWRlZFBhY2thZ2VzLFxuICAgIGlzUHlQcm94eSxcbiAgICBydW5QeXRob24sXG4gICAgcnVuUHl0aG9uQXN5bmMsXG4gICAgcmVnaXN0ZXJKc01vZHVsZSxcbiAgICB1bnJlZ2lzdGVySnNNb2R1bGUsXG4gICAgc2V0SW50ZXJydXB0QnVmZmVyLFxuICAgIGNoZWNrSW50ZXJydXB0LFxuICAgIHRvUHksXG4gICAgcHlpbXBvcnQsXG4gICAgdW5wYWNrQXJjaGl2ZSxcbiAgICByZWdpc3RlckNvbWxpbmssXG4gICAgUHl0aG9uRXJyb3IsXG4gICAgUHlCdWZmZXIsXG4gIH07XG5cbiAgbmFtZXNwYWNlLl9tb2R1bGUgPSBNb2R1bGU7IC8vIEBwcml2YXRlXG4gIE1vZHVsZS5wdWJsaWNfYXBpID0gbmFtZXNwYWNlO1xuICByZXR1cm4gbmFtZXNwYWNlO1xufVxuIiwgIi8qKlxuICogVGhlIG1haW4gYm9vdHN0cmFwIGNvZGUgZm9yIGxvYWRpbmcgcHlvZGlkZS5cbiAqL1xuaW1wb3J0IHsgTW9kdWxlLCBzZXRTdGFuZGFyZFN0cmVhbXMsIHNldEhvbWVEaXJlY3RvcnkgfSBmcm9tIFwiLi9tb2R1bGUuanNcIjtcbmltcG9ydCB7XG4gIGxvYWRTY3JpcHQsXG4gIGluaXRpYWxpemVQYWNrYWdlSW5kZXgsXG4gIF9mZXRjaEJpbmFyeUZpbGUsXG4gIGxvYWRQYWNrYWdlLFxufSBmcm9tIFwiLi9sb2FkLXB5b2RpZGUuanNcIjtcbmltcG9ydCB7IG1ha2VQdWJsaWNBUEksIHJlZ2lzdGVySnNNb2R1bGUgfSBmcm9tIFwiLi9hcGkuanNcIjtcbmltcG9ydCBcIi4vcHlwcm94eS5nZW4uanNcIjtcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3B5cHJveHkuZ2VuJykuUHlQcm94eX0gUHlQcm94eVxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlXaXRoTGVuZ3RofSBQeVByb3h5V2l0aExlbmd0aFxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlXaXRoR2V0fSBQeVByb3h5V2l0aEdldFxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlXaXRoU2V0fSBQeVByb3h5V2l0aFNldFxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlXaXRoSGFzfSBQeVByb3h5V2l0aEhhc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlJdGVyYWJsZX0gUHlQcm94eUl0ZXJhYmxlXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3B5cHJveHkuZ2VuJykuUHlQcm94eUl0ZXJhdG9yfSBQeVByb3h5SXRlcmF0b3JcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcHlwcm94eS5nZW4nKS5QeVByb3h5QXdhaXRhYmxlfSBQeVByb3h5QXdhaXRhYmxlXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3B5cHJveHkuZ2VuJykuUHlQcm94eUJ1ZmZlcn0gUHlQcm94eUJ1ZmZlclxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5UHJveHlDYWxsYWJsZX0gUHlQcm94eUNhbGxhYmxlXG4gKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9weXByb3h5LmdlbicpLlB5MkpzUmVzdWx0fSBQeTJKc1Jlc3VsdFxuICpcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcHlwcm94eS5nZW4nKS5UeXBlZEFycmF5fSBUeXBlZEFycmF5XG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3B5cHJveHkuZ2VuJykuUHlCdWZmZXJ9IFB5QnVmZmVyXG4gKi9cblxuLyoqXG4gKiBEdW1wIHRoZSBQeXRob24gdHJhY2ViYWNrIHRvIHRoZSBicm93c2VyIGNvbnNvbGUuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuTW9kdWxlLmR1bXBfdHJhY2ViYWNrID0gZnVuY3Rpb24gKCkge1xuICBjb25zdCBmZF9zdGRvdXQgPSAxO1xuICBNb2R1bGUuX19QeV9EdW1wVHJhY2ViYWNrKGZkX3N0ZG91dCwgTW9kdWxlLl9QeUdJTFN0YXRlX0dldFRoaXNUaHJlYWRTdGF0ZSgpKTtcbn07XG5cbmxldCBmYXRhbF9lcnJvcl9vY2N1cnJlZCA9IGZhbHNlO1xuLyoqXG4gKiBTaWduYWwgYSBmYXRhbCBlcnJvci5cbiAqXG4gKiBEdW1wcyB0aGUgUHl0aG9uIHRyYWNlYmFjaywgc2hvd3MgYSBKYXZhU2NyaXB0IHRyYWNlYmFjaywgYW5kIHByaW50cyBhIGNsZWFyXG4gKiBtZXNzYWdlIGluZGljYXRpbmcgYSBmYXRhbCBlcnJvci4gSXQgdGhlbiBkdW1taWVzIG91dCB0aGUgcHVibGljIEFQSSBzbyB0aGF0XG4gKiBmdXJ0aGVyIGF0dGVtcHRzIHRvIHVzZSBQeW9kaWRlIHdpbGwgY2xlYXJseSBpbmRpY2F0ZSB0aGF0IFB5b2RpZGUgaGFzIGZhaWxlZFxuICogYW5kIGNhbiBubyBsb25nZXIgYmUgdXNlZC4gcHlvZGlkZS5fbW9kdWxlIGlzIGxlZnQgYWNjZXNzaWJsZSwgYW5kIGl0IGlzXG4gKiBwb3NzaWJsZSB0byBjb250aW51ZSB1c2luZyBQeW9kaWRlIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMgaWYgZGVzaXJlZC5cbiAqXG4gKiBAYXJndW1lbnQgZSB7RXJyb3J9IFRoZSBjYXVzZSBvZiB0aGUgZmF0YWwgZXJyb3IuXG4gKiBAcHJpdmF0ZVxuICovXG5Nb2R1bGUuZmF0YWxfZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICBpZiAoZS5weW9kaWRlX2ZhdGFsX2Vycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmYXRhbF9lcnJvcl9vY2N1cnJlZCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJSZWN1cnNpdmUgY2FsbCB0byBmYXRhbF9lcnJvci4gSW5uZXIgZXJyb3Igd2FzOlwiKTtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBNYXJrIGUgc28gd2Uga25vdyBub3QgdG8gaGFuZGxlIGl0IGxhdGVyIGluIEVNX0pTIHdyYXBwZXJzXG4gIGUucHlvZGlkZV9mYXRhbF9lcnJvciA9IHRydWU7XG4gIGZhdGFsX2Vycm9yX29jY3VycmVkID0gdHJ1ZTtcbiAgY29uc29sZS5lcnJvcihcbiAgICBcIlB5b2RpZGUgaGFzIHN1ZmZlcmVkIGEgZmF0YWwgZXJyb3IuIFBsZWFzZSByZXBvcnQgdGhpcyB0byB0aGUgUHlvZGlkZSBtYWludGFpbmVycy5cIlxuICApO1xuICBjb25zb2xlLmVycm9yKFwiVGhlIGNhdXNlIG9mIHRoZSBmYXRhbCBlcnJvciB3YXM6XCIpO1xuICBpZiAoTW9kdWxlLmluVGVzdEhvaXN0KSB7XG4gICAgLy8gVGVzdCBob2lzdCB3b24ndCBwcmludCB0aGUgZXJyb3Igb2JqZWN0IGluIGEgdXNlZnVsIHdheSBzbyBjb252ZXJ0IGl0IHRvXG4gICAgLy8gc3RyaW5nLlxuICAgIGNvbnNvbGUuZXJyb3IoZS50b1N0cmluZygpKTtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gIH1cbiAgdHJ5IHtcbiAgICBNb2R1bGUuZHVtcF90cmFjZWJhY2soKTtcbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoTW9kdWxlLnB1YmxpY19hcGkpKSB7XG4gICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJfXCIpIHx8IGtleSA9PT0gXCJ2ZXJzaW9uXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTW9kdWxlLnB1YmxpY19hcGksIGtleSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiUHlvZGlkZSBhbHJlYWR5IGZhdGFsbHkgZmFpbGVkIGFuZCBjYW4gbm8gbG9uZ2VyIGJlIHVzZWQuXCJcbiAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChNb2R1bGUub25fZmF0YWwpIHtcbiAgICAgIE1vZHVsZS5vbl9mYXRhbChlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycjIpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiQW5vdGhlciBlcnJvciBvY2N1cnJlZCB3aGlsZSBoYW5kbGluZyB0aGUgZmF0YWwgZXJyb3I6XCIpO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyMik7XG4gIH1cbiAgdGhyb3cgZTtcbn07XG5cbmxldCBydW5QeXRob25JbnRlcm5hbF9kaWN0OyAvLyBJbml0aWFsaXplZCBpbiBmaW5hbGl6ZUJvb3RzdHJhcFxuLyoqXG4gKiBKdXN0IGxpa2UgYHJ1blB5dGhvbmAgZXhjZXB0IHVzZXMgYSBkaWZmZXJlbnQgZ2xvYmFscyBkaWN0IGFuZCBnZXRzXG4gKiBgZXZhbF9jb2RlYCBmcm9tIGBfcHlvZGlkZWAgc28gdGhhdCBpdCBjYW4gd29yayBiZWZvcmUgYHB5b2RpZGVgIGlzIGltcG9ydGVkLlxuICogQHByaXZhdGVcbiAqL1xuTW9kdWxlLnJ1blB5dGhvbkludGVybmFsID0gZnVuY3Rpb24gKGNvZGUpIHtcbiAgcmV0dXJuIE1vZHVsZS5fcHlvZGlkZS5fYmFzZS5ldmFsX2NvZGUoY29kZSwgcnVuUHl0aG9uSW50ZXJuYWxfZGljdCk7XG59O1xuXG4vKipcbiAqIEEgcHJveHkgYXJvdW5kIGdsb2JhbHMgdGhhdCBmYWxscyBiYWNrIHRvIGNoZWNraW5nIGZvciBhIGJ1aWx0aW4gaWYgaGFzIG9yXG4gKiBnZXQgZmFpbHMgdG8gZmluZCBhIGdsb2JhbCB3aXRoIHRoZSBnaXZlbiBrZXkuIE5vdGUgdGhhdCB0aGlzIHByb3h5IGlzXG4gKiB0cmFuc3BhcmVudCB0byBqczJweXRob246IGl0IHdvbid0IG5vdGljZSB0aGF0IHRoaXMgd3JhcHBlciBleGlzdHMgYXQgYWxsIGFuZFxuICogd2lsbCB0cmFuc2xhdGUgdGhpcyBwcm94eSB0byB0aGUgZ2xvYmFscyBkaWN0aW9uYXJ5LlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gd3JhcFB5dGhvbkdsb2JhbHMoZ2xvYmFsc19kaWN0LCBidWlsdGluc19kaWN0KSB7XG4gIHJldHVybiBuZXcgUHJveHkoZ2xvYmFsc19kaWN0LCB7XG4gICAgZ2V0KHRhcmdldCwgc3ltYm9sKSB7XG4gICAgICBpZiAoc3ltYm9sID09PSBcImdldFwiKSB7XG4gICAgICAgIHJldHVybiAoa2V5KSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHRhcmdldC5nZXQoa2V5KTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGJ1aWx0aW5zX2RpY3QuZ2V0KGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoc3ltYm9sID09PSBcImhhc1wiKSB7XG4gICAgICAgIHJldHVybiAoa2V5KSA9PiB0YXJnZXQuaGFzKGtleSkgfHwgYnVpbHRpbnNfZGljdC5oYXMoa2V5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHN5bWJvbCk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVucGFja1B5b2RpZGVQeShweW9kaWRlX3B5X3Rhcikge1xuICBjb25zdCBmaWxlTmFtZSA9IFwiL3B5b2RpZGVfcHkudGFyXCI7XG4gIGxldCBzdHJlYW0gPSBNb2R1bGUuRlMub3BlbihmaWxlTmFtZSwgXCJ3XCIpO1xuICBNb2R1bGUuRlMud3JpdGUoXG4gICAgc3RyZWFtLFxuICAgIG5ldyBVaW50OEFycmF5KHB5b2RpZGVfcHlfdGFyKSxcbiAgICAwLFxuICAgIHB5b2RpZGVfcHlfdGFyLmJ5dGVMZW5ndGgsXG4gICAgdW5kZWZpbmVkLFxuICAgIHRydWVcbiAgKTtcbiAgTW9kdWxlLkZTLmNsb3NlKHN0cmVhbSk7XG4gIGNvbnN0IGNvZGVfcHRyID0gTW9kdWxlLnN0cmluZ1RvTmV3VVRGOChgXG5pbXBvcnQgc2h1dGlsXG5zaHV0aWwudW5wYWNrX2FyY2hpdmUoXCIvcHlvZGlkZV9weS50YXJcIiwgXCIvbGliL3B5dGhvbjMuOS9zaXRlLXBhY2thZ2VzL1wiKVxuZGVsIHNodXRpbFxuaW1wb3J0IGltcG9ydGxpYlxuaW1wb3J0bGliLmludmFsaWRhdGVfY2FjaGVzKClcbmRlbCBpbXBvcnRsaWJcbiAgICBgKTtcbiAgbGV0IGVycmNvZGUgPSBNb2R1bGUuX1B5UnVuX1NpbXBsZVN0cmluZyhjb2RlX3B0cik7XG4gIGlmIChlcnJjb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT09QUyFcIik7XG4gIH1cbiAgTW9kdWxlLl9mcmVlKGNvZGVfcHRyKTtcbiAgTW9kdWxlLkZTLnVubGluayhmaWxlTmFtZSk7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGVtc2NyaXB0ZW4gbW9kdWxlIGlzIGZpbmlzaGVkIGluaXRpYWxpemluZyxcbiAqIHNvIGV2YWxfY29kZSBpcyBuZXdseSBhdmFpbGFibGUuXG4gKiBJdCBmaW5pc2hlcyB0aGUgYm9vdHN0cmFwIHNvIHRoYXQgb25jZSBpdCBpcyBjb21wbGV0ZSwgaXQgaXMgcG9zc2libGUgdG8gdXNlXG4gKiB0aGUgY29yZSBgcHlvZGlkZWAgYXBpcy4gKEJ1dCBwYWNrYWdlIGxvYWRpbmcgaXMgbm90IHJlYWR5IHF1aXRlIHlldC4pXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBmaW5hbGl6ZUJvb3RzdHJhcChjb25maWcpIHtcbiAgLy8gRmlyc3QgbWFrZSBpbnRlcm5hbCBkaWN0IHNvIHRoYXQgd2UgY2FuIHVzZSBydW5QeXRob25JbnRlcm5hbC5cbiAgLy8gcnVuUHl0aG9uSW50ZXJuYWwgdXNlcyBhIHNlcGFyYXRlIG5hbWVzcGFjZSwgc28gd2UgZG9uJ3QgcG9sbHV0ZSB0aGUgbWFpblxuICAvLyBlbnZpcm9ubWVudCB3aXRoIHZhcmlhYmxlcyBmcm9tIG91ciBzZXR1cC5cbiAgcnVuUHl0aG9uSW50ZXJuYWxfZGljdCA9IE1vZHVsZS5fcHlvZGlkZS5fYmFzZS5ldmFsX2NvZGUoXCJ7fVwiKTtcbiAgTW9kdWxlLmltcG9ydGxpYiA9IE1vZHVsZS5ydW5QeXRob25JbnRlcm5hbChcImltcG9ydCBpbXBvcnRsaWI7IGltcG9ydGxpYlwiKTtcbiAgbGV0IGltcG9ydF9tb2R1bGUgPSBNb2R1bGUuaW1wb3J0bGliLmltcG9ydF9tb2R1bGU7XG5cbiAgTW9kdWxlLnN5cyA9IGltcG9ydF9tb2R1bGUoXCJzeXNcIik7XG4gIE1vZHVsZS5zeXMucGF0aC5pbnNlcnQoMCwgY29uZmlnLmhvbWVkaXIpO1xuXG4gIC8vIFNldCB1cCBnbG9iYWxzXG4gIGxldCBnbG9iYWxzID0gTW9kdWxlLnJ1blB5dGhvbkludGVybmFsKFwiaW1wb3J0IF9fbWFpbl9fOyBfX21haW5fXy5fX2RpY3RfX1wiKTtcbiAgbGV0IGJ1aWx0aW5zID0gTW9kdWxlLnJ1blB5dGhvbkludGVybmFsKFwiaW1wb3J0IGJ1aWx0aW5zOyBidWlsdGlucy5fX2RpY3RfX1wiKTtcbiAgTW9kdWxlLmdsb2JhbHMgPSB3cmFwUHl0aG9uR2xvYmFscyhnbG9iYWxzLCBidWlsdGlucyk7XG5cbiAgLy8gU2V0IHVwIGtleSBKYXZhc2NyaXB0IG1vZHVsZXMuXG4gIGxldCBpbXBvcnRob29rID0gTW9kdWxlLl9weW9kaWRlLl9pbXBvcnRob29rO1xuICBpbXBvcnRob29rLnJlZ2lzdGVyX2pzX2ZpbmRlcigpO1xuICBpbXBvcnRob29rLnJlZ2lzdGVyX2pzX21vZHVsZShcImpzXCIsIGNvbmZpZy5qc2dsb2JhbHMpO1xuXG4gIGxldCBweW9kaWRlID0gbWFrZVB1YmxpY0FQSSgpO1xuICBpbXBvcnRob29rLnJlZ2lzdGVyX2pzX21vZHVsZShcInB5b2RpZGVfanNcIiwgcHlvZGlkZSk7XG5cbiAgLy8gaW1wb3J0IHB5b2RpZGVfcHkuIFdlIHdhbnQgdG8gZW5zdXJlIHRoYXQgYXMgbXVjaCBzdHVmZiBhcyBwb3NzaWJsZSBpc1xuICAvLyBhbHJlYWR5IHNldCB1cCBiZWZvcmUgaW1wb3J0aW5nIHB5b2RpZGVfcHkgdG8gc2ltcGxpZnkgZGV2ZWxvcG1lbnQgb2ZcbiAgLy8gcHlvZGlkZV9weSBjb2RlIChPdGhlcndpc2UgaXQncyB2ZXJ5IGhhcmQgdG8ga2VlcCB0cmFjayBvZiB3aGljaCB0aGluZ3NcbiAgLy8gYXJlbid0IHNldCB1cCB5ZXQuKVxuICBNb2R1bGUucHlvZGlkZV9weSA9IGltcG9ydF9tb2R1bGUoXCJweW9kaWRlXCIpO1xuICBNb2R1bGUudmVyc2lvbiA9IE1vZHVsZS5weW9kaWRlX3B5Ll9fdmVyc2lvbl9fO1xuXG4gIC8vIGNvcHkgc29tZSBsYXN0IGNvbnN0YW50cyBvbnRvIHB1YmxpYyBBUEkuXG4gIHB5b2RpZGUucHlvZGlkZV9weSA9IE1vZHVsZS5weW9kaWRlX3B5O1xuICBweW9kaWRlLnZlcnNpb24gPSBNb2R1bGUudmVyc2lvbjtcbiAgcHlvZGlkZS5nbG9iYWxzID0gTW9kdWxlLmdsb2JhbHM7XG4gIHJldHVybiBweW9kaWRlO1xufVxuXG4vKipcbiAqIExvYWQgdGhlIG1haW4gUHlvZGlkZSB3YXNtIG1vZHVsZSBhbmQgaW5pdGlhbGl6ZSBpdC5cbiAqXG4gKiBPbmx5IG9uZSBjb3B5IG9mIFB5b2RpZGUgY2FuIGJlIGxvYWRlZCBpbiBhIGdpdmVuIEphdmFTY3JpcHQgZ2xvYmFsIHNjb3BlXG4gKiBiZWNhdXNlIFB5b2RpZGUgdXNlcyBnbG9iYWwgdmFyaWFibGVzIHRvIGxvYWQgcGFja2FnZXMuIElmIGFuIGF0dGVtcHQgaXMgbWFkZVxuICogdG8gbG9hZCBhIHNlY29uZCBjb3B5IG9mIFB5b2RpZGUsIDphbnk6YGxvYWRQeW9kaWRlYCB3aWxsIHRocm93IGFuIGVycm9yLlxuICogKFRoaXMgY2FuIGJlIGZpeGVkIG9uY2UgYEZpcmVmb3ggYWRvcHRzIHN1cHBvcnQgZm9yIEVTNiBtb2R1bGVzIGluIHdlYndvcmtlcnNcbiAqIDxodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMjQ3Njg3PmBfLilcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmluZGV4VVJMIC0gVGhlIFVSTCBmcm9tIHdoaWNoIFB5b2RpZGUgd2lsbCBsb2FkXG4gKiBwYWNrYWdlc1xuICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5ob21lZGlyIC0gVGhlIGhvbWUgZGlyZWN0b3J5IHdoaWNoIFB5b2RpZGUgd2lsbCB1c2UgaW5zaWRlIHZpcnR1YWwgZmlsZSBzeXN0ZW1cbiAqIERlZmF1bHQ6IC9ob21lL3B5b2RpZGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZmlnLmZ1bGxTdGRMaWIgLSBMb2FkIHRoZSBmdWxsIFB5dGhvbiBzdGFuZGFyZCBsaWJyYXJ5LlxuICogU2V0dGluZyB0aGlzIHRvIGZhbHNlIGV4Y2x1ZGVzIGZvbGxvd2luZyBtb2R1bGVzOiBkaXN0dXRpbHMuXG4gKiBEZWZhdWx0OiB0cnVlXG4gKiBAcGFyYW0ge3VuZGVmaW5lZCB8IGZ1bmN0aW9uKCk6IHN0cmluZ30gY29uZmlnLnN0ZGluIC0gT3ZlcnJpZGUgdGhlIHN0YW5kYXJkIGlucHV0IGNhbGxiYWNrLiBTaG91bGQgYXNrIHRoZSB1c2VyIGZvciBvbmUgbGluZSBvZiBpbnB1dC5cbiAqIERlZmF1bHQ6IHVuZGVmaW5lZFxuICogQHBhcmFtIHt1bmRlZmluZWQgfCBmdW5jdGlvbihzdHJpbmcpfSBjb25maWcuc3Rkb3V0IC0gT3ZlcnJpZGUgdGhlIHN0YW5kYXJkIG91dHB1dCBjYWxsYmFjay5cbiAqIERlZmF1bHQ6IHVuZGVmaW5lZFxuICogQHBhcmFtIHt1bmRlZmluZWQgfCBmdW5jdGlvbihzdHJpbmcpfSBjb25maWcuc3RkZXJyIC0gT3ZlcnJpZGUgdGhlIHN0YW5kYXJkIGVycm9yIG91dHB1dCBjYWxsYmFjay5cbiAqIERlZmF1bHQ6IHVuZGVmaW5lZFxuICogQHJldHVybnMgVGhlIDpyZWY6YGpzLWFwaS1weW9kaWRlYCBtb2R1bGUuXG4gKiBAbWVtYmVyb2YgZ2xvYmFsVGhpc1xuICogQGFzeW5jXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUHlvZGlkZShjb25maWcpIHtcbiAgaWYgKGdsb2JhbFRoaXMuX19weW9kaWRlX21vZHVsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlB5b2RpZGUgaXMgYWxyZWFkeSBsb2FkaW5nLlwiKTtcbiAgfVxuICBpZiAoIWNvbmZpZy5pbmRleFVSTCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBwcm92aWRlIGluZGV4VVJMIHBhcmFtZXRlciB0byBsb2FkUHlvZGlkZVwiKTtcbiAgfVxuXG4gIGxvYWRQeW9kaWRlLmluUHJvZ3Jlc3MgPSB0cnVlO1xuICAvLyBBIGdsb2JhbCBcIm1vdW50IHBvaW50XCIgZm9yIHRoZSBwYWNrYWdlIGxvYWRlcnMgdG8gdGFsayB0byBweW9kaWRlXG4gIC8vIFNlZSBcIi0tZXhwb3J0LW5hbWU9X19weW9kaWRlX21vZHVsZVwiIGluIGJ1aWxkcGtnLnB5XG4gIGdsb2JhbFRoaXMuX19weW9kaWRlX21vZHVsZSA9IE1vZHVsZTtcblxuICBjb25zdCBkZWZhdWx0X2NvbmZpZyA9IHtcbiAgICBmdWxsU3RkTGliOiB0cnVlLFxuICAgIGpzZ2xvYmFsczogZ2xvYmFsVGhpcyxcbiAgICBzdGRpbjogZ2xvYmFsVGhpcy5wcm9tcHQgPyBnbG9iYWxUaGlzLnByb21wdCA6IHVuZGVmaW5lZCxcbiAgICBob21lZGlyOiBcIi9ob21lL3B5b2RpZGVcIixcbiAgfTtcbiAgY29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0X2NvbmZpZywgY29uZmlnKTtcblxuICBpZiAoIWNvbmZpZy5pbmRleFVSTC5lbmRzV2l0aChcIi9cIikpIHtcbiAgICBjb25maWcuaW5kZXhVUkwgKz0gXCIvXCI7XG4gIH1cbiAgTW9kdWxlLmluZGV4VVJMID0gY29uZmlnLmluZGV4VVJMO1xuICBsZXQgcGFja2FnZUluZGV4UmVhZHkgPSBpbml0aWFsaXplUGFja2FnZUluZGV4KGNvbmZpZy5pbmRleFVSTCk7XG4gIGxldCBweW9kaWRlX3B5X3Rhcl9wcm9taXNlID0gX2ZldGNoQmluYXJ5RmlsZShcbiAgICBjb25maWcuaW5kZXhVUkwsXG4gICAgXCJweW9kaWRlX3B5LnRhclwiXG4gICk7XG5cbiAgc2V0U3RhbmRhcmRTdHJlYW1zKGNvbmZpZy5zdGRpbiwgY29uZmlnLnN0ZG91dCwgY29uZmlnLnN0ZGVycik7XG4gIHNldEhvbWVEaXJlY3RvcnkoY29uZmlnLmhvbWVkaXIpO1xuXG4gIGxldCBtb2R1bGVMb2FkZWQgPSBuZXcgUHJvbWlzZSgocikgPT4gKE1vZHVsZS5wb3N0UnVuID0gcikpO1xuXG4gIGNvbnN0IHNjcmlwdFNyYyA9IGAke2NvbmZpZy5pbmRleFVSTH1weW9kaWRlLmFzbS5qc2A7XG4gIGF3YWl0IGxvYWRTY3JpcHQoc2NyaXB0U3JjKTtcblxuICAvLyBfY3JlYXRlUHlvZGlkZU1vZHVsZSBpcyBzcGVjaWZpZWQgaW4gdGhlIE1ha2VmaWxlIGJ5IHRoZSBsaW5rZXIgZmxhZzpcbiAgLy8gYC1zIEVYUE9SVF9OQU1FPVwiJ19jcmVhdGVQeW9kaWRlTW9kdWxlJ1wiYFxuICBhd2FpdCBfY3JlYXRlUHlvZGlkZU1vZHVsZShNb2R1bGUpO1xuXG4gIC8vIFRoZXJlIGlzIHNvbWUgd29yayB0byBiZSBkb25lIGJldHdlZW4gdGhlIG1vZHVsZSBiZWluZyBcInJlYWR5XCIgYW5kIHBvc3RSdW5cbiAgLy8gYmVpbmcgY2FsbGVkLlxuICBhd2FpdCBtb2R1bGVMb2FkZWQ7XG5cbiAgY29uc3QgcHlvZGlkZV9weV90YXIgPSBhd2FpdCBweW9kaWRlX3B5X3Rhcl9wcm9taXNlO1xuICB1bnBhY2tQeW9kaWRlUHkocHlvZGlkZV9weV90YXIpO1xuICBNb2R1bGUuX3B5b2RpZGVfaW5pdCgpO1xuXG4gIGxldCBweW9kaWRlID0gZmluYWxpemVCb290c3RyYXAoY29uZmlnKTtcbiAgLy8gTW9kdWxlLnJ1blB5dGhvbiB3b3JrcyBzdGFydGluZyBoZXJlLlxuXG4gIGF3YWl0IHBhY2thZ2VJbmRleFJlYWR5O1xuICBpZiAoY29uZmlnLmZ1bGxTdGRMaWIpIHtcbiAgICBhd2FpdCBsb2FkUGFja2FnZShbXCJkaXN0dXRpbHNcIl0pO1xuICB9XG4gIHB5b2RpZGUucnVuUHl0aG9uKFwicHJpbnQoJ1B5dGhvbiBpbml0aWFsaXphdGlvbiBjb21wbGV0ZScpXCIpO1xuICByZXR1cm4gcHlvZGlkZTtcbn1cbmdsb2JhbFRoaXMubG9hZFB5b2RpZGUgPSBsb2FkUHlvZGlkZTtcbiIsICJcbmZ1bmN0aW9uIGltcG9ydFB5dGhvblBhY2thZ2U8VD4ocHlvZGlkZTogYW55KTogVCB7XG4gIGNvbnN0IGZpbGUgPSBTdHJpbmcucmF3YCMhL3Vzci9iaW4vZW52IHB5dGhvblxuaW1wb3J0IGNvbnRleHRsaWIgYXMgX19zdGlja3l0YXBlX2NvbnRleHRsaWJcblxuQF9fc3RpY2t5dGFwZV9jb250ZXh0bGliLmNvbnRleHRtYW5hZ2VyXG5kZWYgX19zdGlja3l0YXBlX3RlbXBvcmFyeV9kaXIoKTpcbiAgICBpbXBvcnQgdGVtcGZpbGVcbiAgICBpbXBvcnQgc2h1dGlsXG4gICAgZGlyX3BhdGggPSB0ZW1wZmlsZS5ta2R0ZW1wKClcbiAgICB0cnk6XG4gICAgICAgIHlpZWxkIGRpcl9wYXRoXG4gICAgZmluYWxseTpcbiAgICAgICAgc2h1dGlsLnJtdHJlZShkaXJfcGF0aClcblxud2l0aCBfX3N0aWNreXRhcGVfdGVtcG9yYXJ5X2RpcigpIGFzIF9fc3RpY2t5dGFwZV93b3JraW5nX2RpcjpcbiAgICBkZWYgX19zdGlja3l0YXBlX3dyaXRlX21vZHVsZShwYXRoLCBjb250ZW50cyk6XG4gICAgICAgIGltcG9ydCBvcywgb3MucGF0aFxuXG4gICAgICAgIGRlZiBtYWtlX3BhY2thZ2UocGF0aCk6XG4gICAgICAgICAgICBwYXJ0cyA9IHBhdGguc3BsaXQoXCIvXCIpXG4gICAgICAgICAgICBwYXJ0aWFsX3BhdGggPSBfX3N0aWNreXRhcGVfd29ya2luZ19kaXJcbiAgICAgICAgICAgIGZvciBwYXJ0IGluIHBhcnRzOlxuICAgICAgICAgICAgICAgIHBhcnRpYWxfcGF0aCA9IG9zLnBhdGguam9pbihwYXJ0aWFsX3BhdGgsIHBhcnQpXG4gICAgICAgICAgICAgICAgaWYgbm90IG9zLnBhdGguZXhpc3RzKHBhcnRpYWxfcGF0aCk6XG4gICAgICAgICAgICAgICAgICAgIG9zLm1rZGlyKHBhcnRpYWxfcGF0aClcbiAgICAgICAgICAgICAgICAgICAgd2l0aCBvcGVuKG9zLnBhdGguam9pbihwYXJ0aWFsX3BhdGgsIFwiX19pbml0X18ucHlcIiksIFwid2JcIikgYXMgZjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGYud3JpdGUoYlwiXFxuXCIpXG5cbiAgICAgICAgbWFrZV9wYWNrYWdlKG9zLnBhdGguZGlybmFtZShwYXRoKSlcblxuICAgICAgICBmdWxsX3BhdGggPSBvcy5wYXRoLmpvaW4oX19zdGlja3l0YXBlX3dvcmtpbmdfZGlyLCBwYXRoKVxuICAgICAgICB3aXRoIG9wZW4oZnVsbF9wYXRoLCBcIndiXCIpIGFzIG1vZHVsZV9maWxlOlxuICAgICAgICAgICAgbW9kdWxlX2ZpbGUud3JpdGUoY29udGVudHMpXG5cbiAgICBpbXBvcnQgc3lzIGFzIF9fc3RpY2t5dGFwZV9zeXNcbiAgICBfX3N0aWNreXRhcGVfc3lzLnBhdGguaW5zZXJ0KDAsIF9fc3RpY2t5dGFwZV93b3JraW5nX2RpcilcblxuICAgIF9fc3RpY2t5dGFwZV93cml0ZV9tb2R1bGUoJ2xpYi9jYWxjLnB5JywgYidkZWYgYWRkKG4xOiBpbnQsIG4yOiBpbnQpIC0+IGludDpcXG4gICAgcmV0dXJuIG4xICsgbjJcXG5cXG5kZWYgc3ViKG4xOiBpbnQsIG4yOiBpbnQpIC0+IGludDpcXG4gICAgcmV0dXJuIG4xIC0gbjJcXG4nKVxuICAgIGZyb20gbGliLmNhbGMgaW1wb3J0IGFkZFxuICAgIFxuICAgIHByaW50KFwiSGVsbG8gV29ybGQgZnJvbSBQeXRob24hXCIpXG4gICAgcHJpbnQoZlwiMiArIDMgPSB7YWRkKDIsIDMpfVwiKVxuICAgIGBcblxuICBjb25zdCBmaWxlUGF0aCA9IFwibWFpbi5weVwiXG5cbiAgY29uc3QgZGlyUGF0aCA9IGZpbGVQYXRoLnNwbGl0KC9cXC8vZ20pLnNsaWNlKDAsIC0xKS5qb2luKFwiXCIpXG4gIGNvbnN0IGltcG9ydFBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKC9cXC8vZ20sIFwiLlwiKS5yZXBsYWNlKC8ucHkkL2dtLCBcIlwiKVxuXG4gIHB5b2RpZGUucnVuUHl0aG9uKGBcbmltcG9ydCBvc1xuaWYgMCA8IGxlbihcIiR7ZGlyUGF0aH1cIik6XG4gICAgb3MubWFrZWRpcnMoXCIke2RpclBhdGh9XCIsIGV4aXN0X29rPVRydWUpXG5cbndpdGggb3BlbihcIiR7ZmlsZVBhdGh9XCIsIFwid1wiKSBhcyBmOlxuICAgIGYud3JpdGUoclwiXCJcIiR7ZmlsZX1cIlwiXCIpXG5gKVxuXG4gIGNvbnN0IHBrZyA9IHB5b2RpZGUucHlpbXBvcnQoaW1wb3J0UGF0aClcbiAgcmV0dXJuIHBrZ1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGltcG9ydDogaW1wb3J0UHl0aG9uUGFja2FnZVxufVxuICAiLCAiXG5mdW5jdGlvbiBpbXBvcnRQeXRob25QYWNrYWdlPFQ+KHB5b2RpZGU6IGFueSk6IFQge1xuICBjb25zdCBmaWxlID0gU3RyaW5nLnJhd2AjIS91c3IvYmluL2VudiBweXRob25cbmltcG9ydCBjb250ZXh0bGliIGFzIF9fc3RpY2t5dGFwZV9jb250ZXh0bGliXG5cbkBfX3N0aWNreXRhcGVfY29udGV4dGxpYi5jb250ZXh0bWFuYWdlclxuZGVmIF9fc3RpY2t5dGFwZV90ZW1wb3JhcnlfZGlyKCk6XG4gICAgaW1wb3J0IHRlbXBmaWxlXG4gICAgaW1wb3J0IHNodXRpbFxuICAgIGRpcl9wYXRoID0gdGVtcGZpbGUubWtkdGVtcCgpXG4gICAgdHJ5OlxuICAgICAgICB5aWVsZCBkaXJfcGF0aFxuICAgIGZpbmFsbHk6XG4gICAgICAgIHNodXRpbC5ybXRyZWUoZGlyX3BhdGgpXG5cbndpdGggX19zdGlja3l0YXBlX3RlbXBvcmFyeV9kaXIoKSBhcyBfX3N0aWNreXRhcGVfd29ya2luZ19kaXI6XG4gICAgZGVmIF9fc3RpY2t5dGFwZV93cml0ZV9tb2R1bGUocGF0aCwgY29udGVudHMpOlxuICAgICAgICBpbXBvcnQgb3MsIG9zLnBhdGhcblxuICAgICAgICBkZWYgbWFrZV9wYWNrYWdlKHBhdGgpOlxuICAgICAgICAgICAgcGFydHMgPSBwYXRoLnNwbGl0KFwiL1wiKVxuICAgICAgICAgICAgcGFydGlhbF9wYXRoID0gX19zdGlja3l0YXBlX3dvcmtpbmdfZGlyXG4gICAgICAgICAgICBmb3IgcGFydCBpbiBwYXJ0czpcbiAgICAgICAgICAgICAgICBwYXJ0aWFsX3BhdGggPSBvcy5wYXRoLmpvaW4ocGFydGlhbF9wYXRoLCBwYXJ0KVxuICAgICAgICAgICAgICAgIGlmIG5vdCBvcy5wYXRoLmV4aXN0cyhwYXJ0aWFsX3BhdGgpOlxuICAgICAgICAgICAgICAgICAgICBvcy5ta2RpcihwYXJ0aWFsX3BhdGgpXG4gICAgICAgICAgICAgICAgICAgIHdpdGggb3Blbihvcy5wYXRoLmpvaW4ocGFydGlhbF9wYXRoLCBcIl9faW5pdF9fLnB5XCIpLCBcIndiXCIpIGFzIGY6XG4gICAgICAgICAgICAgICAgICAgICAgICBmLndyaXRlKGJcIlxcblwiKVxuXG4gICAgICAgIG1ha2VfcGFja2FnZShvcy5wYXRoLmRpcm5hbWUocGF0aCkpXG5cbiAgICAgICAgZnVsbF9wYXRoID0gb3MucGF0aC5qb2luKF9fc3RpY2t5dGFwZV93b3JraW5nX2RpciwgcGF0aClcbiAgICAgICAgd2l0aCBvcGVuKGZ1bGxfcGF0aCwgXCJ3YlwiKSBhcyBtb2R1bGVfZmlsZTpcbiAgICAgICAgICAgIG1vZHVsZV9maWxlLndyaXRlKGNvbnRlbnRzKVxuXG4gICAgaW1wb3J0IHN5cyBhcyBfX3N0aWNreXRhcGVfc3lzXG4gICAgX19zdGlja3l0YXBlX3N5cy5wYXRoLmluc2VydCgwLCBfX3N0aWNreXRhcGVfd29ya2luZ19kaXIpXG5cbiAgICBkZWYgYWRkKG4xOiBpbnQsIG4yOiBpbnQpIC0+IGludDpcbiAgICAgICAgcmV0dXJuIG4xICsgbjJcbiAgICBcbiAgICBkZWYgc3ViKG4xOiBpbnQsIG4yOiBpbnQpIC0+IGludDpcbiAgICAgICAgcmV0dXJuIG4xIC0gbjJcbiAgICBgXG5cbiAgY29uc3QgZmlsZVBhdGggPSBcImxpYi9jYWxjLnB5XCJcblxuICBjb25zdCBkaXJQYXRoID0gZmlsZVBhdGguc3BsaXQoL1xcLy9nbSkuc2xpY2UoMCwgLTEpLmpvaW4oXCJcIilcbiAgY29uc3QgaW1wb3J0UGF0aCA9IGZpbGVQYXRoLnJlcGxhY2UoL1xcLy9nbSwgXCIuXCIpLnJlcGxhY2UoLy5weSQvZ20sIFwiXCIpXG5cbiAgcHlvZGlkZS5ydW5QeXRob24oYFxuaW1wb3J0IG9zXG5pZiAwIDwgbGVuKFwiJHtkaXJQYXRofVwiKTpcbiAgICBvcy5tYWtlZGlycyhcIiR7ZGlyUGF0aH1cIiwgZXhpc3Rfb2s9VHJ1ZSlcblxud2l0aCBvcGVuKFwiJHtmaWxlUGF0aH1cIiwgXCJ3XCIpIGFzIGY6XG4gICAgZi53cml0ZShyXCJcIlwiJHtmaWxlfVwiXCJcIilcbmApXG5cbiAgY29uc3QgcGtnID0gcHlvZGlkZS5weWltcG9ydChpbXBvcnRQYXRoKVxuICByZXR1cm4gcGtnXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW1wb3J0OiBpbXBvcnRQeXRob25QYWNrYWdlXG59XG4gICIsICJpbXBvcnQgeyBsb2FkUHlvZGlkZSB9IGZyb20gXCJweW9kaWRlL3B5b2RpZGVcIlxuXG5pbXBvcnQgUHlNYWluIGZyb20gXCIuLi9weS9tYWluLnB5XCJcblxuaW1wb3J0IFB5Q2FsYyBmcm9tIFwiLi4vcHkvbGliL2NhbGMucHlcIlxuaW1wb3J0IFB5Q2FsY1R5cGUgZnJvbSBcIi4uL3B5L2xpYi9jYWxjXCJcblxuZGVjbGFyZSB2YXIgd2luZG93OiBhbnlcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgcHlvZGlkZSA9IGF3YWl0IGxvYWRQeW9kaWRlKHtcbiAgICBpbmRleFVSTDogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvcHlvZGlkZS92MC4xOS4wL2Z1bGwvXCJcbiAgfSlcblxuICBjb25zb2xlLmxvZyhcInJlYWR5IHB5b2RpZGVcIilcblxuICBjb25zdCBQeU1haW5Qa2cgPSBQeU1haW4uaW1wb3J0PHVua25vd24+KHB5b2RpZGUpXG4gIGNvbnN0IFB5Q2FsY1BrZyA9IFB5Q2FsYy5pbXBvcnQ8dHlwZW9mIFB5Q2FsY1R5cGU+KHB5b2RpZGUpXG5cbiAgd2luZG93LnB5Y2FsYyA9IHtcbiAgICBhZGQ6IFB5Q2FsY1BrZy5hZGQsXG4gICAgc3ViOiBQeUNhbGNQa2cuc3ViLFxuICB9XG59XG5cbm1haW4oKSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFHQSxVQUFJLFlBQVksV0FBWTtBQUkzQixZQUFJLE9BQU8sU0FBUyxhQUFhO0FBQUUsaUJBQU87QUFBQTtBQUMxQyxZQUFJLE9BQU8sV0FB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
