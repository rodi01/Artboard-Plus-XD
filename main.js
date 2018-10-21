module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/dialogs.js":
/*!************************!*\
  !*** ./lib/dialogs.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {getManifest, getNearestIcon} = __webpack_require__(/*! ./manifest.js */ "./lib/manifest.js");

let manifest;

/**
 * Converts a string (or an array of strings or other objects) to a nicer HTML
 * representation. Essentially this is a _very_ basic markdown parser.
 *
 * The following tokens are understood, when encountered at the beginning of
 * a string:
 *
 * Token        | Result
 * -------------|-----------------------
 * `##`         | `<h2>`
 * `###`        | `<h3>`
 * `* `         | Bulleted list
 * `----`       | `<hr class="small">`
 * `---`        | `<hr />`
 * `[...](href)`| `<p><a href="href">...</a></p>`
 *
 * @param {string | string[] | * | Array<*>} str
 * @returns {string} the HTML representation
 */
function strToHtml(str) {
    // allow some common overloads, including arrays and non-strings
    if (Array.isArray(str)) {
        return str.map(str => strToHtml(str)).join('');
    }
    if (typeof str !== 'string') {
        return strToHtml(`${str}`);
    }

    let html = str;

    // handle some markdown stuff
    if (html.substr(0, 2) === '##') {
        html = `<h3>${html.substr(2).trim().toUpperCase()}</h3>`;
    } else if (html.substr(0, 1) === '#') {
        html = `<h2>${html.substr(1).trim()}</h2>`;
    } else if (html.substr(0, 2) === '* ') {
        html = `<p class="list"><span class="bullet margin">•</span><span class="margin">${html.substr(2).trim()}</span></p>`;
    } else if (html.substr(0, 4) === '----') {
        html = `<hr class="small"/>${html.substr(5).trim()}`;
    } else if (html.substr(0, 3) === '---') {
        html = `<hr/>${html.substr(4).trim()}`;
    } else {
        html = `<p>${html.trim()}</p>`;
    }

    // handle links -- the catch here is that the link will transform the entire paragraph!
    const regex = /\[([^\]]*)\]\(([^\)]*)\)/;
    const matches = str.match(regex);
    if (matches) {
        const title = matches[1];
        const url = matches[2];
        html = `<p><a href="${url}">${html.replace(regex, title).replace(/\<\|?p\>/g, '')}</a></p>`;
    }

    return html;
}

/*
 * Generates a "notice" dialog with the title, default icon, and a series of messages.
 *
 * @param {*} param
 * @property {string} param.title The dialog title
 * @property {string} [param.icon] The dialog icon to use. If not provided, no icon will be rendered
 * @property {string[]} param.msgs The messages to render. If a message starts with `http`, it will be rendered as a link.
 * @property {string} [param.prompt] If specified, will render as a prompt with a single input field and the prompt as a placeholder
 * @property {boolean} [param.multiline=false] If `true`, the prompt will render as a multi-line text field.
 * @property {boolean} [param.isError=false] If specified, will render the header in a red color
 * @property {Function} [param.render] If set, the results of this function (a DOM tree) will be appended into the content area of the dialog.
 * @property {Function<String>} [param.template] If set, the results of this function (a string) will be appended into the content area of the dialog.
 * @property {Object[]} [buttons] Indicates the buttons to render. If none are specified, a `Close` button is rendered.
 * @returns {Promise} Resolves to an object of the form {which, value}. `value` only makes sense if `prompt` is set. `which` indicates which button was pressed.
 */
async function createDialog({
    title,
    icon = 'plugin-icon',
    msgs,
    prompt,
    multiline = false,
    render,
    template,
    isError=false,
    buttons=[
        {label: 'Close', variant: 'cta', type:'submit'}
    ]} = {},
    width=360,
    height='auto',
    iconSize=18
) {

    let messages = Array.isArray(msgs) ? msgs : [ msgs ];

    try {
        if (!manifest) {
            manifest = await getManifest();
        }
    } catch (err) {
        // do nothing
    }

    let usingPluginIcon = false;
    if (icon === 'plugin-icon') {
        if (manifest.icons) {
            usingPluginIcon = true;
            iconSize = 24;
            icon = getNearestIcon(manifest, iconSize);
        }
    }

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
<style>
    form {
        width: ${width}px;
    }
    .h1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .h1 img {
        width: ${iconSize}px;
        height: ${iconSize}px;
        flex: 0 0 ${iconSize}px;
        padding: 0;
        margin: 0;
    }
    img.plugin-icon {
        border-radius: 4px;
        overflow: hidden;
    }
    .list {
        display: flex;
        flex-direction: row;
    }
    .list .margin {
        margin-bottom: 0;
        margin-left: 0;
    }
    .list span {
        flex: 0 0 auto;
        border: 1px solid transparent;
    }
    .list .bullet {
        text-align: center;
    }
    .list + .list {
        margin-top: 0;
    }
    textarea {
        height: 200px;
    }
    .container {
        zoverflow-x: hidden;
        overflow-y: auto;
        height: ${height === 'auto' ? height : `${height}px`};
    }
</style>
<form method="dialog">
    <h1 class="h1">
        <span ${isError ? `class="color-red"` : ""}>${title}</span>
        ${icon ? `<img ${usingPluginIcon ? `class="plugin-icon" title="${manifest.name}"` : ''} src="${icon}" />` : ''}
    </h1>
    <hr />
    <div class="container">
        ${
            !render && (
                template ? template() : (
                    messages.map(msg => strToHtml(msg)).join('') +
                    (prompt ? `<label>${
                        multiline ?
                        `<textarea id="prompt" placeholder="${prompt}"></textarea>` :
                        `<input type="text" id="prompt" placeholder="${prompt}" />`
                    }</label>` : '')
                )
            )
        }
    </div>
    <footer>
        ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
    </footer>
</form>
    `;

    // if render fn is passed, we'll call it and attach the DOM tree
    if (render) {
        dialog.querySelector(".container").appendChild(render());
    }

    // The "ok" and "cancel" button indices. OK buttons are "submit" or "cta" buttons. Cancel buttons are "reset" buttons.
    let okButtonIdx = -1;
    let cancelButtonIdx = -1;
    let clickedButtonIdx = -1;

    // Ensure that the form can submit when the user presses ENTER (we trigger the OK button here)
    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

    // Attach button event handlers and set ok and cancel indices
    buttons.forEach(({type, variant} = {}, idx) => {
        const button = dialog.querySelector(`#btn${idx}`);
        if (type === 'submit' || variant === 'cta') {
            okButtonIdx = idx;
        }
        if (type === 'reset') {
            cancelButtonIdx = idx;
        }
        button.onclick = e => {
            e.preventDefault();
            clickedButtonIdx = idx;
            dialog.close( idx === cancelButtonIdx ? 'reasonCanceled' : 'ok');
        }
    });

    try {
        document.appendChild(dialog);
        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            // user hit ESC
            return {which: cancelButtonIdx, value: ''};
        } else {
            if (clickedButtonIdx === -1) {
                // user pressed ENTER, so no button was clicked!
                clickedButtonIdx = okButtonIdx; // may still be -1, but we tried
            }
            return {which: clickedButtonIdx, value: prompt ? dialog.querySelector('#prompt').value : ''};
        }
    } catch(err) {
        // system refused the dialog
        return {which: cancelButtonIdx, value: ''};
    } finally {
        dialog.remove();
    }
}

/**
 * Generates an alert message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function alert(title, ...msgs) {
    return createDialog({title, msgs});
}

/**
 * Generates a warning message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function error(title, ...msgs) {
    return createDialog({title, isError: true, msgs});
}

/**
 * Displays a confirmation dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function confirm(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
        {label: buttons[0], type:'reset', variant: 'primary'},
        {label: buttons[1], type:'submit', variant: 'cta'}
    ]});
}

/**
 * Displays a warning dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function warning(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
        {label: buttons[0], type:'submit', variant: 'primary'},
        {label: buttons[1], type:'button', variant: 'warning'}
    ]});
}

/**
 * Displays a warning dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string} prompt
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @param {boolean} [multiline = false] If `true`, a multiline textarea will be used instead of a single line editor.
 * @returns {Promise<{which: number, value: string}>} `which` indicates which button was clicked, and `value` indicates the entered value in the text field.
 */
async function prompt(title, msg, prompt, buttons = [ 'Cancel', 'OK' ], multiline = false) {
    return createDialog({title, msgs: [msg], prompt, multiline, buttons: [
        {label: buttons[0], type:'reset', variant: 'primary'},
        {label: buttons[1], type:'submit', variant: 'cta'}
    ]});
}

module.exports = {
    createDialog,
    alert,
    error,
    confirm,
    warning,
    prompt
};

/***/ }),

/***/ "./lib/manifest.js":
/*!*************************!*\
  !*** ./lib/manifest.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2018 Adobe Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let manifest;

/**
 * Reads the plugin's manifest and returns the parsed contents.
 *
 * Throws if the manifest is invalid or doesn't exist.
 *
 * Note: Reads manifest only once. Future calls will not reload
 * the manifest file.
 */
async function getManifest() {
    if (!manifest) {
        const fs = __webpack_require__(/*! uxp */ "uxp").storage.localFileSystem;
        const dataFolder = await fs.getPluginFolder();
        const manifestFile = await dataFolder.getEntry("manifest.json");
        if (manifestFile) {
            const json = await manifestFile.read();
            manifest = JSON.parse(json);
        }
    }
    return manifest;
}

/**
 * Return the icon path that can fit the requested size without upscaling.
 *
 * @param {*} manifest
 * @param {number} size
 * @returns {string} path to the icon
 */
function getNearestIcon(manifest, size) {
    if (!manifest) {
        return;
    }

    if (manifest.icons) {
        // icons is an array of objects of the form
        // { width, height, path }

        // icons are assumed to be square, so we'll sort descending on the width
        const sortedIcons = manifest.icons.sort((a, b) => {
            const iconAWidth = a.width;
            const iconBWidth = b.width;
            return iconAWidth < iconBWidth ? 1 : iconAWidth > iconBWidth ? -1 : 0;
        });

        // next, search until we find an icon _too_ small for the desired size
        const icon = sortedIcons.reduce((last, cur) => {
            if (!last) {
                last = cur;
            } else {
                if (cur.width >= size) {
                    last = cur;
                }
            }
            return last;
        });

        return icon.path;
    }
}

module.exports = {
    getManifest,
    getNearestIcon
}

/***/ }),

/***/ "./node_modules/array-sort/index.js":
/*!******************************************!*\
  !*** ./node_modules/array-sort/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * array-sort <https://github.com/jonschlinkert/array-sort>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */



var defaultCompare = __webpack_require__(/*! default-compare */ "./node_modules/default-compare/index.js");
var typeOf = __webpack_require__(/*! kind-of */ "./node_modules/kind-of/index.js");
var get = __webpack_require__(/*! get-value */ "./node_modules/get-value/index.js");

/**
 * Sort an array of objects by one or more properties.
 *
 * @param  {Array} `arr` The Array to sort.
 * @param  {String|Array|Function} `props` One or more object paths or comparison functions.
 * @param  {Object} `opts` Pass `{ reverse: true }` to reverse the sort order.
 * @return {Array} Returns a sorted array.
 * @api public
 */

function arraySort(arr, props, opts) {
  if (arr == null) {
    return [];
  }

  if (!Array.isArray(arr)) {
    throw new TypeError('array-sort expects an array.');
  }

  if (arguments.length === 1) {
    return arr.sort();
  }

  var args = flatten([].slice.call(arguments, 1));

  // if the last argument appears to be a plain object,
  // it's not a valid `compare` arg, so it must be options.
  if (typeOf(args[args.length - 1]) === 'object') {
    opts = args.pop();
  }
  return arr.sort(sortBy(args, opts));
}

/**
 * Iterate over each comparison property or function until `1` or `-1`
 * is returned.
 *
 * @param  {String|Array|Function} `props` One or more object paths or comparison functions.
 * @param  {Object} `opts` Pass `{ reverse: true }` to reverse the sort order.
 * @return {Array}
 */

function sortBy(props, opts) {
  opts = opts || {};

  return function compareFn(a, b) {
    var len = props.length, i = -1;
    var result;

    while (++i < len) {
      result = compare(props[i], a, b);
      if (result !== 0) {
        break;
      }
    }
    if (opts.reverse === true) {
      return result * -1;
    }
    return result;
  };
}

/**
 * Compare `a` to `b`. If an object `prop` is passed, then
 * `a[prop]` is compared to `b[prop]`
 */

function compare(prop, a, b) {
  if (typeof prop === 'function') {
    // expose `compare` to custom function
    return prop(a, b, compare.bind(null, null));
  }
  // compare object values
  if (prop && typeof a === 'object' && typeof b === 'object') {
    return compare(null, get(a, prop), get(b, prop));
  }
  return defaultCompare(a, b);
}

/**
 * Flatten the given array.
 */

function flatten(arr) {
  return [].concat.apply([], arr);
}

/**
 * Expose `arraySort`
 */

module.exports = arraySort;


/***/ }),

/***/ "./node_modules/default-compare/index.js":
/*!***********************************************!*\
  !*** ./node_modules/default-compare/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var typeOf = __webpack_require__(/*! kind-of */ "./node_modules/kind-of/index.js");

/**
 * Basic sort algorithm that has similar behavior to `Array.prototype.sort`
 * for null and undefined, but also allows sorting by an object property.
 *
 * @param {Mixed} `a` First value to compare.
 * @param {Mixed} `b` Second value to compare.
 * @param {String} `prop` Optional property to use when comparing objects. If specified must be a string.
 * @return {Number} Returns 1 when `a` should come after `b`, -1 when `a` should come before `b`, and 0 when `a` and `b` are equal.
 * @api public
 */

module.exports = function defaultCompare(a, b, prop) {
  if (prop != null && typeOf(prop) !== 'string') {
    throw new TypeError('expected "prop" to be undefined or a string');
  }

  var typeA = typeOf(a);
  var typeB = typeOf(b);

  if (prop) {
    if (typeA === 'object') {
      a = a[prop];
      typeA = typeOf(a);
    }
    if (typeB === 'object') {
      b = b[prop];
      typeB = typeOf(b);
    }
  }

  if (typeA === 'null') {
    return typeB === 'null' ? 0 : (typeB === 'undefined' ? -1 : 1);
  } else if (typeA === 'undefined') {
    return typeB === 'null' ? 1 : (typeB === 'undefined' ? 0 : 1);
  } else if (typeB === 'null' || typeB === 'undefined') {
    return -1;
  } else {
    return a < b ? -1 : (a > b ? 1 : 0);
  }
};


/***/ }),

/***/ "./node_modules/get-value/index.js":
/*!*****************************************!*\
  !*** ./node_modules/get-value/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function(obj, prop, a, b, c) {
  if (!isObject(obj) || !prop) {
    return obj;
  }

  prop = toString(prop);

  // allowing for multiple properties to be passed as
  // a string or array, but much faster (3-4x) than doing
  // `[].slice.call(arguments)`
  if (a) prop += '.' + toString(a);
  if (b) prop += '.' + toString(b);
  if (c) prop += '.' + toString(c);

  if (prop in obj) {
    return obj[prop];
  }

  var segs = prop.split('.');
  var len = segs.length;
  var i = -1;

  while (obj && (++i < len)) {
    var key = segs[i];
    while (key[key.length - 1] === '\\') {
      key = key.slice(0, -1) + '.' + segs[++i];
    }
    obj = obj[key];
  }
  return obj;
};

function isObject(val) {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
}

function toString(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.join('.');
  }
  return val;
}


/***/ }),

/***/ "./node_modules/kind-of/index.js":
/*!***************************************!*\
  !*** ./node_modules/kind-of/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function kindOf(val) {
  var type = typeof val;

  // primitivies
  if (type === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (type === 'string' || val instanceof String) {
    return 'string';
  }
  if (type === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (type === 'function' || val instanceof Function) {
    if (typeof val.constructor.name !== 'undefined' && val.constructor.name.slice(0, 9) === 'Generator') {
      return 'generatorfunction';
    }
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  type = toString.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }
  if (type === '[object Promise]') {
    return 'promise';
  }

  // buffer
  if (isBuffer(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }
  
  if (type === '[object Map Iterator]') {
    return 'mapiterator';
  }
  if (type === '[object Set Iterator]') {
    return 'setiterator';
  }
  if (type === '[object String Iterator]') {
    return 'stringiterator';
  }
  if (type === '[object Array Iterator]') {
    return 'arrayiterator';
  }
  
  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  return val.constructor
    && typeof val.constructor.isBuffer === 'function'
    && val.constructor.isBuffer(val);
}


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dialog = __webpack_require__(/*! ../lib/dialogs.js */ "./lib/dialogs.js")
const wrapSelection = __webpack_require__(/*! ./wrapSelection.js */ "./src/wrapSelection.js")
const sortArtboards = __webpack_require__(/*! ./sortArtboards.js */ "./src/sortArtboards.js")

function notImplemented() {
  dialog.alert("Boo! 👻", "Not Implemented")
}

module.exports = {
  commands: {
    wrapSelection: wrapSelection,
    sortAZ: sortArtboards.sortAZ,
    sortZA: sortArtboards.sortZA,
    notImplemented: notImplemented
  }
}


/***/ }),

/***/ "./src/sortArtboards.js":
/*!******************************!*\
  !*** ./src/sortArtboards.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const commands = __webpack_require__(/*! commands */ "commands")
const arraySort = __webpack_require__(/*! array-sort */ "./node_modules/array-sort/index.js")

function isArtboard(node) {
  return node.constructor.name === "Artboard"
}

function sort(selection, sortedArboards) {
  // No artboards check
  if (sortedArboards.length <= 0) return

  sortedArboards.forEach(node => {
    selection.items = node
    commands.bringToFront()
  })
  selection.items = []
}

function sortAZ(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(
    documentRoot.children.filter(node => isArtboard(node)),
    "name",
    { reverse: true }
  )
  sort(selection, sortedArboards)
}

function sortZA(selection, documentRoot) {
  // @ts-ignore
  const sortedArboards = arraySort(
    documentRoot.children.filter(node => isArtboard(node)),
    "name"
  )

  sort(selection, sortedArboards)
}

module.exports = {
  sortAZ: sortAZ,
  sortZA: sortZA
}


/***/ }),

/***/ "./src/wrapSelection.js":
/*!******************************!*\
  !*** ./src/wrapSelection.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { Artboard, Color } = __webpack_require__(/*! scenegraph */ "scenegraph")
const commands = __webpack_require__(/*! commands */ "commands")
const dialog = __webpack_require__(/*! ../lib/dialogs.js */ "./lib/dialogs.js")

function wrapSelection(selection, documentRoot) {
  if (selection.items.length <= 0) {
    dialog.alert(
      "Wrap Around Selection 🤘",
      "You need to select at least one layer."
    )
    return
  } else if (selection.hasArtboards) {
    dialog.alert(
      "Wrap Around Selection 🤘",
      "Artbord can't be created around another artboard. Please de-select artboard."
    )
    return
  }
  commands.group()
  const group = selection.items[0]
  const properties = {
    width: group.globalBounds.width,
    height: group.globalBounds.height,
    y: group.globalBounds.y,
    x: group.globalBounds.x
  }

  commands.ungroup()
  const artboard = new Artboard()
  artboard.width = properties.width
  artboard.height = properties.height
  artboard.name = "Artboard"
  artboard.fill = new Color("#ffffff")

  documentRoot.addChild(artboard, 0)
  artboard.moveInParentCoordinates(properties.x, properties.y)
}
module.exports = wrapSelection


/***/ }),

/***/ "commands":
/*!***************************!*\
  !*** external "commands" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("commands");

/***/ }),

/***/ "scenegraph":
/*!*****************************!*\
  !*** external "scenegraph" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("scenegraph");

/***/ }),

/***/ "uxp":
/*!**********************!*\
  !*** external "uxp" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uxp");

/***/ })

/******/ });