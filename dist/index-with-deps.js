(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["skatejsGithubIo"] = factory();
	else
		root["skatejsGithubIo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.App = undefined;
	
	__webpack_require__(1);
	
	__webpack_require__(2);
	
	var _index = __webpack_require__(6);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _index3 = __webpack_require__(33);
	
	var _index4 = _interopRequireDefault(_index3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.head.innerHTML += '<style>' + _index4.default + '</style>';
	exports.App = _index2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/**
	 * @license
	 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	 */
	
	/**
	 * 2.3
	 * http://w3c.github.io/webcomponents/spec/custom/#dfn-element-definition
	 * @typedef {{
	 *  name: string,
	 *  localName: string,
	 *  constructor: Function,
	 *  connectedCallback: Function,
	 *  disconnectedCallback: Function,
	 *  attributeChangedCallback: Function,
	 *  observedAttributes: Array<string>,
	 * }}
	 */
	var CustomElementDefinition;
	
	(function () {
	  'use strict';
	
	  var doc = document;
	  var win = window;
	
	  // name validation
	  // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
	
	  /**
	   * @const
	   * @type {Array<string>}
	   */
	  var reservedTagList = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
	
	  /** @const */
	  var customNameValidation = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/;
	  function isValidCustomElementName(name) {
	    return customNameValidation.test(name) && reservedTagList.indexOf(name) === -1;
	  }
	
	  function createTreeWalker(root) {
	    // IE 11 requires the third and fourth arguments be present. If the third
	    // arg is null, it applies the default behaviour. However IE also requires
	    // the fourth argument be present even though the other browsers ignore it.
	    return doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
	  }
	
	  function isElement(node) {
	    return node.nodeType === Node.ELEMENT_NODE;
	  }
	
	  /**
	   * A registry of custom element definitions.
	   *
	   * See https://html.spec.whatwg.org/multipage/scripting.html#customelementsregistry
	   *
	   * @constructor
	   * @property {boolean} polyfilled Whether this registry is polyfilled
	   * @property {boolean} enableFlush Set to true to enable the flush() method
	   *   to work. This should only be done for tests, as it causes a memory leak.
	   */
	  function CustomElementsRegistry() {
	    /** @private {Map<string, CustomElementDefinition>} **/
	    this._definitions = new Map();
	
	    /** @private {Map<Function, CustomElementDefinition>} **/
	    this._constructors = new Map();
	
	    this._whenDefinedMap = new Map();
	
	    /** @private {Set<MutationObserver>} **/
	    this._observers = new Set();
	
	    /** @private {MutationObserver} **/
	    this._attributeObserver = new MutationObserver(this._handleAttributeChange.bind(this));
	
	    /** @private {HTMLElement} **/
	    this._newInstance = null;
	
	    this.polyfilled = true;
	    this.enableFlush = false;
	
	    this._observeRoot(document);
	  }
	
	  CustomElementsRegistry.prototype = {
	
	    // HTML spec part 4.13.4
	    // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-define
	    define: function define(name, constructor, options) {
	      name = name.toString().toLowerCase();
	
	      // 1:
	      if (typeof constructor !== 'function') {
	        throw new TypeError('constructor must be a Constructor');
	      }
	
	      // 2. If constructor is an interface object whose corresponding interface
	      //    either is HTMLElement or has HTMLElement in its set of inherited
	      //    interfaces, throw a TypeError and abort these steps.
	      //
	      // It doesn't appear possible to check this condition from script
	
	      // 3:
	      if (!isValidCustomElementName(name)) {
	        throw new SyntaxError('The element name \'' + name + '\' is not valid.');
	      }
	
	      // 4, 5:
	      // Note: we don't track being-defined names and constructors because
	      // define() isn't normally reentrant. The only time user code can run
	      // during define() is when getting callbacks off the prototype, which
	      // would be highly-unusual. We can make define() reentrant-safe if needed.
	      if (this._definitions.has(name)) {
	        throw new Error('An element with name \'' + name + '\' is already defined');
	      }
	
	      // 6, 7:
	      if (this._constructors.has(constructor)) {
	        throw new Error('Definition failed for \'' + name + '\': ' + 'The constructor is already used.');
	      }
	
	      // 8:
	      var localName = name;
	
	      // 9, 10: We do not support extends currently.
	
	      // 11, 12, 13: Our define() isn't rentrant-safe
	
	      // 14.1:
	      var prototype = constructor.prototype;
	
	      // 14.2:
	      if ((typeof prototype === 'undefined' ? 'undefined' : _typeof(prototype)) !== 'object') {
	        throw new TypeError('Definition failed for \'' + name + '\': ' + 'constructor.prototype must be an object');
	      }
	
	      function getCallback(calllbackName) {
	        var callback = prototype[calllbackName];
	        if (callback !== undefined && typeof callback !== 'function') {
	          throw new Error(localName + ' \'' + calllbackName + '\' is not a Function');
	        }
	        return callback;
	      }
	
	      // 3, 4:
	      var connectedCallback = getCallback('connectedCallback');
	
	      // 5, 6:
	      var disconnectedCallback = getCallback('disconnectedCallback');
	
	      // Divergence from spec: we always throw if attributeChangedCallback is
	      // not a function, and always get observedAttributes.
	
	      // 7, 9.1:
	      var attributeChangedCallback = getCallback('attributeChangedCallback');
	
	      // 8, 9.2, 9.3:
	      var observedAttributes = constructor['observedAttributes'] || [];
	
	      // 15:
	      // @type {CustomElementDefinition}
	      var definition = {
	        name: name,
	        localName: localName,
	        constructor: constructor,
	        connectedCallback: connectedCallback,
	        disconnectedCallback: disconnectedCallback,
	        attributeChangedCallback: attributeChangedCallback,
	        observedAttributes: observedAttributes
	      };
	
	      // 16:
	      this._definitions.set(localName, definition);
	      this._constructors.set(constructor, localName);
	
	      // 17, 18, 19:
	      this._addNodes(doc.childNodes);
	
	      // 20:
	      var deferred = this._whenDefinedMap.get(localName);
	      if (deferred) {
	        deferred.resolve(undefined);
	        this._whenDefinedMap.delete(localName);
	      }
	    },
	
	    /**
	     * Returns the constructor defined for `name`, or `null`.
	     *
	     * @param {string} name
	     * @return {Function|undefined}
	     */
	    get: function get(name) {
	      // https://html.spec.whatwg.org/multipage/scripting.html#custom-elements-api
	      var def = this._definitions.get(name);
	      return def ? def.constructor : undefined;
	    },
	
	    /**
	     * Returns a `Promise` that resolves when a custom element for `name` has
	     * been defined.
	     *
	     * @param {string} name
	     * @return {Promise}
	     */
	    whenDefined: function whenDefined(name) {
	      // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-whendefined
	      if (!customNameValidation.test(name)) {
	        return Promise.reject(new SyntaxError('The element name \'' + name + '\' is not valid.'));
	      }
	      if (this._definitions.has(name)) {
	        return Promise.resolve();
	      }
	      var deferred = {
	        promise: null
	      };
	      deferred.promise = new Promise(function (resolve, _) {
	        deferred.resolve = resolve;
	      });
	      this._whenDefinedMap.set(name, deferred);
	      return deferred.promise;
	    },
	
	    /**
	     * Causes all pending mutation records to be processed, and thus all
	     * customization, upgrades and custom element reactions to be called.
	     * `enableFlush` must be true for this to work. Only use during tests!
	     */
	    flush: function flush() {
	      if (this.enableFlush) {
	        console.warn("flush!!!");
	        this._observers.forEach(function (observer) {
	          this._handleMutations(observer.takeRecords());
	        }, this);
	      }
	    },
	
	    _setNewInstance: function _setNewInstance(instance) {
	      this._newInstance = instance;
	    },
	
	    /**
	     * Observes a DOM root for mutations that trigger upgrades and reactions.
	     * @private
	     */
	    _observeRoot: function _observeRoot(root) {
	      root.__observer = new MutationObserver(this._handleMutations.bind(this));
	      root.__observer.observe(root, { childList: true, subtree: true });
	      if (this.enableFlush) {
	        // this is memory leak, only use in tests
	        this._observers.add(root.__observer);
	      }
	    },
	
	    /**
	     * @private
	     */
	    _unobserveRoot: function _unobserveRoot(root) {
	      if (root.__observer) {
	        root.__observer.disconnect();
	        root.__observer = null;
	        if (this.enableFlush) {
	          this._observers.delete(root.__observer);
	        }
	      }
	    },
	
	    /**
	     * @private
	     */
	    _handleMutations: function _handleMutations(mutations) {
	      for (var i = 0; i < mutations.length; i++) {
	        var mutation = mutations[i];
	        if (mutation.type === 'childList') {
	          // Note: we can't get an ordering between additions and removals, and
	          // so might diverge from spec reaction ordering
	          this._addNodes(mutation.addedNodes);
	          this._removeNodes(mutation.removedNodes);
	        }
	      }
	    },
	
	    /**
	     * @param {NodeList} nodeList
	     * @private
	     */
	    _addNodes: function _addNodes(nodeList) {
	      for (var i = 0; i < nodeList.length; i++) {
	        var root = nodeList[i];
	
	        if (!isElement(root)) {
	          continue;
	        }
	
	        // Since we're adding this node to an observed tree, we can unobserve
	        this._unobserveRoot(root);
	
	        var walker = createTreeWalker(root);
	        do {
	          var node = /** @type {HTMLElement} */walker.currentNode;
	          var definition = this._definitions.get(node.localName);
	          if (definition) {
	            if (!node.__upgraded) {
	              this._upgradeElement(node, definition, true);
	            }
	            if (node.__upgraded && !node.__attached) {
	              node.__attached = true;
	              if (definition && definition.connectedCallback) {
	                definition.connectedCallback.call(node);
	              }
	            }
	          }
	          if (node.shadowRoot) {
	            // TODO(justinfagnani): do we need to check that the shadowRoot
	            // is observed?
	            this._addNodes(node.shadowRoot.childNodes);
	          }
	          if (node.tagName === 'LINK') {
	            var onLoad = function () {
	              var link = node;
	              return function () {
	                link.removeEventListener('load', onLoad);
	                this._observeRoot(link.import);
	                this._addNodes(link.import.childNodes);
	              }.bind(this);
	            }.bind(this)();
	            if (node.import) {
	              onLoad();
	            } else {
	              node.addEventListener('load', onLoad);
	            }
	          }
	        } while (walker.nextNode());
	      }
	    },
	
	    /**
	     * @param {NodeList} nodeList
	     * @private
	     */
	    _removeNodes: function _removeNodes(nodeList) {
	      for (var i = 0; i < nodeList.length; i++) {
	        var root = nodeList[i];
	
	        if (!isElement(root)) {
	          continue;
	        }
	
	        // Since we're detatching this element from an observed root, we need to
	        // reobserve it.
	        // TODO(justinfagnani): can we do this in a microtask so we don't thrash
	        // on creating and destroying MutationObservers on batch DOM mutations?
	        this._observeRoot(root);
	
	        var walker = createTreeWalker(root);
	        do {
	          var node = walker.currentNode;
	          if (node.__upgraded && node.__attached) {
	            node.__attached = false;
	            var definition = this._definitions.get(node.localName);
	            if (definition && definition.disconnectedCallback) {
	              definition.disconnectedCallback.call(node);
	            }
	          }
	        } while (walker.nextNode());
	      }
	    },
	
	    /**
	     * Upgrades or customizes a custom element.
	     *
	     * @param {HTMLElement} element
	     * @param {CustomElementDefinition} definition
	     * @param {boolean} callConstructor
	     * @private
	     */
	    _upgradeElement: function _upgradeElement(element, definition, callConstructor) {
	      var prototype = definition.constructor.prototype;
	      element.__proto__ = prototype;
	      if (callConstructor) {
	        this._setNewInstance(element);
	        element.__upgraded = true;
	        new definition.constructor();
	        console.assert(this._newInstance == null);
	      }
	
	      var observedAttributes = definition.observedAttributes;
	      if (definition.attributeChangedCallback && observedAttributes.length > 0) {
	        this._attributeObserver.observe(element, {
	          attributes: true,
	          attributeOldValue: true,
	          attributeFilter: observedAttributes
	        });
	
	        // Trigger attributeChangedCallback for existing attributes.
	        // https://html.spec.whatwg.org/multipage/scripting.html#upgrades
	        for (var i = 0; i < observedAttributes.length; i++) {
	          var name = observedAttributes[i];
	          if (element.hasAttribute(name)) {
	            var value = element.getAttribute(name);
	            element.attributeChangedCallback(name, null, value);
	          }
	        }
	      }
	    },
	
	    /**
	     * @private
	     */
	    _handleAttributeChange: function _handleAttributeChange(mutations) {
	      for (var i = 0; i < mutations.length; i++) {
	        var mutation = mutations[i];
	        if (mutation.type === 'attributes') {
	          var name = mutation.attributeName;
	          var oldValue = mutation.oldValue;
	          var target = mutation.target;
	          var newValue = target.getAttribute(name);
	          var namespace = mutation.attributeNamespace;
	          target['attributeChangedCallback'](name, oldValue, newValue, namespace);
	        }
	      }
	    }
	  };
	
	  // Closure Compiler Exports
	  window['CustomElementsRegistry'] = CustomElementsRegistry;
	  CustomElementsRegistry.prototype['define'] = CustomElementsRegistry.prototype.define;
	  CustomElementsRegistry.prototype['get'] = CustomElementsRegistry.prototype.get;
	  CustomElementsRegistry.prototype['whenDefined'] = CustomElementsRegistry.prototype.whenDefined;
	  CustomElementsRegistry.prototype['flush'] = CustomElementsRegistry.prototype.flush;
	  CustomElementsRegistry.prototype['polyfilled'] = CustomElementsRegistry.prototype.polyfilled;
	  CustomElementsRegistry.prototype['enableFlush'] = CustomElementsRegistry.prototype.enableFlush;
	
	  // patch window.HTMLElement
	
	  var origHTMLElement = win.HTMLElement;
	  win.HTMLElement = function HTMLElement() {
	    var customElements = win['customElements'];
	    if (customElements._newInstance) {
	      var i = customElements._newInstance;
	      customElements._newInstance = null;
	      return i;
	    }
	    if (this.constructor) {
	      var tagName = customElements._constructors.get(this.constructor);
	      return doc._createElement(tagName, false);
	    }
	    throw new Error('unknown constructor. Did you call customElements.define()?');
	  };
	  win.HTMLElement.prototype = Object.create(origHTMLElement.prototype);
	  Object.defineProperty(win.HTMLElement.prototype, 'constructor', { value: win.HTMLElement });
	
	  // patch all built-in subclasses of HTMLElement to inherit from the new HTMLElement
	  // See https://html.spec.whatwg.org/multipage/indices.html#element-interfaces
	
	  /** @const */
	  var htmlElementSubclasses = ['Button', 'Canvas', 'Data', 'Head', 'Mod', 'TableCell', 'TableCol', 'Anchor', 'Area', 'Base', 'Body', 'BR', 'DataList', 'Details', 'Dialog', 'Div', 'DList', 'Embed', 'FieldSet', 'Form', 'Heading', 'HR', 'Html', 'IFrame', 'Image', 'Input', 'Keygen', 'Label', 'Legend', 'LI', 'Link', 'Map', 'Media', 'Menu', 'MenuItem', 'Meta', 'Meter', 'Object', 'OList', 'OptGroup', 'Option', 'Output', 'Paragraph', 'Param', 'Picture', 'Pre', 'Progress', 'Quote', 'Script', 'Select', 'Slot', 'Source', 'Span', 'Style', 'TableCaption', 'Table', 'TableRow', 'TableSection', 'Template', 'TextArea', 'Time', 'Title', 'Track', 'UList', 'Unknown'];
	
	  for (var i = 0; i < htmlElementSubclasses.length; i++) {
	    var ctor = window['HTML' + htmlElementSubclasses[i] + 'Element'];
	    if (ctor) {
	      ctor.prototype.__proto__ = win.HTMLElement.prototype;
	    }
	  }
	
	  // patch doc.createElement
	
	  var rawCreateElement = doc.createElement;
	  doc._createElement = function (tagName, callConstructor) {
	    var customElements = win['customElements'];
	    var element = rawCreateElement.call(doc, tagName);
	    var definition = customElements._definitions.get(tagName.toLowerCase());
	    if (definition) {
	      customElements._upgradeElement(element, definition, callConstructor);
	    }
	    customElements._observeRoot(element);
	    return element;
	  };
	  doc.createElement = function (tagName) {
	    return doc._createElement(tagName, true);
	  };
	
	  // patch doc.createElementNS
	
	  var HTMLNS = 'http://www.w3.org/1999/xhtml';
	  var _origCreateElementNS = doc.createElementNS;
	  doc.createElementNS = function (namespaceURI, qualifiedName) {
	    if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
	      return doc.createElement(qualifiedName);
	    } else {
	      return _origCreateElementNS.call(document, namespaceURI, qualifiedName);
	    }
	  };
	
	  // patch Element.attachShadow
	
	  var _origAttachShadow = Element.prototype['attachShadow'];
	  if (_origAttachShadow) {
	    Object.defineProperty(Element.prototype, 'attachShadow', {
	      value: function value(options) {
	        var root = _origAttachShadow.call(this, options);
	        var customElements = win['customElements'];
	        customElements._observeRoot(root);
	        return root;
	      }
	    });
	  }
	
	  /** @type {CustomElementsRegistry} */
	  window['customElements'] = new CustomElementsRegistry();
	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, __webpack_require__(3), __webpack_require__(5)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.skatejsNamedSlots = global.skatejsNamedSlots || {}, global.debounce, global.customEventPolyfill);
	})(undefined, function (exports, debounce, customEventPolyfill) {
	
	  debounce = 'default' in debounce ? debounce['default'] : debounce;
	
	  function eachChildNode(node, func) {
	    if (!node) {
	      return;
	    }
	
	    var chs = node.childNodes;
	    var chsLen = chs.length;
	    for (var a = 0; a < chsLen; a++) {
	      var ret = func(chs[a], a, chs);
	      if (typeof ret !== 'undefined') {
	        return ret; // eslint-disable-line consistent-return
	      }
	    }
	  }
	
	  // Re-implemented to avoid Array.prototype.slice.call for performance reasons
	  function reverse(arr) {
	    var reversedArray = [];
	    for (var i = arr.length - 1; i >= 0; i--) {
	      reversedArray.push(arr[i]);
	    }
	    return reversedArray;
	  }
	
	  /**
	   * Execute func over all child nodes or a document fragment, or a single node
	   * @param node the node or document fragment
	   * @param func a function to execute on node or the children of node, if node is a document fragment.
	   *        func may optionally append the node elsewhere, in the case of a document fragment
	   */
	  function eachNodeOrFragmentNodes(node, func) {
	    if (node instanceof DocumentFragment) {
	      var chs = node.childNodes;
	      var chsLen = chs.length;
	
	      // We must iterate in reverse to handle the case where child nodes are moved elsewhere during execution
	      for (var a = chsLen - 1; a >= 0; a--) {
	        var thisNode = reverse(node.childNodes)[a];
	        func(thisNode, a);
	      }
	    } else {
	      func(node, 0);
	    }
	  }
	
	  var div = document.createElement('div');
	
	  function getPrototype(obj, key) {
	    var descriptor = void 0;
	
	    while (obj && !(descriptor = Object.getOwnPropertyDescriptor(obj, key))) {
	      // eslint-disable-line no-cond-assign
	      obj = Object.getPrototypeOf(obj);
	    }
	    return descriptor;
	  }
	  function getPropertyDescriptor(obj, key) {
	    if (obj instanceof Node) {
	      obj = div;
	    }
	    var proto = getPrototype(obj, key);
	
	    if (proto) {
	      var getter = proto.get;
	      var setter = proto.set;
	      var _descriptor = {
	        configurable: true,
	        enumerable: true
	      };
	
	      if (getter) {
	        _descriptor.get = getter;
	        _descriptor.set = setter;
	        return _descriptor;
	      } else if (typeof obj[key] === 'function') {
	        _descriptor.value = obj[key];
	        return _descriptor;
	      }
	    }
	
	    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	    if (descriptor && descriptor.get) {
	      return descriptor;
	    }
	  }
	
	  var nativeParentNode = getPropertyDescriptor(Element.prototype, 'innerHTML');
	
	  var canPatchNativeAccessors = !!nativeParentNode;
	
	  /**
	   * See https://w3c.github.io/DOM-Parsing/#serializing
	   * @param {TextNode}
	   * @returns {string}
	   */
	  function getEscapedTextContent(textNode) {
	    return textNode.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	  }
	
	  /**
	   * @returns {string}
	   * @param {commentNode}
	   */
	  function getCommentNodeOuterHtml(commentNode) {
	    return commentNode.text || "<!--" + commentNode.textContent + "-->";
	  }
	
	  function isSlotNode(node) {
	    return node.tagName === 'SLOT';
	  }
	
	  function findSlots(root) {
	    var slots = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	    var childNodes = root.childNodes;
	
	    if (!childNodes || root.nodeType !== Node.ELEMENT_NODE) {
	      return slots;
	    }
	
	    var length = childNodes.length;
	
	    for (var a = 0; a < length; a++) {
	      var childNode = childNodes[a];
	
	      if (isSlotNode(childNode)) {
	        slots.push(childNode);
	      }
	      findSlots(childNode, slots);
	    }
	
	    return slots;
	  }
	
	  function isRootNode(node) {
	    return node.tagName === '_SHADOW_ROOT_';
	  }
	
	  var pseudoArrayToArray = function pseudoArrayToArray(pseudoArray) {
	    return Array.prototype.slice.call(pseudoArray);
	  };
	
	  var version = '0.0.1';
	
	  /**
	   * @license
	   * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
	   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	   * Code distributed by Google as part of the polymer project is also
	   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	   */
	
	  if (typeof WeakMap === 'undefined') {
	    (function () {
	      var defineProperty = Object.defineProperty;
	      var counter = Date.now() % 1e9;
	
	      var WeakMap = function WeakMap() {
	        this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
	      };
	
	      WeakMap.prototype = {
	        set: function set(key, value) {
	          var entry = key[this.name];
	          if (entry && entry[0] === key) entry[1] = value;else defineProperty(key, this.name, { value: [key, value], writable: true });
	          return this;
	        },
	        get: function get(key) {
	          var entry;
	          return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
	        },
	        delete: function _delete(key) {
	          var entry = key[this.name];
	          if (!entry || entry[0] !== key) return false;
	          entry[0] = entry[1] = undefined;
	          return true;
	        },
	        has: function has(key) {
	          var entry = key[this.name];
	          if (!entry) return false;
	          return entry[0] === key;
	        }
	      };
	
	      window.WeakMap = WeakMap;
	    })();
	  }
	
	  var arrProto = Array.prototype;
	  var forEach = arrProto.forEach;
	
	  // We use a real DOM node for a shadow root. This is because the host node
	  // basically becomes a virtual entry point for your element leaving the shadow
	  // root the only thing that can receive instructions on how the host should
	  // render to the browser.
	
	  var defaultShadowRootTagName = '_shadow_root_';
	
	  // * WebKit only *
	  //
	  // These members we need cannot override as we require native access to their
	  // original values at some point.
	  var polyfillAtRuntime = ['childNodes', 'parentNode'];
	
	  // Some properties that should not be overridden in the Text prototype.
	  var doNotOverridePropertiesInTextNodes = ['textContent'];
	
	  // Some new properties that should be defined in the Text prototype.
	  var defineInTextNodes = ['assignedSlot'];
	
	  // Some properties that should not be overridden in the Comment prototype.
	  var doNotOverridePropertiesInCommNodes = ['textContent'];
	
	  // Some new properties that should be defined in the Comment prototype.
	  var defineInCommNodes = [];
	
	  // Nodes that should be slotted
	  var slottedNodeTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE];
	
	  // Private data stores.
	  var assignedToSlotMap = new WeakMap();
	  var hostToModeMap = new WeakMap();
	  var hostToRootMap = new WeakMap();
	  var nodeToChildNodesMap = new WeakMap();
	  var nodeToParentNodeMap = new WeakMap();
	  var nodeToSlotMap = new WeakMap();
	  var rootToHostMap = new WeakMap();
	  var rootToSlotMap = new WeakMap();
	  var slotToRootMap = new WeakMap();
	
	  // Unfortunately manual DOM parsing is because of WebKit.
	  var parser = new DOMParser();
	  function parse(html) {
	    var tree = document.createElement('div');
	
	    // Everything not WebKit can do this easily.
	    if (canPatchNativeAccessors) {
	      tree.__innerHTML = html;
	      return tree;
	    }
	
	    var parsed = parser.parseFromString('<div>' + html + '</div>', 'text/html').body.firstChild;
	
	    while (parsed.hasChildNodes()) {
	      var firstChild = parsed.firstChild;
	      parsed.removeChild(firstChild);
	      tree.appendChild(firstChild);
	    }
	
	    // Need to import the node to initialise the custom elements from the parser.
	    return document.importNode(tree, true);
	  }
	
	  function staticProp(obj, name, value) {
	    Object.defineProperty(obj, name, {
	      configurable: true,
	      get: function get() {
	        return value;
	      }
	    });
	  }
	
	  // Slotting helpers.
	
	  function arrayItem(idx) {
	    return this[idx];
	  }
	
	  function makeLikeNodeList(arr) {
	    arr.item = arrayItem;
	    return arr;
	  }
	
	  function isHostNode(node) {
	    return !!hostToRootMap.get(node);
	  }
	
	  function getNodeType(node) {
	    if (isHostNode(node)) {
	      return 'host';
	    }
	
	    if (isSlotNode(node)) {
	      return 'slot';
	    }
	
	    if (isRootNode(node)) {
	      return 'root';
	    }
	
	    return 'node';
	  }
	
	  function findClosest(node, func) {
	    while (node) {
	      if (node === document) {
	        break;
	      }
	      if (func(node)) {
	        return node;
	      }
	      node = node.parentNode;
	    }
	  }
	
	  function getSlotNameFromSlot(node) {
	    return node.getAttribute && node.getAttribute('name') || 'default';
	  }
	
	  function getSlotNameFromNode(node) {
	    return node.getAttribute && node.getAttribute('slot') || 'default';
	  }
	
	  function slotNodeIntoSlot(slot, node, insertBefore) {
	    // Don't slot nodes that have content but are only whitespace. This is an
	    // anomaly that I don't think the spec deals with.
	    //
	    // The problem is:
	    //
	    // - If you insert HTML with indentation into the page, there will be
	    //   whitespace and if that's inserted it messes with fallback content
	    //   calculation where there is formatting, but no meaningful content, so in
	    //   theory it should fallback. Since you can attach a shadow root after we
	    //   mean to insert an empty text node and have it "count", we can't really
	    //   discard nodes that are considered formatting at the time of attachment.
	    // - You can insert a text node and modify its text content later.
	    //   Incremental DOM seems to do this. Every way I look at it, it seems
	    //   problematic that we should have to screen for content, but I don't seems
	    //   much of a way around it at the moment.
	    if (node.nodeType === 3 && node.textContent && node.textContent.trim().length === 0) {
	      return;
	    }
	
	    // only Text and Element nodes should be slotted
	    if (slottedNodeTypes.indexOf(node.nodeType) === -1) {
	      return;
	    }
	
	    var assignedNodes = slot.assignedNodes();
	    var shouldGoIntoContentMode = assignedNodes.length === 0;
	    var slotInsertBeforeIndex = assignedNodes.indexOf(insertBefore);
	
	    // Assign the slot to the node internally.
	    nodeToSlotMap.set(node, slot);
	
	    // Remove the fallback content and state if we're going into content mode.
	    if (shouldGoIntoContentMode) {
	      forEach.call(slot.childNodes, function (child) {
	        return slot.__removeChild(child);
	      });
	    }
	
	    if (slotInsertBeforeIndex > -1) {
	      slot.__insertBefore(node, insertBefore !== undefined ? insertBefore : null);
	      assignedNodes.splice(slotInsertBeforeIndex, 0, node);
	    } else {
	      slot.__appendChild(node);
	      assignedNodes.push(node);
	    }
	
	    slot.____triggerSlotChangeEvent();
	  }
	
	  function slotNodeFromSlot(node) {
	    var slot = node.assignedSlot;
	
	    if (slot) {
	      var assignedNodes = slot.assignedNodes();
	      var index = assignedNodes.indexOf(node);
	
	      if (index > -1) {
	        var shouldGoIntoDefaultMode = assignedNodes.length === 1;
	
	        assignedNodes.splice(index, 1);
	        nodeToSlotMap.set(node, null);
	
	        // Actually remove the child.
	        slot.__removeChild(node);
	
	        // If this was the last slotted node, then insert fallback content.
	        if (shouldGoIntoDefaultMode) {
	          forEach.call(slot.childNodes, function (child) {
	            return slot.__appendChild(child);
	          });
	        }
	
	        slot.____triggerSlotChangeEvent();
	      }
	    }
	  }
	
	  // Returns the index of the node in the host's childNodes.
	  function indexOfNode(host, node) {
	    var chs = host.childNodes;
	    var chsLen = chs.length;
	    for (var a = 0; a < chsLen; a++) {
	      if (chs[a] === node) {
	        return a;
	      }
	    }
	    return -1;
	  }
	
	  // Adds the node to the list of childNodes on the host and fakes any necessary
	  // information such as parentNode.
	  function registerNode(host, node, insertBefore, func) {
	    var index = indexOfNode(host, insertBefore);
	    eachNodeOrFragmentNodes(node, function (eachNode, eachIndex) {
	      func(eachNode, eachIndex);
	
	      if (canPatchNativeAccessors) {
	        nodeToParentNodeMap.set(eachNode, host);
	      } else {
	        staticProp(eachNode, 'parentNode', host);
	      }
	
	      if (index > -1) {
	        arrProto.splice.call(host.childNodes, index + eachIndex, 0, eachNode);
	      } else {
	        arrProto.push.call(host.childNodes, eachNode);
	      }
	    });
	  }
	
	  // Cleans up registerNode().
	  function unregisterNode(host, node, func) {
	    var index = indexOfNode(host, node);
	
	    if (index > -1) {
	      func(node, 0);
	
	      if (canPatchNativeAccessors) {
	        nodeToParentNodeMap.set(node, null);
	      } else {
	        staticProp(node, 'parentNode', null);
	      }
	
	      arrProto.splice.call(host.childNodes, index, 1);
	    }
	  }
	
	  function addNodeToNode(host, node, insertBefore) {
	    registerNode(host, node, insertBefore, function (eachNode) {
	      host.__insertBefore(eachNode, insertBefore !== undefined ? insertBefore : null);
	    });
	  }
	
	  function addNodeToHost(host, node, insertBefore) {
	    registerNode(host, node, insertBefore, function (eachNode) {
	      var rootNode = hostToRootMap.get(host);
	      var slotNodes = rootToSlotMap.get(rootNode);
	      var slotNode = slotNodes[getSlotNameFromNode(eachNode)];
	      if (slotNode) {
	        slotNodeIntoSlot(slotNode, eachNode, insertBefore);
	      }
	    });
	  }
	
	  function addSlotToRoot(root, slot) {
	    var slotName = getSlotNameFromSlot(slot);
	
	    // Ensure a slot node's childNodes are overridden at the earliest point
	    // possible for WebKit.
	    if (!canPatchNativeAccessors && !Array.isArray(slot.childNodes)) {
	      staticProp(slot, 'childNodes', pseudoArrayToArray(slot.childNodes));
	    }
	
	    rootToSlotMap.get(root)[slotName] = slot;
	
	    if (!slotToRootMap.has(slot)) {
	      slotToRootMap.set(slot, root);
	    }
	
	    eachChildNode(rootToHostMap.get(root), function (eachNode) {
	      if (!eachNode.assignedSlot && slotName === getSlotNameFromNode(eachNode)) {
	        slotNodeIntoSlot(slot, eachNode);
	      }
	    });
	  }
	
	  function addNodeToRoot(root, node, insertBefore) {
	    eachNodeOrFragmentNodes(node, function (child) {
	      if (isSlotNode(child)) {
	        addSlotToRoot(root, child);
	      } else {
	        var slotNodes = findSlots(child);
	        if (slotNodes) {
	          var slotNodesLen = slotNodes.length;
	          for (var a = 0; a < slotNodesLen; a++) {
	            addSlotToRoot(root, slotNodes[a]);
	          }
	        }
	      }
	    });
	    addNodeToNode(root, node, insertBefore);
	  }
	
	  // Adds a node to a slot. In other words, adds default content to a slot. It
	  // ensures that if the slot doesn't have any assigned nodes yet, that the node
	  // is actually displayed, otherwise it's just registered as child content.
	  function addNodeToSlot(slot, node, insertBefore) {
	    var isInDefaultMode = slot.assignedNodes().length === 0;
	    registerNode(slot, node, insertBefore, function (eachNode) {
	      if (isInDefaultMode) {
	        slot.__insertBefore(eachNode, insertBefore !== undefined ? insertBefore : null);
	      }
	    });
	  }
	
	  // Removes a node from a slot (default content). It ensures that if the slot
	  // doesn't have any assigned nodes yet, that the node is actually removed,
	  // otherwise it's just unregistered.
	  function removeNodeFromSlot(slot, node) {
	    var isInDefaultMode = slot.assignedNodes().length === 0;
	    unregisterNode(slot, node, function () {
	      if (isInDefaultMode) {
	        slot.__removeChild(node);
	      }
	    });
	  }
	
	  function removeNodeFromNode(host, node) {
	    unregisterNode(host, node, function () {
	      host.__removeChild(node);
	    });
	  }
	
	  function removeNodeFromHost(host, node) {
	    unregisterNode(host, node, function () {
	      slotNodeFromSlot(node);
	    });
	  }
	
	  function removeSlotFromRoot(root, node) {
	    node.assignedNodes().forEach(slotNodeFromSlot);
	    delete rootToSlotMap.get(root)[getSlotNameFromSlot(node)];
	    slotToRootMap.delete(node);
	  }
	
	  function removeNodeFromRoot(root, node) {
	    unregisterNode(root, node, function () {
	      if (isSlotNode(node)) {
	        removeSlotFromRoot(root, node);
	      } else {
	        var nodes = findSlots(node);
	        if (nodes) {
	          for (var a = 0; a < nodes.length; a++) {
	            removeSlotFromRoot(root, nodes[a]);
	          }
	        }
	      }
	      root.__removeChild(node);
	    });
	  }
	
	  // TODO terribly inefficient
	  function getRootNode(host) {
	    if (isRootNode(host)) {
	      return host;
	    }
	
	    if (!host.parentNode) {
	      return;
	    }
	
	    return getRootNode(host.parentNode);
	  }
	
	  function appendChildOrInsertBefore(host, newNode, refNode) {
	    var nodeType = getNodeType(host);
	    var parentNode = newNode.parentNode;
	    var rootNode = getRootNode(host);
	
	    // Ensure childNodes is patched so we can manually update it for WebKit.
	    if (!canPatchNativeAccessors && !Array.isArray(host.childNodes)) {
	      staticProp(host, 'childNodes', pseudoArrayToArray(host.childNodes));
	    }
	
	    if (rootNode && getNodeType(newNode) === 'slot') {
	      addSlotToRoot(rootNode, newNode);
	    }
	
	    // If we append a child to a host, the host tells the shadow root to distribute
	    // it. If the root decides it doesn't need to be distributed, it is never
	    // removed from the old parent because in polyfill land we store a reference
	    // to the node but we don't move it. Due to that, we must explicitly remove the
	    // node from its old parent.
	    if (parentNode && getNodeType(parentNode) === 'host') {
	      if (canPatchNativeAccessors) {
	        nodeToParentNodeMap.set(newNode, null);
	      } else {
	        staticProp(newNode, 'parentNode', null);
	      }
	    }
	
	    if (nodeType === 'node') {
	      if (canPatchNativeAccessors) {
	        nodeToParentNodeMap.set(newNode, host);
	        return host.__insertBefore(newNode, refNode !== undefined ? refNode : null);
	      }
	
	      return addNodeToNode(host, newNode, refNode);
	    }
	
	    if (nodeType === 'slot') {
	      return addNodeToSlot(host, newNode, refNode);
	    }
	
	    if (nodeType === 'host') {
	      return addNodeToHost(host, newNode, refNode);
	    }
	
	    if (nodeType === 'root') {
	      return addNodeToRoot(host, newNode, refNode);
	    }
	  }
	
	  function syncSlotChildNodes(node) {
	    if (canPatchNativeAccessors && getNodeType(node) === 'slot' && node.__childNodes.length !== node.childNodes.length) {
	      while (node.hasChildNodes()) {
	        node.removeChild(node.firstChild);
	      }
	
	      forEach.call(node.__childNodes, function (child) {
	        return node.appendChild(child);
	      });
	    }
	  }
	
	  var members = {
	    // For testing purposes.
	    ____assignedNodes: {
	      get: function get() {
	        return this.______assignedNodes || (this.______assignedNodes = []);
	      }
	    },
	
	    // For testing purposes.
	    ____isInFallbackMode: {
	      get: function get() {
	        return this.assignedNodes().length === 0;
	      }
	    },
	
	    ____slotChangeListeners: {
	      get: function get() {
	        if (typeof this.______slotChangeListeners === 'undefined') {
	          this.______slotChangeListeners = 0;
	        }
	        return this.______slotChangeListeners;
	      },
	      set: function set(value) {
	        this.______slotChangeListeners = value;
	      }
	    },
	    ____triggerSlotChangeEvent: {
	      value: debounce(function callback() {
	        if (this.____slotChangeListeners) {
	          this.dispatchEvent(new CustomEvent('slotchange', {
	            bubbles: false,
	            cancelable: false
	          }));
	        }
	      })
	    },
	    addEventListener: {
	      value: function value(name, func, opts) {
	        if (name === 'slotchange' && isSlotNode(this)) {
	          this.____slotChangeListeners++;
	        }
	        return this.__addEventListener(name, func, opts);
	      }
	    },
	    appendChild: {
	      value: function value(newNode) {
	        appendChildOrInsertBefore(this, newNode);
	        return newNode;
	      }
	    },
	    assignedSlot: {
	      get: function get() {
	        var slot = nodeToSlotMap.get(this);
	
	        if (!slot) {
	          return null;
	        }
	
	        var root = slotToRootMap.get(slot);
	        var host = rootToHostMap.get(root);
	        var mode = hostToModeMap.get(host);
	
	        return mode === 'open' ? slot : null;
	      }
	    },
	    attachShadow: {
	      value: function value(opts) {
	        var _this = this;
	
	        var mode = opts && opts.mode;
	        if (mode !== 'closed' && mode !== 'open') {
	          throw new Error('You must specify { mode } as "open" or "closed" to attachShadow().');
	        }
	
	        // Return the existing shadow root if it exists.
	        var existingShadowRoot = hostToRootMap.get(this);
	        if (existingShadowRoot) {
	          return existingShadowRoot;
	        }
	
	        var lightNodes = makeLikeNodeList([].slice.call(this.childNodes));
	        var shadowRoot = document.createElement(opts.polyfillShadowRootTagName || defaultShadowRootTagName);
	
	        // Host and shadow root data.
	        hostToModeMap.set(this, mode);
	        hostToRootMap.set(this, shadowRoot);
	        rootToHostMap.set(shadowRoot, this);
	        rootToSlotMap.set(shadowRoot, {});
	
	        if (canPatchNativeAccessors) {
	          nodeToChildNodesMap.set(this, lightNodes);
	        } else {
	          staticProp(this, 'childNodes', lightNodes);
	        }
	
	        // Process light DOM.
	        lightNodes.forEach(function (node) {
	          // Existing children should be removed from being displayed, but still
	          // appear to be child nodes. This is how light DOM works; they're still
	          // child nodes but not in the composed DOM yet as there won't be any
	          // slots for them to go into.
	          _this.__removeChild(node);
	
	          // We must register the parentNode here as this has the potential to
	          // become out of sync if the node is moved before being slotted.
	          if (canPatchNativeAccessors) {
	            nodeToParentNodeMap.set(node, _this);
	          } else {
	            staticProp(node, 'parentNode', _this);
	          }
	        });
	
	        // The shadow root is actually the only child of the host.
	        return this.__appendChild(shadowRoot);
	      }
	    },
	    childElementCount: {
	      get: function get() {
	        return this.children.length;
	      }
	    },
	    childNodes: {
	      get: function get() {
	        if (canPatchNativeAccessors && getNodeType(this) === 'node') {
	          return this.__childNodes;
	        }
	        var childNodes = nodeToChildNodesMap.get(this);
	
	        if (!childNodes) {
	          nodeToChildNodesMap.set(this, childNodes = makeLikeNodeList([]));
	        }
	
	        return childNodes;
	      }
	    },
	    children: {
	      get: function get() {
	        var chs = [];
	        eachChildNode(this, function (node) {
	          if (node.nodeType === 1) {
	            chs.push(node);
	          }
	        });
	        return makeLikeNodeList(chs);
	      }
	    },
	    firstChild: {
	      get: function get() {
	        return this.childNodes[0] || null;
	      }
	    },
	    firstElementChild: {
	      get: function get() {
	        return this.children[0] || null;
	      }
	    },
	    assignedNodes: {
	      value: function value() {
	        if (isSlotNode(this)) {
	          var assigned = assignedToSlotMap.get(this);
	
	          if (!assigned) {
	            assignedToSlotMap.set(this, assigned = []);
	          }
	
	          return assigned;
	        }
	      }
	    },
	    hasChildNodes: {
	      value: function value() {
	        return this.childNodes.length > 0;
	      }
	    },
	    innerHTML: {
	      get: function get() {
	        var innerHTML = '';
	
	        var getHtmlNodeOuterHtml = function getHtmlNodeOuterHtml(node) {
	          return node.outerHTML;
	        };
	        var getOuterHtmlByNodeType = {
	          1: getHtmlNodeOuterHtml,
	          3: getEscapedTextContent,
	          8: getCommentNodeOuterHtml
	        };
	
	        eachChildNode(this, function (node) {
	          var getOuterHtml = getOuterHtmlByNodeType[node.nodeType] || getHtmlNodeOuterHtml;
	          innerHTML += getOuterHtml(node);
	        });
	        return innerHTML;
	      },
	      set: function set(innerHTML) {
	        var parsed = parse(innerHTML);
	
	        while (this.hasChildNodes()) {
	          this.removeChild(this.firstChild);
	        }
	
	        // when we are doing this: root.innerHTML = "<slot><div></div></slot>";
	        // slot.__childNodes is out of sync with slot.childNodes.
	        // to fix it we have to manually remove and insert them
	        var slots = findSlots(parsed);
	        forEach.call(slots, function (slot) {
	          return syncSlotChildNodes(slot);
	        });
	
	        while (parsed.hasChildNodes()) {
	          var firstChild = parsed.firstChild;
	
	          // When we polyfill everything on HTMLElement.prototype, we overwrite
	          // properties. This makes it so that parentNode reports null even though
	          // it's actually a parent of the HTML parser. For this reason,
	          // cleanNode() won't work and we must manually remove it from the
	          // parser before it is moved to the host just in case it's added as a
	          // light node but not assigned to a slot.
	          parsed.removeChild(firstChild);
	
	          this.appendChild(firstChild);
	        }
	      }
	    },
	    insertBefore: {
	      value: function value(newNode, refNode) {
	        appendChildOrInsertBefore(this, newNode, refNode);
	
	        return newNode;
	      }
	    },
	    lastChild: {
	      get: function get() {
	        var ch = this.childNodes;
	        return ch[ch.length - 1] || null;
	      }
	    },
	    lastElementChild: {
	      get: function get() {
	        var ch = this.children;
	        return ch[ch.length - 1] || null;
	      }
	    },
	    name: {
	      get: function get() {
	        return this.getAttribute('name');
	      },
	      set: function set(name) {
	        return this.setAttribute('name', name);
	      }
	    },
	    nextSibling: {
	      get: function get() {
	        var host = this;
	        return eachChildNode(this.parentNode, function (child, index, nodes) {
	          if (host === child) {
	            return nodes[index + 1] || null;
	          }
	        });
	      }
	    },
	    nextElementSibling: {
	      get: function get() {
	        var host = this;
	        var found = void 0;
	        return eachChildNode(this.parentNode, function (child) {
	          if (found && child.nodeType === 1) {
	            return child;
	          }
	          if (host === child) {
	            found = true;
	          }
	        });
	      }
	    },
	    outerHTML: {
	      get: function get() {
	        var name = this.tagName.toLowerCase();
	        var attributes = Array.prototype.slice.call(this.attributes).map(function (attr) {
	          return ' ' + attr.name + (attr.value ? '="' + attr.value + '"' : '');
	        }).join('');
	        return '<' + name + attributes + '>' + this.innerHTML + '</' + name + '>';
	      },
	      set: function set(outerHTML) {
	        if (this.parentNode) {
	          var parsed = parse(outerHTML);
	          this.parentNode.replaceChild(parsed.firstChild, this);
	        } else {
	          if (canPatchNativeAccessors) {
	            this.__outerHTML = outerHTML; // this will throw a native error;
	          } else {
	            throw new Error('Failed to set the \'outerHTML\' property on \'Element\': This element has no parent node.');
	          }
	        }
	      }
	    },
	    parentElement: {
	      get: function get() {
	        return findClosest(this.parentNode, function (node) {
	          return node.nodeType === 1;
	        });
	      }
	    },
	    parentNode: {
	      get: function get() {
	        return nodeToParentNodeMap.get(this) || this.__parentNode || null;
	      }
	    },
	    previousSibling: {
	      get: function get() {
	        var host = this;
	        return eachChildNode(this.parentNode, function (child, index, nodes) {
	          if (host === child) {
	            return nodes[index - 1] || null;
	          }
	        });
	      }
	    },
	    previousElementSibling: {
	      get: function get() {
	        var host = this;
	        var found = void 0;
	        return eachChildNode(this.parentNode, function (child) {
	          if (found && host === child) {
	            return found;
	          }
	          if (child.nodeType === 1) {
	            found = child;
	          }
	        });
	      }
	    },
	    removeChild: {
	      value: function value(refNode) {
	        var nodeType = getNodeType(this);
	
	        switch (nodeType) {
	          case 'node':
	            if (canPatchNativeAccessors) {
	              nodeToParentNodeMap.set(refNode, null);
	              return this.__removeChild(refNode);
	            }
	            removeNodeFromNode(this, refNode);
	            break;
	          case 'slot':
	            removeNodeFromSlot(this, refNode);
	            break;
	          case 'host':
	            removeNodeFromHost(this, refNode);
	            break;
	          case 'root':
	            removeNodeFromRoot(this, refNode);
	            break;
	          default:
	            break;
	        }
	        return refNode;
	      }
	    },
	    removeEventListener: {
	      value: function value(name, func, opts) {
	        if (name === 'slotchange' && this.____slotChangeListeners && isSlotNode(this)) {
	          this.____slotChangeListeners--;
	        }
	        return this.__removeEventListener(name, func, opts);
	      }
	    },
	    replaceChild: {
	      value: function value(newNode, refNode) {
	        this.insertBefore(newNode, refNode);
	        return this.removeChild(refNode);
	      }
	    },
	    shadowRoot: {
	      get: function get() {
	        return hostToModeMap.get(this) === 'open' ? hostToRootMap.get(this) : null;
	      }
	    },
	    textContent: {
	      get: function get() {
	        var textContent = '';
	        eachChildNode(this, function (node) {
	          if (node.nodeType !== Node.COMMENT_NODE) {
	            textContent += node.textContent;
	          }
	        });
	        return textContent;
	      },
	      set: function set(textContent) {
	        while (this.hasChildNodes()) {
	          this.removeChild(this.firstChild);
	        }
	        if (!textContent) {
	          return;
	        }
	        this.appendChild(document.createTextNode(textContent));
	      }
	    }
	  };
	
	  if (!('attachShadow' in document.createElement('div'))) {
	    (function () {
	      var commProto = Comment.prototype;
	      var elementProto = HTMLElement.prototype;
	      var svgProto = SVGElement.prototype;
	      var textProto = Text.prototype;
	      var textNode = document.createTextNode('');
	      var commNode = document.createComment('');
	
	      Object.keys(members).forEach(function (memberName) {
	        var memberProperty = members[memberName];
	
	        // All properties should be configurable.
	        memberProperty.configurable = true;
	
	        // Applying to the data properties only since we can't have writable accessor properties.
	        if (memberProperty.hasOwnProperty('value')) {
	          memberProperty.writable = true;
	        }
	
	        // Polyfill as much as we can and work around WebKit in other areas.
	        if (canPatchNativeAccessors || polyfillAtRuntime.indexOf(memberName) === -1) {
	          var nativeDescriptor = getPropertyDescriptor(elementProto, memberName);
	          var nativeTextDescriptor = getPropertyDescriptor(textProto, memberName);
	          var nativeCommDescriptor = getPropertyDescriptor(commProto, memberName);
	          var shouldOverrideInTextNode = memberName in textNode && doNotOverridePropertiesInTextNodes.indexOf(memberName) === -1 || ~defineInTextNodes.indexOf(memberName);
	          var shouldOverrideInCommentNode = memberName in commNode && doNotOverridePropertiesInCommNodes.indexOf(memberName) === -1 || ~defineInCommNodes.indexOf(memberName);
	          var nativeMemberName = '__' + memberName;
	
	          Object.defineProperty(elementProto, memberName, memberProperty);
	          Object.defineProperty(svgProto, memberName, memberProperty);
	
	          if (nativeDescriptor) {
	            Object.defineProperty(elementProto, nativeMemberName, nativeDescriptor);
	            Object.defineProperty(svgProto, nativeMemberName, nativeDescriptor);
	          }
	
	          if (shouldOverrideInTextNode) {
	            Object.defineProperty(textProto, memberName, memberProperty);
	          }
	
	          if (shouldOverrideInTextNode && nativeTextDescriptor) {
	            Object.defineProperty(textProto, nativeMemberName, nativeTextDescriptor);
	          }
	
	          if (shouldOverrideInCommentNode) {
	            Object.defineProperty(commProto, memberName, memberProperty);
	          }
	
	          if (shouldOverrideInCommentNode && nativeCommDescriptor) {
	            Object.defineProperty(commProto, nativeMemberName, nativeCommDescriptor);
	          }
	        }
	      });
	    })();
	  }
	
	  exports['default'] = version;
	
	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	//# sourceMappingURL=index.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var now = __webpack_require__(4);
	
	/**
	 * Returns a function, that, as long as it continues to be invoked, will not
	 * be triggered. The function will be called after it stops being called for
	 * N milliseconds. If `immediate` is passed, trigger the function on the
	 * leading edge, instead of the trailing.
	 *
	 * @source underscore.js
	 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
	 * @param {Function} function to wrap
	 * @param {Number} timeout in ms (`100`)
	 * @param {Boolean} whether to execute at the beginning (`false`)
	 * @api public
	 */
	
	module.exports = function debounce(func, wait, immediate) {
	  var timeout, args, context, timestamp, result;
	  if (null == wait) wait = 100;
	
	  function later() {
	    var last = now() - timestamp;
	
	    if (last < wait && last > 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      if (!immediate) {
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      }
	    }
	  };
	
	  return function debounced() {
	    context = this;
	    args = arguments;
	    timestamp = now();
	    var callNow = immediate && !timeout;
	    if (!timeout) timeout = setTimeout(later, wait);
	    if (callNow) {
	      result = func.apply(context, args);
	      context = args = null;
	    }
	
	    return result;
	  };
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = Date.now || now;
	
	function now() {
	    return new Date().getTime();
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	// Polyfill for creating CustomEvents on IE9/10/11
	
	// code pulled from:
	// https://github.com/d4tocchini/customevent-polyfill
	// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
	
	try {
	    var ce = new window.CustomEvent('test', {
	        bubbles: false,
	        cancelable: true,
	        detail: {
	            x: 'y'
	        }
	    });
	    ce.preventDefault();
	    if (ce.defaultPrevented !== true) {
	        // IE has problems with .preventDefault() on custom events
	        // http://stackoverflow.com/questions/23349191
	        throw new Error('Could not prevent default');
	    }
	} catch (e) {
	    var CustomEvent = function CustomEvent(event, params) {
	        var evt;
	        params = params || {
	            bubbles: false,
	            cancelable: false,
	            detail: undefined
	        };
	
	        evt = document.createEvent("CustomEvent");
	        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	        var origPrevent = evt.preventDefault;
	        evt.preventDefault = function () {
	            origPrevent.call(this);
	            try {
	                Object.defineProperty(this, 'defaultPrevented', {
	                    get: function get() {
	                        return true;
	                    }
	                });
	            } catch (e) {
	                this.defaultPrevented = true;
	            }
	        };
	        return evt;
	    };
	
	    CustomEvent.prototype = window.Event.prototype;
	    window.CustomEvent = CustomEvent; // expose definition to window
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _pages = __webpack_require__(10);
	
	var _body = __webpack_require__(26);
	
	var _body2 = _interopRequireDefault(_body);
	
	var _header = __webpack_require__(28);
	
	var _header2 = _interopRequireDefault(_header);
	
	var _router = __webpack_require__(31);
	
	var _router2 = _interopRequireDefault(_router);
	
	var _title = __webpack_require__(32);
	
	var _title2 = _interopRequireDefault(_title);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _skatejs.define)('sk-app', {
	  props: {
	    page: {},
	    scrolled: _skatejs.prop.boolean()
	  },
	  attached: function attached(elem) {
	    window.addEventListener('scroll', elem._scrollHandler = function () {
	      return elem.scrolled = !!window.scrollY;
	    });
	  },
	  detached: function detached(elem) {
	    window.removeEventListener('scroll', elem._scrollHandler);
	  },
	  render: function render(elem) {
	    var Page = elem.page;
	    (0, _title2.default)('SkateJS - functional web components');
	
	    _skatejs.vdom.elementOpen('div');
	
	    _skatejs.vdom.elementOpen(_router2.default, null, null, 'onRouteChange', function (e) {
	      return elem.page = e.detail;
	    });
	
	    _skatejs.vdom.elementVoid(_router.Route, null, null, 'component', _pages.Index, 'path', '/');
	
	    _skatejs.vdom.elementVoid(_router.Route, null, null, 'component', _pages.Docs, 'path', '/docs');
	
	    _skatejs.vdom.elementClose(_router2.default);
	
	    _skatejs.vdom.elementVoid(_header2.default, null, null, 'scrolled', elem.scrolled, 'title', 'SkateJS');
	
	    _skatejs.vdom.elementOpen(_body2.default);
	
	    _renderArbitrary(Page ? _skatejs.vdom.elementVoid(Page) : '');
	
	    _skatejs.vdom.elementClose(_body2.default);
	
	    return _skatejs.vdom.elementClose('div');
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	(function (global, factory) {
	  ( false ? 'undefined' : _typeof2(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, __webpack_require__(8), __webpack_require__(9)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.skate = global.skate || {}, global.IncrementalDOM, global.isNativeRegex);
	})(undefined, function (exports, incrementalDom, isNativeRegex) {
	
	  isNativeRegex = 'default' in isNativeRegex ? isNativeRegex['default'] : isNativeRegex;
	
	  var assign = Object.assign;
	  var assign$1 = assign ? assign.bind(Object) : function (obj) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }
	
	    args.forEach(function (arg) {
	      return Object.keys(arg).forEach(function (name) {
	        return obj[name] = arg[name];
	      });
	    });
	    return obj;
	  };
	
	  function empty(val) {
	    return typeof val === 'undefined' || val === null;
	  }
	
	  var alwaysUndefinedIfNotANumberOrNumber = function alwaysUndefinedIfNotANumberOrNumber(val) {
	    return isNaN(val) ? undefined : Number(val);
	  };
	  var alwaysUndefinedIfEmptyOrString = function alwaysUndefinedIfEmptyOrString(val) {
	    return empty(val) ? undefined : String(val);
	  };
	
	  function create(def) {
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      args.unshift({}, def);
	      return assign$1.apply(null, args);
	    };
	  }
	
	  var array = create({
	    coerce: function coerce(val) {
	      return Array.isArray(val) ? val : [val];
	    },
	    default: function _default() {
	      return [];
	    },
	    deserialize: JSON.parse,
	    serialize: JSON.stringify
	  });
	
	  var boolean = create({
	    coerce: function coerce(value) {
	      return !!value;
	    },
	    default: false,
	    deserialize: function deserialize(value) {
	      return !(value === null);
	    },
	    serialize: function serialize(value) {
	      return value ? '' : undefined;
	    }
	  });
	
	  var number = create({
	    default: 0,
	    coerce: alwaysUndefinedIfNotANumberOrNumber,
	    deserialize: alwaysUndefinedIfNotANumberOrNumber,
	    serialize: alwaysUndefinedIfNotANumberOrNumber
	  });
	
	  var string = create({
	    coerce: alwaysUndefinedIfEmptyOrString,
	    deserialize: alwaysUndefinedIfEmptyOrString,
	    serialize: alwaysUndefinedIfEmptyOrString
	  });
	
	  var prop = Object.freeze({
	    create: create,
	    array: array,
	    boolean: boolean,
	    number: number,
	    string: string
	  });
	
	  var $connected = '____skate_connected';
	  var $created = '____skate_created';
	  var $ctor = '____skate_constructor';
	  var $name = '____skate_name';
	  var $props = '____skate_props';
	  var $ref = '____skate_ref';
	  var $renderer = '____skate_renderer';
	  var $rendering = '____skate_rendering';
	  var $rendererDebounced = '____skate_rendererDebounced';
	  var $shadowRoot = '____skate_shadowRoot';
	
	  var symbols$1 = Object.freeze({
	    name: $name,
	    shadowRoot: $shadowRoot
	  });
	
	  var div = document.createElement('div');
	  var isNative = function isNative(elem, prop) {
	    return isNativeRegex.test(elem[prop]);
	  };
	  var isPolyfill = function isPolyfill(elem, prop) {
	    return !!elem[prop] && !isNative(elem, prop);
	  };
	
	  // property used to check for shadowDOMv0 support
	  var v0ShadowDOMProperty = 'createShadowRoot';
	
	  // property used to check for shadowDOMv1 support
	  var v1ShadowDOMProperty = 'attachShadow';
	
	  function shouldUseShadowDomV0(elem) {
	    if (isNative(elem, v1ShadowDOMProperty)) {
	      return false;
	    } else if (isNative(elem, v0ShadowDOMProperty)) {
	      return true;
	    } else if (isPolyfill(elem, v1ShadowDOMProperty)) {
	      return false;
	    } else {
	      return isPolyfill(elem, v0ShadowDOMProperty);
	    }
	  }
	
	  function shouldUseShadowDomV1(elem) {
	    if (isNative(elem, v1ShadowDOMProperty)) {
	      return true;
	    } else if (isNative(elem, v0ShadowDOMProperty)) {
	      return false;
	    } else {
	      return isPolyfill(elem, v1ShadowDOMProperty);
	    }
	  }
	
	  var customElementsV0 = !!document.registerElement;
	  var customElementsV0Polyfill = customElementsV0 && !Document.prototype.registerElement;
	  var customElementsV1 = !!window.customElements;
	
	  var shadowDomV0 = shouldUseShadowDomV0(div);
	  var shadowDomV1 = shouldUseShadowDomV1(div);
	
	  var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	    return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
	  };
	
	  var classCallCheck = function classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	
	  var createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	
	  var defineProperty = function defineProperty(obj, key, value) {
	    if (key in obj) {
	      Object.defineProperty(obj, key, {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    } else {
	      obj[key] = value;
	    }
	
	    return obj;
	  };
	
	  var inherits = function inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof2(superClass)));
	    }
	
	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	  };
	
	  var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }
	
	    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
	  };
	
	  var toConsumableArray = function toConsumableArray(arr) {
	    if (Array.isArray(arr)) {
	      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	        arr2[i] = arr[i];
	      }return arr2;
	    } else {
	      return Array.from(arr);
	    }
	  };
	
	  var applyDefault = incrementalDom.attributes[incrementalDom.symbols.default];
	  var fallbackToV0 = !shadowDomV1 && shadowDomV0;
	  var stackChren = [];
	  var stackProps = [];
	
	  // Attributes that are not handled by Incremental DOM.
	  incrementalDom.attributes.key = incrementalDom.attributes.skip = incrementalDom.attributes.statics = function () {};
	
	  // Attributes that *must* be set via a property on all elements.
	  incrementalDom.attributes.checked = incrementalDom.attributes.className = incrementalDom.attributes.disabled = incrementalDom.attributes.value = incrementalDom.applyProp;
	
	  // Default attribute applicator.
	  incrementalDom.attributes[incrementalDom.symbols.default] = function (elem, name, value) {
	    // If the skip attribute was specified, skip
	    if (name === 'skip' && value) {
	      return incrementalDom.skip();
	    }
	
	    // Add the ref to the element so it can be called when it's closed.
	    if (name === 'ref') {
	      elem[$ref] = value;
	      return;
	    }
	
	    // Custom element properties should be set as properties.
	    var props = elem.constructor.props;
	    if (props && name in props) {
	      return incrementalDom.applyProp(elem, name, value);
	    }
	
	    // Boolean false values should not set attributes at all.
	    if (value === false) {
	      return;
	    }
	
	    // Handle built-in and custom events.
	    if (name.indexOf('on') === 0) {
	      var firstChar = name[2];
	      var eventName = void 0;
	
	      if (firstChar === '-') {
	        eventName = name.substring(3);
	      } else if (firstChar === firstChar.toUpperCase()) {
	        eventName = name.substring(2);
	      }
	
	      if (eventName) {
	        applyEvent(elem, eventName, value);
	        return;
	      }
	    }
	
	    // Set the select attribute instead of name if it was a <slot> translated to
	    // a <content> for v0.
	    if (name === 'name' && elem.tagName === 'CONTENT') {
	      name = 'select';
	      value = '[slot="' + value + '"]';
	    }
	
	    // Set defined props on the element directly.
	    if (name in elem) {
	      incrementalDom.applyProp(elem, name, value);
	      return;
	    }
	
	    // Fallback to default IncrementalDOM behaviour.
	    applyDefault(elem, name, value);
	  };
	
	  // Adds or removes an event listener for an element.
	  function applyEvent(elem, ename, newFunc) {
	    var events = elem.__events;
	
	    if (!events) {
	      events = elem.__events = {};
	    }
	
	    var oldFunc = events[ename];
	
	    // Remove old listener so they don't double up.
	    if (oldFunc) {
	      elem.removeEventListener(ename, oldFunc);
	    }
	
	    // Bind new listener.
	    if (newFunc) {
	      elem.addEventListener(ename, events[ename] = newFunc);
	    }
	  }
	
	  function resolveTagName(tname) {
	    // If the tag name is a function, a Skate constructor or a standard function
	    // is supported.
	    //
	    // - If a Skate constructor, the tag name is extracted from that.
	    // - If a standard function, it is used as a helper.
	    if (typeof tname === 'function') {
	      return tname[$name] || tname;
	    }
	
	    // Skate allows the consumer to use <slot /> and it will translate it to
	    // <content /> if Shadow DOM V0 is preferred.
	    if (tname === 'slot' && fallbackToV0) {
	      return 'content';
	    }
	
	    // All other tag names are just passed through.
	    return tname;
	  }
	
	  function wrapIdomFunc(func) {
	    var tnameFuncHandler = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
	
	    return function wrap() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      args[0] = resolveTagName(args[0]);
	      if (typeof args[0] === 'function') {
	        // If we've encountered a function, handle it according to the type of
	        // function that is being wrapped.
	        return tnameFuncHandler.apply(undefined, args);
	      } else if (stackChren.length) {
	        // We pass the wrap() function in here so that when it's called as
	        // children, it will queue up for the next stack, if there is one.
	        stackChren[stackChren.length - 1].push([wrap, args]);
	      } else {
	        // If there is no stack left, we call Incremental DOM directly.
	        var elem = func.apply(undefined, args);
	
	        // If we're in elementClose, try calling the ref.
	        if (func === incrementalDom.elementClose) {
	          var eref = elem[$ref];
	          if (typeof eref === 'function') {
	            eref(elem);
	          }
	        }
	
	        return elem;
	      }
	    };
	  }
	
	  function newAttr(key, val) {
	    if (stackProps.length) {
	      stackProps[stackProps.length - 1][key] = val;
	    } else {
	      return incrementalDom.attr(key, val);
	    }
	  }
	
	  function stackOpen(tname, key, statics) {
	    var props = { key: key, statics: statics };
	
	    for (var _len2 = arguments.length, attrs = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
	      attrs[_key2 - 3] = arguments[_key2];
	    }
	
	    for (var a = 0; a < attrs.length; a += 2) {
	      props[attrs[a]] = attrs[a + 1];
	    }
	    stackChren.push([]);
	    stackProps.push(props);
	  }
	
	  function stackClose(tname) {
	    var chren = stackChren.pop();
	    var props = stackProps.pop();
	    return tname(props, function () {
	      return chren.forEach(function (args) {
	        return args[0].apply(args, toConsumableArray(args[1]));
	      });
	    });
	  }
	
	  function stackVoid() {
	    stackOpen.apply(undefined, arguments);
	    return stackClose(arguments.length <= 0 ? undefined : arguments[0]);
	  }
	
	  // Convenience function for declaring an Incremental DOM element using
	  // hyperscript-style syntax.
	  function element(tname, attrs, chren) {
	    var atype = typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs);
	
	    // If attributes are a function, then they should be treated as children.
	    if (atype === 'function' || atype === 'string') {
	      chren = attrs;
	    }
	
	    // Ensure the attributes are an object.
	    if (atype !== 'object') {
	      attrs = {};
	    }
	
	    // We open the element so we can set attrs after.
	    newElementOpenStart(tname, attrs.key, attrs.statics);
	
	    // Delete so special attrs don't actually get set.
	    delete attrs.key;
	    delete attrs.statics;
	
	    // Set attributes.
	    Object.keys(attrs).forEach(function (name) {
	      return newAttr(name, attrs[name]);
	    });
	
	    // Close before we render the descendant tree.
	    newElementOpenEnd(tname);
	
	    var ctype = typeof chren === 'undefined' ? 'undefined' : _typeof(chren);
	    if (ctype === 'function') {
	      chren();
	    } else if (ctype === 'string' || ctype === 'number') {
	      newText(chren);
	    }
	
	    return newElementClose(tname);
	  }
	
	  // Patch element factories.
	  var newElementClose = wrapIdomFunc(incrementalDom.elementClose, stackClose);
	  var newElementOpen = wrapIdomFunc(incrementalDom.elementOpen, stackOpen);
	  var newElementOpenEnd = wrapIdomFunc(incrementalDom.elementOpenEnd);
	  var newElementOpenStart = wrapIdomFunc(incrementalDom.elementOpenStart, stackOpen);
	  var newElementVoid = wrapIdomFunc(incrementalDom.elementVoid, stackVoid);
	  var newText = wrapIdomFunc(incrementalDom.text);
	
	  var vdom = Object.freeze({
	    element: element,
	    attr: newAttr,
	    elementClose: newElementClose,
	    elementOpen: newElementOpen,
	    elementOpenEnd: newElementOpenEnd,
	    elementOpenStart: newElementOpenStart,
	    elementVoid: newElementVoid,
	    text: newText
	  });
	
	  function data(element) {
	    var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	
	    var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	    return namespace && (data[namespace] || (data[namespace] = {})) || data;
	  }
	
	  function debounce(fn) {
	    var called = false;
	    return function () {
	      var _this = this;
	
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      if (!called) {
	        called = true;
	        setTimeout(function () {
	          called = false;
	          fn.apply(_this, args);
	        });
	      }
	    };
	  }
	
	  var definePropertyConstructor = function definePropertyConstructor(obj, value) {
	    return Object.defineProperty(obj, 'constructor', { enumerable: false, value: value });
	  };
	
	  function getOwnPropertyDescriptors(obj) {
	    return Object.getOwnPropertyNames(obj || {}).reduce(function (prev, curr) {
	      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	      return prev;
	    }, {});
	  }
	
	  // In native Custom Elements v0, you can extend HTMLElement. In the polyfill
	  // you cannot, so we ensure the polyfill has a patched HTMLElement constructor.
	  if (customElementsV0Polyfill) {
	    var proto = HTMLElement.prototype;
	    window.HTMLElement = function () {
	      var ctor = this[$ctor];
	      var name = this[$name];
	      var type = ctor.extends;
	      return document.createElement(type || name, type ? name : null);
	    };
	    HTMLElement.prototype = Object.create(proto);
	    definePropertyConstructor(HTMLElement.prototype, HTMLElement);
	  }
	
	  var Component = function (_HTMLElement) {
	    inherits(Component, _HTMLElement);
	
	    function Component() {
	      classCallCheck(this, Component);
	
	      var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));
	
	      _this.createdCallback();
	      return _this;
	    }
	
	    createClass(Component, [{
	      key: 'connectedCallback',
	      value: function connectedCallback() {
	        var ctor = this.constructor;
	        var attached = ctor.attached;
	
	        var render = ctor[$renderer];
	        this[$connected] = true;
	        if (typeof render === 'function') {
	          render(this);
	        }
	        if (typeof attached === 'function') {
	          attached(this);
	        }
	      }
	    }, {
	      key: 'disconnectedCallback',
	      value: function disconnectedCallback() {
	        var detached = this.constructor.detached;
	
	        this[$connected] = false;
	        if (typeof detached === 'function') {
	          detached(this);
	        }
	      }
	    }, {
	      key: 'attributeChangedCallback',
	      value: function attributeChangedCallback(name, oldValue, newValue) {
	        var _constructor = this.constructor;
	        var attributeChanged = _constructor.attributeChanged;
	        var observedAttributes = _constructor.observedAttributes;
	
	        var propertyName = data(this, 'attributeLinks')[name];
	
	        // In V0 we have to ensure the attribute is being observed.
	        if (customElementsV0 && observedAttributes.indexOf(name) === -1) {
	          return;
	        }
	
	        if (propertyName) {
	          var propData = data(this, 'api/property/' + propertyName);
	
	          // This ensures a property set doesn't cause the attribute changed
	          // handler to run again once we set this flag. This only ever has a
	          // chance to run when you set an attribute, it then sets a property and
	          // then that causes the attribute to be set again.
	          if (propData.syncingAttribute) {
	            propData.syncingAttribute = false;
	            return;
	          }
	
	          // Sync up the property.
	          var propOpts = this.constructor.props[propertyName];
	          propData.settingAttribute = true;
	          this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
	        }
	
	        if (attributeChanged) {
	          attributeChanged(this, { name: name, newValue: newValue, oldValue: oldValue });
	        }
	      }
	    }, {
	      key: 'createdCallback',
	      value: function createdCallback() {
	        var _this2 = this;
	
	        // In the polyfill, if you define a custom element after it has been
	        // created the polyfill will call the constructor it has on record thus
	        // ignoring the one the user has defined for the element. We ensure the
	        // constructor is actually the one that was specified in the definition
	        // rather than the one the polyfill gives it.
	        //
	        // In native v0 this behaves normally, so we only need to worry about the
	        // polyfill here.
	        if (customElementsV0Polyfill) {
	          definePropertyConstructor(this, this[$ctor]);
	        }
	
	        var elemData = data(this);
	        var readyCallbacks = elemData.readyCallbacks;
	        var Ctor = this.constructor;
	        var created = Ctor.created;
	        var observedAttributes = Ctor.observedAttributes;
	        var props = Ctor.props;
	
	        // TODO: This prevents an element from being initialised multiple times. For
	        // some reason this is happening in the event tests. It's possibly creating
	        // elements in a way that the causes the custom element v1 polyfill to call
	        // the constructor twice.
	
	        if (this[$created]) return;
	        this[$created] = true;
	
	        // Set up a renderer that is debounced for property sets to call directly.
	        this[$rendererDebounced] = debounce(Ctor[$renderer]);
	
	        if (props) {
	          Ctor[$props](this);
	        }
	
	        if (created) {
	          created(this);
	        }
	
	        if (readyCallbacks) {
	          readyCallbacks.forEach(function (cb) {
	            return cb(_this2);
	          });
	          delete elemData.readyCallbacks;
	        }
	
	        // In v0 we must ensure the attributeChangedCallback is called for attrs
	        // that aren't linked to props so that the callback behaves the same no
	        // matter if v0 or v1 is being used.
	        if (customElementsV0) {
	          observedAttributes.forEach(function (name) {
	            var propertyName = data(_this2, 'attributeLinks')[name];
	            if (!propertyName) {
	              _this2.attributeChangedCallback(name, null, _this2.getAttribute(name));
	            }
	          });
	        }
	      }
	    }, {
	      key: 'attachedCallback',
	      value: function attachedCallback() {
	        this.connectedCallback();
	      }
	    }, {
	      key: 'detachedCallback',
	      value: function detachedCallback() {
	        this.disconnectedCallback();
	      }
	    }], [{
	      key: 'extend',
	      value: function extend() {
	        var definition = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	        var Base = arguments.length <= 1 || arguments[1] === undefined ? this : arguments[1];
	
	        // Create class for the user.
	        var Ctor = function (_Base) {
	          inherits(Ctor, _Base);
	
	          function Ctor() {
	            classCallCheck(this, Ctor);
	            return possibleConstructorReturn(this, Object.getPrototypeOf(Ctor).apply(this, arguments));
	          }
	
	          return Ctor;
	        }(Base);
	
	        // For inheriting from the object literal.
	
	        var opts = getOwnPropertyDescriptors(definition);
	        var prot = getOwnPropertyDescriptors(definition.prototype);
	
	        // Prototype is non configurable (but is writable) s
	        delete opts.prototype;
	
	        // Pass on static and instance members from the definition.
	        Object.defineProperties(Ctor, opts);
	        Object.defineProperties(Ctor.prototype, prot);
	
	        return Ctor;
	      }
	
	      // This is a default implementation that does strict equality copmarison on
	      // prevoius props and next props. It synchronously renders on the first prop
	      // that is different and returns immediately.
	
	    }, {
	      key: 'updated',
	      value: function updated(elem, prev) {
	        if (!prev) {
	          return true;
	        }
	        for (var name in prev) {
	          if (prev[name] !== elem[name]) {
	            return true;
	          }
	        }
	      }
	    }, {
	      key: 'observedAttributes',
	      get: function get() {
	        return [];
	      }
	    }, {
	      key: 'props',
	      get: function get() {
	        return {};
	      }
	    }]);
	    return Component;
	  }(HTMLElement);
	
	  function get$1(elem) {
	    var props = {};
	    for (var key in elem.constructor.props) {
	      props[key] = elem[key];
	    }
	    return props;
	  }
	
	  function set$1(elem, newProps) {
	    assign$1(elem, newProps);
	    if (elem.constructor.render) {
	      elem.constructor[$renderer](elem);
	    }
	  }
	
	  function props(elem, newProps) {
	    return typeof newProps === 'undefined' ? get$1(elem) : set$1(elem, newProps);
	  }
	
	  function createRenderer(Ctor) {
	    var render = Ctor.render;
	    var rendered = Ctor.rendered;
	    var updated = Ctor.updated;
	
	    return function (elem) {
	      if (elem[$rendering] || !elem[$connected]) {
	        return;
	      }
	
	      // Flag as rendering. This prevents anything from trying to render - or
	      // queueing a render - while there is a pending render.
	      elem[$rendering] = true;
	
	      // Call the updated() callback to see if we should render.
	      var shouldRender = true;
	      if (updated) {
	        var prev = elem[$props];
	        elem[$props] = props(elem);
	        shouldRender = updated(elem, prev);
	      }
	
	      // Even though this would ideally be checked in the updated() callback,
	      // it may not be, so we ensure that there is a point in proceeding.
	      if (!render) {
	        elem[$rendering] = false;
	        return;
	      }
	
	      // Try and get the current shadow root (will be setup if not).
	      var sr = elem[$shadowRoot];
	
	      // Setup the shadow root if it hasn't been setup yet.
	      if (!sr) {
	        if (shadowDomV1) {
	          sr = elem.attachShadow({ mode: 'open' });
	        } else if (shadowDomV0) {
	          sr = elem.createShadowRoot();
	        } else {
	          sr = elem;
	        }
	
	        elem[$shadowRoot] = sr;
	      }
	
	      if (shouldRender) {
	        incrementalDom.patchInner(sr, render, elem);
	        if (rendered) {
	          rendered(elem);
	        }
	      }
	
	      elem[$rendering] = false;
	    };
	  }
	
	  function dashCase(str) {
	    return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	      var dash = !one || idx % 2 === 0 ? '' : '-';
	      return '' + one + dash + two.toLowerCase();
	    });
	  }
	
	  function getDefaultValue(elem, name, opts) {
	    return typeof opts.default === 'function' ? opts.default(elem, { name: name }) : opts.default;
	  }
	
	  function getInitialValue(elem, name, opts) {
	    return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : opts.initial;
	  }
	
	  function createNativePropertyDefinition(name, opts) {
	    var prop = {
	      configurable: true,
	      enumerable: true
	    };
	
	    prop.created = function (elem) {
	      var propData = data(elem, 'api/property/' + name);
	      var attributeName = opts.attribute;
	      var initialValue = elem[name];
	      var shouldSyncAttribute = false;
	
	      // Store property to attribute link information.
	      data(elem, 'attributeLinks')[attributeName] = name;
	      data(elem, 'propertyLinks')[name] = attributeName;
	
	      // Set up initial value if it wasn't specified.
	      if (empty(initialValue)) {
	        if (attributeName && elem.hasAttribute(attributeName)) {
	          initialValue = opts.deserialize(elem.getAttribute(attributeName));
	        } else if ('initial' in opts) {
	          initialValue = getInitialValue(elem, name, opts);
	          shouldSyncAttribute = true;
	        } else if ('default' in opts) {
	          initialValue = getDefaultValue(elem, name, opts);
	        }
	      }
	
	      if (shouldSyncAttribute) {
	        prop.set.call(elem, initialValue);
	      } else {
	        propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
	      }
	    };
	
	    prop.get = function () {
	      var propData = data(this, 'api/property/' + name);
	      var internalValue = propData.internalValue;
	
	      if (typeof opts.get === 'function') {
	        return opts.get(this, { name: name, internalValue: internalValue });
	      }
	      return internalValue;
	    };
	
	    prop.set = function (newValue) {
	      var propData = data(this, 'api/property/' + name);
	      var oldValue = propData.oldValue;
	
	      var shouldRemoveAttribute = false;
	
	      if (empty(oldValue)) {
	        oldValue = null;
	      }
	
	      if (empty(newValue)) {
	        newValue = getDefaultValue(this, name, opts);
	        shouldRemoveAttribute = true;
	      }
	
	      if (typeof opts.coerce === 'function') {
	        newValue = opts.coerce(newValue);
	      }
	
	      propData.internalValue = newValue;
	
	      var changeData = { name: name, newValue: newValue, oldValue: oldValue };
	
	      if (typeof opts.set === 'function') {
	        opts.set(this, changeData);
	      }
	
	      // Queue a re-render only if it's not currently rendering.
	      if (!this[$rendering]) {
	        this[$rendererDebounced](this);
	      }
	
	      propData.oldValue = newValue;
	
	      // Link up the attribute.
	      var attributeName = data(this, 'propertyLinks')[name];
	      if (attributeName && !propData.settingAttribute) {
	        var serializedValue = opts.serialize(newValue);
	        propData.syncingAttribute = true;
	        if (shouldRemoveAttribute || empty(serializedValue)) {
	          this.removeAttribute(attributeName);
	        } else {
	          this.setAttribute(attributeName, serializedValue);
	        }
	      }
	
	      // Allow the attribute to be linked again.
	      propData.settingAttribute = false;
	    };
	
	    return prop;
	  }
	
	  function initProps(opts) {
	    opts = opts || {};
	
	    if (typeof opts === 'function') {
	      opts = { coerce: opts };
	    }
	
	    return function (name) {
	      return createNativePropertyDefinition(name, assign$1({
	        default: null,
	        deserialize: function deserialize(value) {
	          return value;
	        },
	        serialize: function serialize(value) {
	          return value;
	        }
	      }, opts));
	    };
	  }
	
	  var registry = {};
	
	  // Ensures that definitions passed as part of the constructor are functions
	  // that return property definitions used on the element.
	  function ensurePropertyFunctions(Ctor) {
	    var props = Ctor.props;
	    var names = Object.keys(props || {});
	    return names.reduce(function (descriptors, descriptorName) {
	      descriptors[descriptorName] = props[descriptorName];
	      if (typeof descriptors[descriptorName] !== 'function') {
	        descriptors[descriptorName] = initProps(descriptors[descriptorName]);
	      }
	      return descriptors;
	    }, {});
	  }
	
	  // Ensures the property definitions are transformed to objects that can be used
	  // to create properties on the element.
	  function ensurePropertyDefinitions(Ctor) {
	    var props = ensurePropertyFunctions(Ctor);
	    return Object.keys(props).reduce(function (descriptors, descriptorName) {
	      descriptors[descriptorName] = props[descriptorName](descriptorName);
	      return descriptors;
	    }, {});
	  }
	
	  // Ensures linked properties that have linked attributes are pre-formatted to
	  // the attribute name in which they are linked.
	  function formatLinkedAttributes(Ctor) {
	    var observedAttributes = Ctor.observedAttributes;
	    var props = Ctor.props;
	
	    if (!props) {
	      return;
	    }
	
	    Object.keys(props).forEach(function (name) {
	      var prop = props[name];
	      var attr = prop.attribute;
	      if (attr) {
	        // Ensure the property is updated.
	        var linkedAttr = prop.attribute = attr === true ? dashCase(name) : attr;
	
	        // Automatically observe the attribute since they're linked from the
	        // attributeChangedCallback.
	        if (observedAttributes.indexOf(linkedAttr) === -1) {
	          observedAttributes.push(linkedAttr);
	        }
	      }
	    });
	
	    // Merge observed attributes.
	    Object.defineProperty(Ctor, 'observedAttributes', {
	      configurable: true,
	      enumerable: true,
	      get: function get() {
	        return observedAttributes;
	      }
	    });
	  }
	
	  function createInitProps(Ctor) {
	    var props = ensurePropertyDefinitions(Ctor);
	
	    return function (elem) {
	      if (!props) {
	        return;
	      }
	
	      Object.keys(props).forEach(function (name) {
	        var prop = props[name];
	        prop.created(elem);
	
	        // https://bugs.webkit.org/show_bug.cgi?id=49739
	        //
	        // When Webkit fixes that bug so that native property accessors can be
	        // retrieved, we can move defining the property to the prototype and away
	        // from having to do if for every instance as all other browsers support
	        // this.
	        Object.defineProperty(elem, name, prop);
	      });
	    };
	  }
	
	  function generateUniqueName(name) {
	    // we don't need to generate a unique name if it's the first time
	    if (!registry[name]) {
	      registry[name] = true;
	      return name;
	    }
	    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
	    var rand = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = Math.random() * 16 | 0,
	          v = c == 'x' ? r : r & 0x3 | 0x8;
	      return v.toString(16);
	    });
	
	    return name + '-' + rand;
	  }
	
	  function define(name, opts) {
	    if (opts === undefined) {
	      throw new Error('You have to define options to register a component ' + name);
	    }
	
	    var uniqueName = generateUniqueName(name);
	    var Ctor = (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object' ? Component.extend(opts) : opts;
	
	    formatLinkedAttributes(Ctor);
	
	    Ctor[$name] = uniqueName;
	    Ctor[$props] = createInitProps(Ctor);
	    Ctor[$renderer] = createRenderer(Ctor);
	
	    if (customElementsV0) {
	      // These properties are necessary for the Custom Element v0 polyfill so
	      // that we can fix it not working with extending the built-in HTMLElement.
	      Ctor.prototype[$ctor] = Ctor;
	      Ctor.prototype[$name] = uniqueName;
	      var NewCtor = document.registerElement(uniqueName, Ctor);
	      definePropertyConstructor(NewCtor.prototype, Ctor);
	      return customElementsV0Polyfill ? Ctor : NewCtor;
	    } else if (customElementsV1) {
	      window.customElements.define(uniqueName, Ctor, { extends: Ctor.extends });
	    } else {
	      throw new Error('Skate requires native custom element support or a polyfill.');
	    }
	
	    return Ctor;
	  }
	
	  var CustomEvent = function (CustomEvent) {
	    if (CustomEvent) {
	      try {
	        new CustomEvent();
	      } catch (e) {
	        return undefined;
	      }
	    }
	    return CustomEvent;
	  }(window.CustomEvent);
	
	  function createCustomEvent(name) {
	    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    if (CustomEvent) {
	      return new CustomEvent(name, opts);
	    }
	    var e = document.createEvent('CustomEvent');
	    e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
	    return e;
	  }
	
	  function emit(elem, name) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    /* jshint expr: true */
	    opts.bubbles === undefined && (opts.bubbles = true);
	    opts.cancelable === undefined && (opts.cancelable = true);
	    return elem.disabled ? true : elem.dispatchEvent(createCustomEvent(name, opts));
	  }
	
	  function getValue(elem) {
	    var type = elem.type;
	    if (type === 'checkbox' || type === 'radio') {
	      return elem.checked ? elem.value || true : false;
	    }
	    return elem.value;
	  }
	
	  function link(elem, target) {
	    return function (e) {
	      var value = getValue(e.target);
	      var localTarget = target || e.target.name || 'value';
	
	      if (localTarget.indexOf('.') > -1) {
	        var parts = localTarget.split('.');
	        var firstPart = parts[0];
	        var propName = parts.pop();
	        var obj = parts.reduce(function (prev, curr) {
	          return prev && prev[curr];
	        }, elem);
	
	        obj[propName || e.target.name] = value;
	        props(elem, defineProperty({}, firstPart, elem[firstPart]));
	      } else {
	        props(elem, defineProperty({}, localTarget, value));
	      }
	    };
	  }
	
	  function ready(elem, done) {
	    var info = data(elem);
	    if (elem[$created]) {
	      done(elem);
	    } else if (info.readyCallbacks) {
	      info.readyCallbacks.push(done);
	    } else {
	      info.readyCallbacks = [done];
	    }
	  }
	
	  exports.Component = Component;
	  exports.define = define;
	  exports.emit = emit;
	  exports.link = link;
	  exports.prop = prop;
	  exports.props = props;
	  exports.ready = ready;
	  exports.symbols = symbols$1;
	  exports.vdom = vdom;
	
	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	//# sourceMappingURL=index.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * @license
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	'use strict';
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * A cached reference to the hasOwnProperty function.
	 */
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	/**
	 * A cached reference to the create function.
	 */
	var create = Object.create;
	
	/**
	 * Used to prevent property collisions between our "map" and its prototype.
	 * @param {!Object<string, *>} map The map to check.
	 * @param {string} property The property to check.
	 * @return {boolean} Whether map has property.
	 */
	var has = function has(map, property) {
	  return hasOwnProperty.call(map, property);
	};
	
	/**
	 * Creates an map object without a prototype.
	 * @return {!Object}
	 */
	var createMap = function createMap() {
	  return create(null);
	};
	
	/**
	 * Keeps track of information needed to perform diffs for a given DOM node.
	 * @param {!string} nodeName
	 * @param {?string=} key
	 * @constructor
	 */
	function NodeData(nodeName, key) {
	  /**
	   * The attributes and their values.
	   * @const {!Object<string, *>}
	   */
	  this.attrs = createMap();
	
	  /**
	   * An array of attribute name/value pairs, used for quickly diffing the
	   * incomming attributes to see if the DOM node's attributes need to be
	   * updated.
	   * @const {Array<*>}
	   */
	  this.attrsArr = [];
	
	  /**
	   * The incoming attributes for this Node, before they are updated.
	   * @const {!Object<string, *>}
	   */
	  this.newAttrs = createMap();
	
	  /**
	   * The key used to identify this node, used to preserve DOM nodes when they
	   * move within their parent.
	   * @const
	   */
	  this.key = key;
	
	  /**
	   * Keeps track of children within this node by their key.
	   * {?Object<string, !Element>}
	   */
	  this.keyMap = null;
	
	  /**
	   * Whether or not the keyMap is currently valid.
	   * {boolean}
	   */
	  this.keyMapValid = true;
	
	  /**
	   * The node name for this node.
	   * @const {string}
	   */
	  this.nodeName = nodeName;
	
	  /**
	   * @type {?string}
	   */
	  this.text = null;
	}
	
	/**
	 * Initializes a NodeData object for a Node.
	 *
	 * @param {Node} node The node to initialize data for.
	 * @param {string} nodeName The node name of node.
	 * @param {?string=} key The key that identifies the node.
	 * @return {!NodeData} The newly initialized data object
	 */
	var initData = function initData(node, nodeName, key) {
	  var data = new NodeData(nodeName, key);
	  node['__incrementalDOMData'] = data;
	  return data;
	};
	
	/**
	 * Retrieves the NodeData object for a Node, creating it if necessary.
	 *
	 * @param {Node} node The node to retrieve the data for.
	 * @return {!NodeData} The NodeData for this Node.
	 */
	var getData = function getData(node) {
	  var data = node['__incrementalDOMData'];
	
	  if (!data) {
	    var nodeName = node.nodeName.toLowerCase();
	    var key = null;
	
	    if (node instanceof Element) {
	      key = node.getAttribute('key');
	    }
	
	    data = initData(node, nodeName, key);
	  }
	
	  return data;
	};
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/** @const */
	var symbols = {
	  default: '__default',
	
	  placeholder: '__placeholder'
	};
	
	/**
	 * @param {string} name
	 * @return {string|undefined} The namespace to use for the attribute.
	 */
	var getNamespace = function getNamespace(name) {
	  if (name.lastIndexOf('xml:', 0) === 0) {
	    return 'http://www.w3.org/XML/1998/namespace';
	  }
	
	  if (name.lastIndexOf('xlink:', 0) === 0) {
	    return 'http://www.w3.org/1999/xlink';
	  }
	};
	
	/**
	 * Applies an attribute or property to a given Element. If the value is null
	 * or undefined, it is removed from the Element. Otherwise, the value is set
	 * as an attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {?(boolean|number|string)=} value The attribute's value.
	 */
	var applyAttr = function applyAttr(el, name, value) {
	  if (value == null) {
	    el.removeAttribute(name);
	  } else {
	    var attrNS = getNamespace(name);
	    if (attrNS) {
	      el.setAttributeNS(attrNS, name, value);
	    } else {
	      el.setAttribute(name, value);
	    }
	  }
	};
	
	/**
	 * Applies a property to a given Element.
	 * @param {!Element} el
	 * @param {string} name The property's name.
	 * @param {*} value The property's value.
	 */
	var applyProp = function applyProp(el, name, value) {
	  el[name] = value;
	};
	
	/**
	 * Applies a style to an Element. No vendor prefix expansion is done for
	 * property names/values.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} style The style to set. Either a string of css or an object
	 *     containing property-value pairs.
	 */
	var applyStyle = function applyStyle(el, name, style) {
	  if (typeof style === 'string') {
	    el.style.cssText = style;
	  } else {
	    el.style.cssText = '';
	    var elStyle = el.style;
	    var obj = /** @type {!Object<string,string>} */style;
	
	    for (var prop in obj) {
	      if (has(obj, prop)) {
	        elStyle[prop] = obj[prop];
	      }
	    }
	  }
	};
	
	/**
	 * Updates a single attribute on an Element.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value. If the value is an object or
	 *     function it is set on the Element, otherwise, it is set as an HTML
	 *     attribute.
	 */
	var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	  if (type === 'object' || type === 'function') {
	    applyProp(el, name, value);
	  } else {
	    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
	  }
	};
	
	/**
	 * Calls the appropriate attribute mutator for this attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value.
	 */
	var updateAttribute = function updateAttribute(el, name, value) {
	  var data = getData(el);
	  var attrs = data.attrs;
	
	  if (attrs[name] === value) {
	    return;
	  }
	
	  var mutator = attributes[name] || attributes[symbols.default];
	  mutator(el, name, value);
	
	  attrs[name] = value;
	};
	
	/**
	 * A publicly mutable object to provide custom mutators for attributes.
	 * @const {!Object<string, function(!Element, string, *)>}
	 */
	var attributes = createMap();
	
	// Special generic mutator that's called for any attribute that does not
	// have a specific mutator.
	attributes[symbols.default] = applyAttributeTyped;
	
	attributes[symbols.placeholder] = function () {};
	
	attributes['style'] = applyStyle;
	
	/**
	 * Gets the namespace to create an element (of a given tag) in.
	 * @param {string} tag The tag to get the namespace for.
	 * @param {?Node} parent
	 * @return {?string} The namespace to create the tag in.
	 */
	var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
	  if (tag === 'svg') {
	    return 'http://www.w3.org/2000/svg';
	  }
	
	  if (getData(parent).nodeName === 'foreignObject') {
	    return null;
	  }
	
	  return parent.namespaceURI;
	};
	
	/**
	 * Creates an Element.
	 * @param {Document} doc The document with which to create the Element.
	 * @param {?Node} parent
	 * @param {string} tag The tag for the Element.
	 * @param {?string=} key A key to identify the Element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element.
	 * @return {!Element}
	 */
	var createElement = function createElement(doc, parent, tag, key, statics) {
	  var namespace = getNamespaceForTag(tag, parent);
	  var el = undefined;
	
	  if (namespace) {
	    el = doc.createElementNS(namespace, tag);
	  } else {
	    el = doc.createElement(tag);
	  }
	
	  initData(el, tag, key);
	
	  if (statics) {
	    for (var i = 0; i < statics.length; i += 2) {
	      updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
	    }
	  }
	
	  return el;
	};
	
	/**
	 * Creates a Text Node.
	 * @param {Document} doc The document with which to create the Element.
	 * @return {!Text}
	 */
	var createText = function createText(doc) {
	  var node = doc.createTextNode('');
	  initData(node, '#text', null);
	  return node;
	};
	
	/**
	 * Creates a mapping that can be used to look up children using a key.
	 * @param {?Node} el
	 * @return {!Object<string, !Element>} A mapping of keys to the children of the
	 *     Element.
	 */
	var createKeyMap = function createKeyMap(el) {
	  var map = createMap();
	  var child = el.firstElementChild;
	
	  while (child) {
	    var key = getData(child).key;
	
	    if (key) {
	      map[key] = child;
	    }
	
	    child = child.nextElementSibling;
	  }
	
	  return map;
	};
	
	/**
	 * Retrieves the mapping of key to child node for a given Element, creating it
	 * if necessary.
	 * @param {?Node} el
	 * @return {!Object<string, !Node>} A mapping of keys to child Elements
	 */
	var getKeyMap = function getKeyMap(el) {
	  var data = getData(el);
	
	  if (!data.keyMap) {
	    data.keyMap = createKeyMap(el);
	  }
	
	  return data.keyMap;
	};
	
	/**
	 * Retrieves a child from the parent with the given key.
	 * @param {?Node} parent
	 * @param {?string=} key
	 * @return {?Node} The child corresponding to the key.
	 */
	var getChild = function getChild(parent, key) {
	  return key ? getKeyMap(parent)[key] : null;
	};
	
	/**
	 * Registers an element as being a child. The parent will keep track of the
	 * child using the key. The child can be retrieved using the same key using
	 * getKeyMap. The provided key should be unique within the parent Element.
	 * @param {?Node} parent The parent of child.
	 * @param {string} key A key to identify the child with.
	 * @param {!Node} child The child to register.
	 */
	var registerChild = function registerChild(parent, key, child) {
	  getKeyMap(parent)[key] = child;
	};
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/** @const */
	var notifications = {
	  /**
	   * Called after patch has compleated with any Nodes that have been created
	   * and added to the DOM.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesCreated: null,
	
	  /**
	   * Called after patch has compleated with any Nodes that have been removed
	   * from the DOM.
	   * Note it's an applications responsibility to handle any childNodes.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesDeleted: null
	};
	
	/**
	 * Keeps track of the state of a patch.
	 * @constructor
	 */
	function Context() {
	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.created = notifications.nodesCreated && [];
	
	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.deleted = notifications.nodesDeleted && [];
	}
	
	/**
	 * @param {!Node} node
	 */
	Context.prototype.markCreated = function (node) {
	  if (this.created) {
	    this.created.push(node);
	  }
	};
	
	/**
	 * @param {!Node} node
	 */
	Context.prototype.markDeleted = function (node) {
	  if (this.deleted) {
	    this.deleted.push(node);
	  }
	};
	
	/**
	 * Notifies about nodes that were created during the patch opearation.
	 */
	Context.prototype.notifyChanges = function () {
	  if (this.created && this.created.length > 0) {
	    notifications.nodesCreated(this.created);
	  }
	
	  if (this.deleted && this.deleted.length > 0) {
	    notifications.nodesDeleted(this.deleted);
	  }
	};
	
	/**
	* Makes sure that keyed Element matches the tag name provided.
	* @param {!string} nodeName The nodeName of the node that is being matched.
	* @param {string=} tag The tag name of the Element.
	* @param {?string=} key The key of the Element.
	*/
	var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
	  if (nodeName !== tag) {
	    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
	  }
	};
	
	/** @type {?Context} */
	var context = null;
	
	/** @type {?Node} */
	var currentNode = null;
	
	/** @type {?Node} */
	var currentParent = null;
	
	/** @type {?Element|?DocumentFragment} */
	var root = null;
	
	/** @type {?Document} */
	var doc = null;
	
	/**
	 * Returns a patcher function that sets up and restores a patch context,
	 * running the run function with the provided data.
	 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
	 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
	 * @template T
	 */
	var patchFactory = function patchFactory(run) {
	  /**
	   * TODO(moz): These annotations won't be necessary once we switch to Closure
	   * Compiler's new type inference. Remove these once the switch is done.
	   *
	   * @param {(!Element|!DocumentFragment)} node
	   * @param {!function(T)} fn
	   * @param {T=} data
	   * @template T
	   */
	  var f = function f(node, fn, data) {
	    var prevContext = context;
	    var prevRoot = root;
	    var prevDoc = doc;
	    var prevCurrentNode = currentNode;
	    var prevCurrentParent = currentParent;
	    var previousInAttributes = false;
	    var previousInSkip = false;
	
	    context = new Context();
	    root = node;
	    doc = node.ownerDocument;
	    currentParent = node.parentNode;
	
	    if (false) {}
	
	    run(node, fn, data);
	
	    if (false) {}
	
	    context.notifyChanges();
	
	    context = prevContext;
	    root = prevRoot;
	    doc = prevDoc;
	    currentNode = prevCurrentNode;
	    currentParent = prevCurrentParent;
	  };
	  return f;
	};
	
	/**
	 * Patches the document starting at node with the provided function. This
	 * function may be called during an existing patch operation.
	 * @param {!Element|!DocumentFragment} node The Element or Document
	 *     to patch.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patchInner = patchFactory(function (node, fn, data) {
	  currentNode = node;
	
	  enterNode();
	  fn(data);
	  exitNode();
	
	  if (false) {}
	});
	
	/**
	 * Patches an Element with the the provided function. Exactly one top level
	 * element call should be made corresponding to `node`.
	 * @param {!Element} node The Element where the patch should start.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM. This should have at most one top level
	 *     element call.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patchOuter = patchFactory(function (node, fn, data) {
	  currentNode = /** @type {!Element} */{ nextSibling: node };
	
	  fn(data);
	
	  if (false) {}
	});
	
	/**
	 * Checks whether or not the current node matches the specified nodeName and
	 * key.
	 *
	 * @param {?string} nodeName The nodeName for this node.
	 * @param {?string=} key An optional key that identifies a node.
	 * @return {boolean} True if the node matches, false otherwise.
	 */
	var matches = function matches(nodeName, key) {
	  var data = getData(currentNode);
	
	  // Key check is done using double equals as we want to treat a null key the
	  // same as undefined. This should be okay as the only values allowed are
	  // strings, null and undefined so the == semantics are not too weird.
	  return nodeName === data.nodeName && key == data.key;
	};
	
	/**
	 * Aligns the virtual Element definition with the actual DOM, moving the
	 * corresponding DOM node to the correct location or creating it if necessary.
	 * @param {string} nodeName For an Element, this should be a valid tag string.
	 *     For a Text, this should be #text.
	 * @param {?string=} key The key used to identify this element.
	 * @param {?Array<*>=} statics For an Element, this should be an array of
	 *     name-value pairs.
	 */
	var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
	  if (currentNode && matches(nodeName, key)) {
	    return;
	  }
	
	  var node = undefined;
	
	  // Check to see if the node has moved within the parent.
	  if (key) {
	    node = getChild(currentParent, key);
	    if (node && 'production' !== 'production') {
	      assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
	    }
	  }
	
	  // Create the node if it doesn't exist.
	  if (!node) {
	    if (nodeName === '#text') {
	      node = createText(doc);
	    } else {
	      node = createElement(doc, currentParent, nodeName, key, statics);
	    }
	
	    if (key) {
	      registerChild(currentParent, key, node);
	    }
	
	    context.markCreated(node);
	  }
	
	  // If the node has a key, remove it from the DOM to prevent a large number
	  // of re-orders in the case that it moved far or was completely removed.
	  // Since we hold on to a reference through the keyMap, we can always add it
	  // back.
	  if (currentNode && getData(currentNode).key) {
	    currentParent.replaceChild(node, currentNode);
	    getData(currentParent).keyMapValid = false;
	  } else {
	    currentParent.insertBefore(node, currentNode);
	  }
	
	  currentNode = node;
	};
	
	/**
	 * Clears out any unvisited Nodes, as the corresponding virtual element
	 * functions were never called for them.
	 */
	var clearUnvisitedDOM = function clearUnvisitedDOM() {
	  var node = currentParent;
	  var data = getData(node);
	  var keyMap = data.keyMap;
	  var keyMapValid = data.keyMapValid;
	  var child = node.lastChild;
	  var key = undefined;
	
	  if (child === currentNode && keyMapValid) {
	    return;
	  }
	
	  if (data.attrs[symbols.placeholder] && node !== root) {
	    if (false) {}
	    return;
	  }
	
	  while (child !== currentNode) {
	    node.removeChild(child);
	    context.markDeleted( /** @type {!Node}*/child);
	
	    key = getData(child).key;
	    if (key) {
	      delete keyMap[key];
	    }
	    child = node.lastChild;
	  }
	
	  // Clean the keyMap, removing any unusued keys.
	  if (!keyMapValid) {
	    for (key in keyMap) {
	      child = keyMap[key];
	      if (child.parentNode !== node) {
	        context.markDeleted(child);
	        delete keyMap[key];
	      }
	    }
	
	    data.keyMapValid = true;
	  }
	};
	
	/**
	 * Changes to the first child of the current node.
	 */
	var enterNode = function enterNode() {
	  currentParent = currentNode;
	  currentNode = null;
	};
	
	/**
	 * Changes to the next sibling of the current node.
	 */
	var nextNode = function nextNode() {
	  if (currentNode) {
	    currentNode = currentNode.nextSibling;
	  } else {
	    currentNode = currentParent.firstChild;
	  }
	};
	
	/**
	 * Changes to the parent of the current node, removing any unvisited children.
	 */
	var exitNode = function exitNode() {
	  clearUnvisitedDOM();
	
	  currentNode = currentParent;
	  currentParent = currentParent.parentNode;
	};
	
	/**
	 * Makes sure that the current node is an Element with a matching tagName and
	 * key.
	 *
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @return {!Element} The corresponding Element.
	 */
	var coreElementOpen = function coreElementOpen(tag, key, statics) {
	  nextNode();
	  alignWithDOM(tag, key, statics);
	  enterNode();
	  return (/** @type {!Element} */currentParent
	  );
	};
	
	/**
	 * Closes the currently open Element, removing any unvisited children if
	 * necessary.
	 *
	 * @return {!Element} The corresponding Element.
	 */
	var coreElementClose = function coreElementClose() {
	  if (false) {}
	
	  exitNode();
	  return (/** @type {!Element} */currentNode
	  );
	};
	
	/**
	 * Makes sure the current node is a Text node and creates a Text node if it is
	 * not.
	 *
	 * @return {!Text} The corresponding Text Node.
	 */
	var coreText = function coreText() {
	  nextNode();
	  alignWithDOM('#text', null, null);
	  return (/** @type {!Text} */currentNode
	  );
	};
	
	/**
	 * Gets the current Element being patched.
	 * @return {!Element}
	 */
	var currentElement = function currentElement() {
	  if (false) {}
	  return (/** @type {!Element} */currentParent
	  );
	};
	
	/**
	 * Skips the children in a subtree, allowing an Element to be closed without
	 * clearing out the children.
	 */
	var skip = function skip() {
	  if (false) {}
	  currentNode = currentParent.lastChild;
	};
	
	/**
	 * The offset in the virtual element declaration where the attributes are
	 * specified.
	 * @const
	 */
	var ATTRIBUTES_OFFSET = 3;
	
	/**
	 * Builds an array of arguments for use with elementOpenStart, attr and
	 * elementOpenEnd.
	 * @const {Array<*>}
	 */
	var argsBuilder = [];
	
	/**
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpen = function elementOpen(tag, key, statics, const_args) {
	  if (false) {}
	
	  var node = coreElementOpen(tag, key, statics);
	  var data = getData(node);
	
	  /*
	   * Checks to see if one or more attributes have changed for a given Element.
	   * When no attributes have changed, this is much faster than checking each
	   * individual argument. When attributes have changed, the overhead of this is
	   * minimal.
	   */
	  var attrsArr = data.attrsArr;
	  var newAttrs = data.newAttrs;
	  var attrsChanged = false;
	  var i = ATTRIBUTES_OFFSET;
	  var j = 0;
	
	  for (; i < arguments.length; i += 1, j += 1) {
	    if (attrsArr[j] !== arguments[i]) {
	      attrsChanged = true;
	      break;
	    }
	  }
	
	  for (; i < arguments.length; i += 1, j += 1) {
	    attrsArr[j] = arguments[i];
	  }
	
	  if (j < attrsArr.length) {
	    attrsChanged = true;
	    attrsArr.length = j;
	  }
	
	  /*
	   * Actually perform the attribute update.
	   */
	  if (attrsChanged) {
	    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
	      newAttrs[arguments[i]] = arguments[i + 1];
	    }
	
	    for (var _attr in newAttrs) {
	      updateAttribute(node, _attr, newAttrs[_attr]);
	      newAttrs[_attr] = undefined;
	    }
	  }
	
	  return node;
	};
	
	/**
	 * Declares a virtual Element at the current location in the document. This
	 * corresponds to an opening tag and a elementClose tag is required. This is
	 * like elementOpen, but the attributes are defined using the attr function
	 * rather than being passed as arguments. Must be folllowed by 0 or more calls
	 * to attr, then a call to elementOpenEnd.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 */
	var elementOpenStart = function elementOpenStart(tag, key, statics) {
	  if (false) {}
	
	  argsBuilder[0] = tag;
	  argsBuilder[1] = key;
	  argsBuilder[2] = statics;
	};
	
	/***
	 * Defines a virtual attribute at this point of the DOM. This is only valid
	 * when called between elementOpenStart and elementOpenEnd.
	 *
	 * @param {string} name
	 * @param {*} value
	 */
	var attr = function attr(name, value) {
	  if (false) {}
	
	  argsBuilder.push(name, value);
	};
	
	/**
	 * Closes an open tag started with elementOpenStart.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpenEnd = function elementOpenEnd() {
	  if (false) {}
	
	  var node = elementOpen.apply(null, argsBuilder);
	  argsBuilder.length = 0;
	  return node;
	};
	
	/**
	 * Closes an open virtual Element.
	 *
	 * @param {string} tag The element's tag.
	 * @return {!Element} The corresponding Element.
	 */
	var elementClose = function elementClose(tag) {
	  if (false) {}
	
	  var node = coreElementClose();
	
	  if (false) {}
	
	  return node;
	};
	
	/**
	 * Declares a virtual Element at the current location in the document that has
	 * no children.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementVoid = function elementVoid(tag, key, statics, const_args) {
	  elementOpen.apply(null, arguments);
	  return elementClose(tag);
	};
	
	/**
	 * Declares a virtual Element at the current location in the document that is a
	 * placeholder element. Children of this Element can be manually managed and
	 * will not be cleared by the library.
	 *
	 * A key must be specified to make sure that this node is correctly preserved
	 * across all conditionals.
	 *
	 * @param {string} tag The element's tag.
	 * @param {string} key The key used to identify this element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementPlaceholder = function elementPlaceholder(tag, key, statics, const_args) {
	  if (false) {}
	
	  elementOpen.apply(null, arguments);
	  skip();
	  return elementClose(tag);
	};
	
	/**
	 * Declares a virtual Text at this point in the document.
	 *
	 * @param {string|number|boolean} value The value of the Text.
	 * @param {...(function((string|number|boolean)):string)} const_args
	 *     Functions to format the value which are called only when the value has
	 *     changed.
	 * @return {!Text} The corresponding text node.
	 */
	var text = function text(value, const_args) {
	  if (false) {}
	
	  var node = coreText();
	  var data = getData(node);
	
	  if (data.text !== value) {
	    data.text = /** @type {string} */value;
	
	    var formatted = value;
	    for (var i = 1; i < arguments.length; i += 1) {
	      /*
	       * Call the formatter function directly to prevent leaking arguments.
	       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
	       */
	      var fn = arguments[i];
	      formatted = fn(formatted);
	    }
	
	    node.data = formatted;
	  }
	
	  return node;
	};
	
	exports.patch = patchInner;
	exports.patchInner = patchInner;
	exports.patchOuter = patchOuter;
	exports.currentElement = currentElement;
	exports.skip = skip;
	exports.elementVoid = elementVoid;
	exports.elementOpenStart = elementOpenStart;
	exports.elementOpenEnd = elementOpenEnd;
	exports.elementOpen = elementOpen;
	exports.elementClose = elementClose;
	exports.elementPlaceholder = elementPlaceholder;
	exports.text = text;
	exports.attr = attr;
	exports.symbols = symbols;
	exports.attributes = attributes;
	exports.applyAttr = applyAttr;
	exports.applyProp = applyProp;
	exports.notifications = notifications;
	
	//# sourceMappingURL=incremental-dom-cjs.js.map

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	// REGEX //
	
	var re = '';
	
	// Use a native function as a template...
	re += Function.prototype.toString.call(Function);
	
	// Escape special RegExp characters...
	re = re.replace(/([.*+?^=!:$(){}|[\]\/\\])/g, '\\$1');
	
	// Replace any mentions of `Function` to make template generic.
	// Replace `for ...` and additional info provided in other environments, such as Rhino (see lodash).
	re = re.replace(/Function|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?');
	
	// Bracket the regex:
	re = '^' + re + '$';
	
	// EXPORTS //
	
	module.exports = new RegExp(re);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Index = exports.Docs = undefined;
	
	var _docs = __webpack_require__(11);
	
	var _docs2 = _interopRequireDefault(_docs);
	
	var _index = __webpack_require__(17);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Docs = _docs2.default;
	exports.Index = _index2.default;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _skatejs = __webpack_require__(7);
	
	var _helpers = __webpack_require__(12);
	
	exports.default = (0, _skatejs.define)('sk-page-docs', {
	  render: function render() {
	    _skatejs.vdom.elementOpen(_helpers.Layout);
	
	    _skatejs.vdom.elementOpen('p');
	
	    _skatejs.vdom.text('The docs are currently being ported over from the ');
	
	    _skatejs.vdom.elementOpen('a', null, null, 'href', 'https://github.com/skatejs/skatejs');
	
	    _skatejs.vdom.text('README');
	
	    _skatejs.vdom.elementClose('a');
	
	    _skatejs.vdom.text('.');
	
	    _skatejs.vdom.elementClose('p');
	
	    return _skatejs.vdom.elementClose(_helpers.Layout);
	  }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Layout = exports.Link = undefined;
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _attr = function _attr(value, name) {
	  _skatejs.vdom.attr(name, value);
	};
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _page = __webpack_require__(13);
	
	var _page2 = _interopRequireDefault(_page);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function followHref(e) {
	  (0, _page2.default)(e.target.pathname || '/');
	  e.preventDefault();
	}
	
	var Link = exports.Link = function Link(props, chren) {
	  _skatejs.vdom.elementOpenStart('a');
	
	  _forOwn(props, _attr);
	
	  _skatejs.vdom.attr('onclick', followHref);
	
	  _skatejs.vdom.elementOpenEnd('a');
	
	  _renderArbitrary(chren());
	
	  return _skatejs.vdom.elementClose('a');
	};
	var Layout = exports.Layout = function Layout(props, chren) {
	  _skatejs.vdom.elementOpen('div', null, null, 'style', 'padding: 20px');
	
	  _renderArbitrary(chren());
	
	  return _skatejs.vdom.elementClose('div');
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/* globals require, module */
	
	'use strict';
	
	/**
	 * Module dependencies.
	 */
	
	var pathtoRegexp = __webpack_require__(15);
	
	/**
	 * Module exports.
	 */
	
	module.exports = page;
	
	/**
	 * Detect click event
	 */
	var clickEvent = 'undefined' !== typeof document && document.ontouchstart ? 'touchstart' : 'click';
	
	/**
	 * To work properly with the URL
	 * history.location generated polyfill in https://github.com/devote/HTML5-History-API
	 */
	
	var location = 'undefined' !== typeof window && (window.history.location || window.location);
	
	/**
	 * Perform initial dispatch.
	 */
	
	var dispatch = true;
	
	/**
	 * Decode URL components (query string, pathname, hash).
	 * Accommodates both regular percent encoding and x-www-form-urlencoded format.
	 */
	var decodeURLComponents = true;
	
	/**
	 * Base path.
	 */
	
	var base = '';
	
	/**
	 * Running flag.
	 */
	
	var running;
	
	/**
	 * HashBang option
	 */
	
	var hashbang = false;
	
	/**
	 * Previous context, for capturing
	 * page exit events.
	 */
	
	var prevContext;
	
	/**
	 * Register `path` with callback `fn()`,
	 * or route `path`, or redirection,
	 * or `page.start()`.
	 *
	 *   page(fn);
	 *   page('*', fn);
	 *   page('/user/:id', load, user);
	 *   page('/user/' + user.id, { some: 'thing' });
	 *   page('/user/' + user.id);
	 *   page('/from', '/to')
	 *   page();
	 *
	 * @param {string|!Function|!Object} path
	 * @param {Function=} fn
	 * @api public
	 */
	
	function page(path, fn) {
	  // <callback>
	  if ('function' === typeof path) {
	    return page('*', path);
	  }
	
	  // route <path> to <callback ...>
	  if ('function' === typeof fn) {
	    var route = new Route( /** @type {string} */path);
	    for (var i = 1; i < arguments.length; ++i) {
	      page.callbacks.push(route.middleware(arguments[i]));
	    }
	    // show <path> with [state]
	  } else if ('string' === typeof path) {
	    page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
	    // start [options]
	  } else {
	    page.start(path);
	  }
	}
	
	/**
	 * Callback functions.
	 */
	
	page.callbacks = [];
	page.exits = [];
	
	/**
	 * Current path being processed
	 * @type {string}
	 */
	page.current = '';
	
	/**
	 * Number of pages navigated to.
	 * @type {number}
	 *
	 *     page.len == 0;
	 *     page('/login');
	 *     page.len == 1;
	 */
	
	page.len = 0;
	
	/**
	 * Get or set basepath to `path`.
	 *
	 * @param {string} path
	 * @api public
	 */
	
	page.base = function (path) {
	  if (0 === arguments.length) return base;
	  base = path;
	};
	
	/**
	 * Bind with the given `options`.
	 *
	 * Options:
	 *
	 *    - `click` bind to click events [true]
	 *    - `popstate` bind to popstate [true]
	 *    - `dispatch` perform initial dispatch [true]
	 *
	 * @param {Object} options
	 * @api public
	 */
	
	page.start = function (options) {
	  options = options || {};
	  if (running) return;
	  running = true;
	  if (false === options.dispatch) dispatch = false;
	  if (false === options.decodeURLComponents) decodeURLComponents = false;
	  if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
	  if (false !== options.click) {
	    document.addEventListener(clickEvent, onclick, false);
	  }
	  if (true === options.hashbang) hashbang = true;
	  if (!dispatch) return;
	  var url = hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
	  page.replace(url, null, true, dispatch);
	};
	
	/**
	 * Unbind click and popstate event handlers.
	 *
	 * @api public
	 */
	
	page.stop = function () {
	  if (!running) return;
	  page.current = '';
	  page.len = 0;
	  running = false;
	  document.removeEventListener(clickEvent, onclick, false);
	  window.removeEventListener('popstate', onpopstate, false);
	};
	
	/**
	 * Show `path` with optional `state` object.
	 *
	 * @param {string} path
	 * @param {Object=} state
	 * @param {boolean=} dispatch
	 * @param {boolean=} push
	 * @return {!Context}
	 * @api public
	 */
	
	page.show = function (path, state, dispatch, push) {
	  var ctx = new Context(path, state);
	  page.current = ctx.path;
	  if (false !== dispatch) page.dispatch(ctx);
	  if (false !== ctx.handled && false !== push) ctx.pushState();
	  return ctx;
	};
	
	/**
	 * Goes back in the history
	 * Back should always let the current route push state and then go back.
	 *
	 * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
	 * @param {Object=} state
	 * @api public
	 */
	
	page.back = function (path, state) {
	  if (page.len > 0) {
	    // this may need more testing to see if all browsers
	    // wait for the next tick to go back in history
	    history.back();
	    page.len--;
	  } else if (path) {
	    setTimeout(function () {
	      page.show(path, state);
	    });
	  } else {
	    setTimeout(function () {
	      page.show(base, state);
	    });
	  }
	};
	
	/**
	 * Register route to redirect from one path to other
	 * or just redirect to another route
	 *
	 * @param {string} from - if param 'to' is undefined redirects to 'from'
	 * @param {string=} to
	 * @api public
	 */
	page.redirect = function (from, to) {
	  // Define route from a path to another
	  if ('string' === typeof from && 'string' === typeof to) {
	    page(from, function (e) {
	      setTimeout(function () {
	        page.replace( /** @type {!string} */to);
	      }, 0);
	    });
	  }
	
	  // Wait for the push state and replace it with another
	  if ('string' === typeof from && 'undefined' === typeof to) {
	    setTimeout(function () {
	      page.replace(from);
	    }, 0);
	  }
	};
	
	/**
	 * Replace `path` with optional `state` object.
	 *
	 * @param {string} path
	 * @param {Object=} state
	 * @param {boolean=} init
	 * @param {boolean=} dispatch
	 * @return {!Context}
	 * @api public
	 */
	
	page.replace = function (path, state, init, dispatch) {
	  var ctx = new Context(path, state);
	  page.current = ctx.path;
	  ctx.init = init;
	  ctx.save(); // save before dispatching, which may redirect
	  if (false !== dispatch) page.dispatch(ctx);
	  return ctx;
	};
	
	/**
	 * Dispatch the given `ctx`.
	 *
	 * @param {Context} ctx
	 * @api private
	 */
	page.dispatch = function (ctx) {
	  var prev = prevContext,
	      i = 0,
	      j = 0;
	
	  prevContext = ctx;
	
	  function nextExit() {
	    var fn = page.exits[j++];
	    if (!fn) return nextEnter();
	    fn(prev, nextExit);
	  }
	
	  function nextEnter() {
	    var fn = page.callbacks[i++];
	
	    if (ctx.path !== page.current) {
	      ctx.handled = false;
	      return;
	    }
	    if (!fn) return unhandled(ctx);
	    fn(ctx, nextEnter);
	  }
	
	  if (prev) {
	    nextExit();
	  } else {
	    nextEnter();
	  }
	};
	
	/**
	 * Unhandled `ctx`. When it's not the initial
	 * popstate then redirect. If you wish to handle
	 * 404s on your own use `page('*', callback)`.
	 *
	 * @param {Context} ctx
	 * @api private
	 */
	function unhandled(ctx) {
	  if (ctx.handled) return;
	  var current;
	
	  if (hashbang) {
	    current = base + location.hash.replace('#!', '');
	  } else {
	    current = location.pathname + location.search;
	  }
	
	  if (current === ctx.canonicalPath) return;
	  page.stop();
	  ctx.handled = false;
	  location.href = ctx.canonicalPath;
	}
	
	/**
	 * Register an exit route on `path` with
	 * callback `fn()`, which will be called
	 * on the previous context when a new
	 * page is visited.
	 */
	page.exit = function (path, fn) {
	  if (typeof path === 'function') {
	    return page.exit('*', path);
	  }
	
	  var route = new Route(path);
	  for (var i = 1; i < arguments.length; ++i) {
	    page.exits.push(route.middleware(arguments[i]));
	  }
	};
	
	/**
	 * Remove URL encoding from the given `str`.
	 * Accommodates whitespace in both x-www-form-urlencoded
	 * and regular percent-encoded form.
	 *
	 * @param {string} val - URL component to decode
	 */
	function decodeURLEncodedURIComponent(val) {
	  if (typeof val !== 'string') {
	    return val;
	  }
	  return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
	}
	
	/**
	 * Initialize a new "request" `Context`
	 * with the given `path` and optional initial `state`.
	 *
	 * @constructor
	 * @param {string} path
	 * @param {Object=} state
	 * @api public
	 */
	
	function Context(path, state) {
	  if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
	  var i = path.indexOf('?');
	
	  this.canonicalPath = path;
	  this.path = path.replace(base, '') || '/';
	  if (hashbang) this.path = this.path.replace('#!', '') || '/';
	
	  this.title = document.title;
	  this.state = state || {};
	  this.state.path = path;
	  this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
	  this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
	  this.params = {};
	
	  // fragment
	  this.hash = '';
	  if (!hashbang) {
	    if (!~this.path.indexOf('#')) return;
	    var parts = this.path.split('#');
	    this.path = parts[0];
	    this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
	    this.querystring = this.querystring.split('#')[0];
	  }
	}
	
	/**
	 * Expose `Context`.
	 */
	
	page.Context = Context;
	
	/**
	 * Push state.
	 *
	 * @api private
	 */
	
	Context.prototype.pushState = function () {
	  page.len++;
	  history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
	};
	
	/**
	 * Save the context state.
	 *
	 * @api public
	 */
	
	Context.prototype.save = function () {
	  history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
	};
	
	/**
	 * Initialize `Route` with the given HTTP `path`,
	 * and an array of `callbacks` and `options`.
	 *
	 * Options:
	 *
	 *   - `sensitive`    enable case-sensitive routes
	 *   - `strict`       enable strict matching for trailing slashes
	 *
	 * @constructor
	 * @param {string} path
	 * @param {Object=} options
	 * @api private
	 */
	
	function Route(path, options) {
	  options = options || {};
	  this.path = path === '*' ? '(.*)' : path;
	  this.method = 'GET';
	  this.regexp = pathtoRegexp(this.path, this.keys = [], options);
	}
	
	/**
	 * Expose `Route`.
	 */
	
	page.Route = Route;
	
	/**
	 * Return route middleware with
	 * the given callback `fn()`.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 * @api public
	 */
	
	Route.prototype.middleware = function (fn) {
	  var self = this;
	  return function (ctx, next) {
	    if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
	    next();
	  };
	};
	
	/**
	 * Check if this route matches `path`, if so
	 * populate `params`.
	 *
	 * @param {string} path
	 * @param {Object} params
	 * @return {boolean}
	 * @api private
	 */
	
	Route.prototype.match = function (path, params) {
	  var keys = this.keys,
	      qsIndex = path.indexOf('?'),
	      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
	      m = this.regexp.exec(decodeURIComponent(pathname));
	
	  if (!m) return false;
	
	  for (var i = 1, len = m.length; i < len; ++i) {
	    var key = keys[i - 1];
	    var val = decodeURLEncodedURIComponent(m[i]);
	    if (val !== undefined || !hasOwnProperty.call(params, key.name)) {
	      params[key.name] = val;
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Handle "populate" events.
	 */
	
	var onpopstate = function () {
	  var loaded = false;
	  if ('undefined' === typeof window) {
	    return;
	  }
	  if (document.readyState === 'complete') {
	    loaded = true;
	  } else {
	    window.addEventListener('load', function () {
	      setTimeout(function () {
	        loaded = true;
	      }, 0);
	    });
	  }
	  return function onpopstate(e) {
	    if (!loaded) return;
	    if (e.state) {
	      var path = e.state.path;
	      page.replace(path, e.state);
	    } else {
	      page.show(location.pathname + location.hash, undefined, undefined, false);
	    }
	  };
	}();
	/**
	 * Handle "click" events.
	 */
	
	function onclick(e) {
	
	  if (1 !== which(e)) return;
	
	  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
	  if (e.defaultPrevented) return;
	
	  // ensure link
	  // use shadow dom when available
	  var el = e.path ? e.path[0] : e.target;
	  while (el && 'A' !== el.nodeName) {
	    el = el.parentNode;
	  }if (!el || 'A' !== el.nodeName) return;
	
	  // Ignore if tag has
	  // 1. "download" attribute
	  // 2. rel="external" attribute
	  if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;
	
	  // ensure non-hash for the same path
	  var link = el.getAttribute('href');
	  if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;
	
	  // Check for mailto: in the href
	  if (link && link.indexOf('mailto:') > -1) return;
	
	  // check target
	  if (el.target) return;
	
	  // x-origin
	  if (!sameOrigin(el.href)) return;
	
	  // rebuild path
	  var path = el.pathname + el.search + (el.hash || '');
	
	  // strip leading "/[drive letter]:" on NW.js on Windows
	  if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
	    path = path.replace(/^\/[a-zA-Z]:\//, '/');
	  }
	
	  // same page
	  var orig = path;
	
	  if (path.indexOf(base) === 0) {
	    path = path.substr(base.length);
	  }
	
	  if (hashbang) path = path.replace('#!', '');
	
	  if (base && orig === path) return;
	
	  e.preventDefault();
	  page.show(orig);
	}
	
	/**
	 * Event button.
	 */
	
	function which(e) {
	  e = e || window.event;
	  return null === e.which ? e.button : e.which;
	}
	
	/**
	 * Check if `href` is the same origin.
	 */
	
	function sameOrigin(href) {
	  var origin = location.protocol + '//' + location.hostname;
	  if (location.port) origin += ':' + location.port;
	  return href && 0 === href.indexOf(origin);
	}
	
	page.sameOrigin = sameOrigin;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function cachedSetTimeout() {
	            throw new Error('setTimeout is not defined');
	        };
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function cachedClearTimeout() {
	            throw new Error('clearTimeout is not defined');
	        };
	    }
	})();
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var isarray = __webpack_require__(16);
	
	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp;
	module.exports.parse = parse;
	module.exports.compile = compile;
	module.exports.tokensToFunction = tokensToFunction;
	module.exports.tokensToRegExp = tokensToRegExp;
	
	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	// Match escaped characters that would otherwise appear in future matches.
	// This allows the user to escape special characters that won't transform.
	'(\\\\.)',
	// Match Express-style parameters and un-named parameters with a prefix
	// and optional suffixes. Matches appear as:
	//
	// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');
	
	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {String} str
	 * @return {Array}
	 */
	function parse(str) {
	  var tokens = [];
	  var key = 0;
	  var index = 0;
	  var path = '';
	  var res;
	
	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0];
	    var escaped = res[1];
	    var offset = res.index;
	    path += str.slice(index, offset);
	    index = offset + m.length;
	
	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1];
	      continue;
	    }
	
	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path);
	      path = '';
	    }
	
	    var prefix = res[2];
	    var name = res[3];
	    var capture = res[4];
	    var group = res[5];
	    var suffix = res[6];
	    var asterisk = res[7];
	
	    var repeat = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';
	    var delimiter = prefix || '/';
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');
	
	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      pattern: escapeGroup(pattern)
	    });
	  }
	
	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index);
	  }
	
	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path);
	  }
	
	  return tokens;
	}
	
	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {String}   str
	 * @return {Function}
	 */
	function compile(str) {
	  return tokensToFunction(parse(str));
	}
	
	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction(tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length);
	
	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (_typeof(tokens[i]) === 'object') {
	      matches[i] = new RegExp('^' + tokens[i].pattern + '$');
	    }
	  }
	
	  return function (obj) {
	    var path = '';
	    var data = obj || {};
	
	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i];
	
	      if (typeof token === 'string') {
	        path += token;
	
	        continue;
	      }
	
	      var value = data[token.name];
	      var segment;
	
	      if (value == null) {
	        if (token.optional) {
	          continue;
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined');
	        }
	      }
	
	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
	        }
	
	        if (value.length === 0) {
	          if (token.optional) {
	            continue;
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty');
	          }
	        }
	
	        for (var j = 0; j < value.length; j++) {
	          segment = encodeURIComponent(value[j]);
	
	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
	          }
	
	          path += (j === 0 ? token.prefix : token.delimiter) + segment;
	        }
	
	        continue;
	      }
	
	      segment = encodeURIComponent(value);
	
	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
	      }
	
	      path += token.prefix + segment;
	    }
	
	    return path;
	  };
	}
	
	/**
	 * Escape a regular expression string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	function escapeString(str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
	}
	
	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup(group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}
	
	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys(re, keys) {
	  re.keys = keys;
	  return re;
	}
	
	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags(options) {
	  return options.sensitive ? '' : 'i';
	}
	
	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp(path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g);
	
	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        pattern: null
	      });
	    }
	  }
	
	  return attachKeys(path, keys);
	}
	
	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp(path, keys, options) {
	  var parts = [];
	
	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }
	
	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
	
	  return attachKeys(regexp, keys);
	}
	
	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function stringToRegexp(path, keys, options) {
	  var tokens = parse(path);
	  var re = tokensToRegExp(tokens, options);
	
	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i]);
	    }
	  }
	
	  return attachKeys(re, keys);
	}
	
	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {Array}  tokens
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function tokensToRegExp(tokens, options) {
	  options = options || {};
	
	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = '';
	  var lastToken = tokens[tokens.length - 1];
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);
	
	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];
	
	    if (typeof token === 'string') {
	      route += escapeString(token);
	    } else {
	      var prefix = escapeString(token.prefix);
	      var capture = token.pattern;
	
	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*';
	      }
	
	      if (token.optional) {
	        if (prefix) {
	          capture = '(?:' + prefix + '(' + capture + '))?';
	        } else {
	          capture = '(' + capture + ')?';
	        }
	      } else {
	        capture = prefix + '(' + capture + ')';
	      }
	
	      route += capture;
	    }
	  }
	
	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
	  }
	
	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }
	
	  return new RegExp('^' + route, flags(options));
	}
	
	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp(path, keys, options) {
	  keys = keys || [];
	
	  if (!isarray(keys)) {
	    options = keys;
	    keys = [];
	  } else if (!options) {
	    options = {};
	  }
	
	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options);
	  }
	
	  if (isarray(path)) {
	    return arrayToRegexp(path, keys, options);
	  }
	
	  return stringToRegexp(path, keys, options);
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsxWrapper = function _jsxWrapper(func, args) {
	  var wrapper = args ? function wrapper() {
	    return func.apply(this, args);
	  } : func;
	  wrapper.__jsxDOMWrapper = true;
	  return wrapper;
	};
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var skate = _interopRequireWildcard(_skatejs);
	
	var _index = __webpack_require__(18);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _tabs = __webpack_require__(20);
	
	var _tabs2 = _interopRequireDefault(_tabs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var define = skate.define;
	var vdom = skate.vdom;
	
	
	function format(code) {
	  var lines = code.split('\n');
	  var ident = lines[1].match(/^\s*/)[0].length;
	  return lines.map(function (line) {
	    return line.substring(ident);
	  }).join('\n').trim();
	}
	
	var CodeExample = function CodeExample(props, chren) {
	  vdom.elementOpen('div', null, null, 'class', _index2.default.locals.code);
	
	  _renderArbitrary(props.title ? (vdom.elementOpen('h3', null, null, 'class', _index2.default.locals.title), _renderArbitrary(props.title), vdom.elementClose('h3')) : '');
	
	  vdom.elementOpen(_tabs2.default);
	  vdom.elementOpen(_tabs.Tab, null, null, 'name', 'Result', 'selected', true);
	  vdom.elementOpen('p');
	
	  _renderArbitrary(chren());
	
	  vdom.elementClose('p');
	  vdom.elementClose(_tabs.Tab);
	  vdom.elementOpen(_tabs.Tab, null, null, 'name', 'JS');
	  vdom.elementOpen('pre');
	  vdom.elementOpen('code');
	
	  _renderArbitrary(format(props.js));
	
	  vdom.elementClose('code');
	  vdom.elementClose('pre');
	  vdom.elementClose(_tabs.Tab);
	  vdom.elementOpen(_tabs.Tab, null, null, 'name', 'HTML');
	  vdom.elementOpen('pre');
	  vdom.elementOpen('code');
	
	  _renderArbitrary(format(props.html));
	
	  vdom.elementClose('code');
	  vdom.elementClose('pre');
	  vdom.elementClose(_tabs.Tab);
	  vdom.elementClose(_tabs2.default);
	  return vdom.elementClose('div');
	};
	
	var FeaturePane = function FeaturePane(props, chren) {
	  vdom.elementOpen('div', null, null, 'class', _index2.default.locals.featurePane);
	  vdom.elementOpen('h3');
	
	  _renderArbitrary(props.title);
	
	  vdom.elementClose('h3');
	  vdom.elementOpen('p');
	
	  _renderArbitrary(chren());
	
	  vdom.elementClose('p');
	  return vdom.elementClose('div');
	};
	
	// Hello World
	
	skate.define('x-hello', {
	  render: function render() {
	    vdom.elementOpen('span');
	    vdom.text('Hello, ');
	    vdom.elementVoid('slot');
	    vdom.text('!');
	    return vdom.elementClose('span');
	  }
	});
	
	// Simple Counter
	
	skate.define('x-counter', {
	  props: {
	    count: skate.prop.number()
	  },
	  attached: function attached(elem) {
	    elem.__ival = setInterval(function () {
	      return ++elem.count;
	    }, 1000);
	  },
	  detached: function detached(elem) {
	    clearInterval(elem.__ival);
	  },
	  render: function render(elem) {
	    vdom.elementOpen('span');
	    vdom.text('Count: ');
	
	    _renderArbitrary(elem.count);
	
	    return vdom.elementClose('span');
	  }
	});
	
	// Todo List
	
	// Dumb component that just emits events when something happens.
	
	function remove(elem, indx) {
	  return function () {
	    skate.emit(elem, 'x-todo-remove', { detail: {
	        todo: elem,
	        item: elem.children[indx]
	      } });
	  };
	}
	
	function submit(elem) {
	  return function (e) {
	    skate.emit(elem, 'x-todo-add', { detail: {
	        todo: elem,
	        item: elem.value
	      } });
	    e.preventDefault();
	  };
	}
	
	skate.define('x-todo', {
	  props: {
	    items: skate.prop.array(),
	    title: skate.prop.string({ attribute: true }),
	    value: skate.prop.string({ attribute: true })
	  },
	  attached: function attached(elem) {
	    elem.mo = new MutationObserver(function () {
	      return elem.items = [].concat(_toConsumableArray(elem.children));
	    });
	    elem.mo.observe(elem, { childList: true });
	  },
	  detached: function detached(elem) {
	    elem.mo.disconnect();
	  },
	  render: function render(elem) {
	    var numItems = elem.items.length;
	    vdom.elementOpen('div');
	    vdom.elementOpen('h3');
	
	    _renderArbitrary(elem.title);
	
	    _renderArbitrary(numItems ? ' (' + numItems + ')' : '');
	
	    vdom.elementClose('h3');
	    vdom.elementOpen('form', null, null, 'on-submit', submit(elem));
	    vdom.elementVoid('input', null, null, 'on-keyup', skate.link(elem), 'value', elem.value, 'type', 'text');
	    vdom.elementOpen('button', null, null, 'type', 'submit');
	    vdom.text('Add ');
	
	    _renderArbitrary(elem.value);
	
	    vdom.elementClose('button');
	    vdom.elementClose('form');
	
	    _renderArbitrary(numItems ? (vdom.elementOpen('ol'), _renderArbitrary(elem.items.map(function (item, indx) {
	      return _jsxWrapper(function (_item$textContent, _remove) {
	        vdom.elementOpen('li');
	
	        _renderArbitrary(_item$textContent);
	
	        vdom.elementOpen('button', null, null, 'on-click', _remove);
	        vdom.text('x');
	        vdom.elementClose('button');
	        return vdom.elementClose('li');
	      }, [item.textContent, remove(elem, indx)]);
	    })), vdom.elementClose('ol')) : (vdom.elementOpen('p'), vdom.text('There is nothing to do.'), vdom.elementClose('p')));
	
	    return vdom.elementClose('div');
	  }
	});
	
	// Smart component so <x-todo> doesn't mutate itself.
	
	function addTodo(e) {
	  var _e$detail = e.detail;
	  var item = _e$detail.item;
	  var todo = _e$detail.todo;
	
	  var xitem = document.createElement('x-item');
	  xitem.textContent = item;
	  todo.appendChild(xitem);
	  todo.value = '';
	}
	
	function removeTodo(e) {
	  var _e$detail2 = e.detail;
	  var item = _e$detail2.item;
	  var todo = _e$detail2.todo;
	
	  todo.removeChild(item);
	}
	
	skate.define('x-todo-smart', {
	  created: function created(elem) {
	    elem.addEventListener('x-todo-add', addTodo);
	    elem.addEventListener('x-todo-remove', removeTodo);
	  }
	});
	
	exports.default = define('sk-page-index', {
	  render: function render() {
	    vdom.elementOpen('div');
	    vdom.elementOpen('style');
	
	    _renderArbitrary(_index2.default.toString());
	
	    vdom.elementClose('style');
	    vdom.elementOpen('div', null, null, 'class', _index2.default.locals.hero);
	    vdom.elementOpen('h1');
	    vdom.text('SkateJS');
	    vdom.elementClose('h1');
	    vdom.elementOpen('p');
	    vdom.text('Skate is a functional, featherweight and cross-framework compatible web component library built on W3C specs.');
	    vdom.elementClose('p');
	    vdom.elementClose('div');
	    vdom.elementOpen('div', null, null, 'class', _index2.default.locals.featurePanes);
	    vdom.elementOpen(FeaturePane, null, null, 'title', 'Forward-thinking');
	    vdom.text(' Skate leverages the web platform and is built on top of the ');
	    vdom.elementOpen('a', null, null, 'href', 'https://github.com/w3c/webcomponents');
	    vdom.text('W3C Web Component specs');
	    vdom.elementClose('a');
	    vdom.text('. From this it gets native performance, longevity and cross-framework compatibility. ');
	    vdom.elementClose(FeaturePane);
	    vdom.elementOpen(FeaturePane, null, null, 'title', 'Functional');
	    vdom.elementOpen('a', null, null, 'href', 'https://github.com/google/incremental-dom');
	    vdom.text('Incremental DOM');
	    vdom.elementClose('a');
	    vdom.text(' backs Skate\'s functional rendering pipeline, offering performance, memory-efficiency and simplicity. ');
	    vdom.elementClose(FeaturePane);
	    vdom.elementOpen(FeaturePane, null, null, 'title', 'Featherweight');
	    vdom.text(' Weighing in at only 5k min+gz, it gives you a solid foundation for building complex UI components without downloading the entire internet. ');
	    vdom.elementClose(FeaturePane);
	    vdom.elementClose('div');
	    vdom.elementOpen('div', null, null, 'class', _index2.default.locals.grid + ' ' + _index2.default.locals.grid2);
	    vdom.elementOpen(CodeExample, null, null, 'title', 'Hello World', 'description', 'A simple hello world example.', 'html', '\n              <x-hello>Bob</x-hello>\n            ', 'js', '\n              skate.define(\'x-hello\', {\n                render() {\n                  return <span>Hello, <slot />!</span>;\n                },\n              });\n            ');
	    vdom.elementOpen('x-hello');
	    vdom.text('Bob');
	    vdom.elementClose('x-hello');
	    vdom.elementClose(CodeExample);
	    vdom.elementOpen(CodeExample, null, null, 'title', 'Simple Counter', 'description', 'A simple counter that shows how to use Shadow DOM name slots and re-rendering.', 'html', '\n              <x-counter count="1"></x-counter>\n            ', 'js', '\n              skate.define(\'x-counter\', {\n                props: {\n                  count: skate.prop.number(),\n                },\n                attached(elem) {\n                  elem.__ival = setInterval(() => ++elem.count, 1000);\n                },\n                detached(elem) {\n                  clearInterval(elem.__ival);\n                },\n                render(elem) {\n                  return <span>Count: {elem.count}</span>;\n                },\n              });\n            ');
	    vdom.elementOpen('x-counter', null, null, 'count', '1');
	    vdom.elementClose('x-counter');
	    vdom.elementClose(CodeExample);
	    vdom.elementOpen(CodeExample, null, null, 'title', 'Todo List', 'html', '\n              <x-todo-smart>\n                <x-todo title="Things I need to do">\n                  <x-item>Get milk</x-item>\n                  <x-item>Feed cats</x-item>\n                </x-todo>\n              </x-todo-smart>\n            ', 'js', '\n              // Dumb component that just emits events when something happens.\n\n              function remove(elem, indx) {\n                return () => {\n                  skate.emit(elem, \'x-todo-remove\', { detail: {\n                    todo: elem,\n                    item: elem.children[indx],\n                  } });\n                };\n              }\n\n              function submit(elem) {\n                return e => {\n                  skate.emit(elem, \'x-todo-add\', { detail: {\n                    todo: elem,\n                    item: elem.value,\n                  } });\n                  e.preventDefault();\n                };\n              }\n\n              skate.define(\'x-todo\', {\n                props: {\n                  items: skate.prop.array(),\n                  title: skate.prop.string({ attribute: true }),\n                  value: skate.prop.string({ attribute: true }),\n                },\n                attached(elem) {\n                  elem.mo = new MutationObserver(() => (elem.items = [...elem.children]));\n                  elem.mo.observe(elem, { childList: true });\n                },\n                detached(elem) {\n                  elem.mo.disconnect();\n                },\n                render(elem) {\n                  const numItems = elem.items.length;\n                  return (\n                    <div>\n                      <h3>{elem.title}{numItems ? ` (${numItems})` : \'\'}</h3>\n                      <form on-submit={submit(elem)}>\n                        <input on-keyup={skate.link(elem)} type="text" value={elem.value} />\n                        <button type="submit">Add {elem.value}</button>\n                      </form>\n                      {numItems ? (\n                        <ol>\n                          {elem.items.map((item, indx) => (\n                            <li>\n                              {item.textContent}\n                              <button on-click={remove(elem, indx)}>x</button>\n                            </li>\n                          ))}\n                        </ol>\n                      ) : (\n                        <p>There is nothing to do.</p>\n                      )}\n                    </div>\n                  );\n                },\n              });\n\n\n              // Smart component so <x-todo> doesn\'t mutate itself.\n\n              function addTodo(e) {\n                const { item, todo } = e.detail;\n                const xitem = document.createElement(\'x-item\');\n                xitem.textContent = item;\n                todo.appendChild(xitem);\n                todo.value = \'\';\n              }\n\n              function removeTodo(e) {\n                const { item, todo } = e.detail;\n                todo.removeChild(item);\n              }\n\n              skate.define(\'x-todo-smart\', {\n                created(elem) {\n                  elem.addEventListener(\'x-todo-add\', addTodo);\n                  elem.addEventListener(\'x-todo-remove\', removeTodo);\n                },\n              });\n            ');
	    vdom.elementOpen('x-todo-smart');
	    vdom.elementOpen('x-todo', null, null, 'title', 'Things I need to do');
	    vdom.elementOpen('x-item');
	    vdom.text('Get milk');
	    vdom.elementClose('x-item');
	    vdom.elementOpen('x-item');
	    vdom.text('Feed cats');
	    vdom.elementClose('x-item');
	    vdom.elementClose('x-todo');
	    vdom.elementClose('x-todo-smart');
	    vdom.elementClose(CodeExample);
	    vdom.elementClose('div');
	    return vdom.elementClose('div');
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, "._2o8n2ytNJ2UOwNLCVyzNYy{background-color:#f1ede4}._2o8n2ytNJ2UOwNLCVyzNYy ._2mr8X-mQ-giOJSHzOxhpg7{background-color:#dad6ce;font-size:24px;font-weight:200;margin:0;padding:20px}._2o8n2ytNJ2UOwNLCVyzNYy ._2bgY6v_faJIOWaSxG0ZQ17{background-color:#dad6ce;font-size:14px;font-weight:100;margin:0;padding:20px}.iYB-ylcS-0bRr059nTAvY{background-color:#111;color:#eee;flex-basis:0;flex-grow:1;font-size:14px;margin:10px}.iYB-ylcS-0bRr059nTAvY a{color:#fff}.iYB-ylcS-0bRr059nTAvY h3{background-color:#222;font-weight:200}.iYB-ylcS-0bRr059nTAvY p{font-weight:100}.iYB-ylcS-0bRr059nTAvY h3,.iYB-ylcS-0bRr059nTAvY p{margin:0;padding:20px}._2eA-gGgtu95U0T2LIjbefD{background-color:#333;overflow:auto;padding:10px}._2eA-gGgtu95U0T2LIjbefD,._3D_dMEHrZnxFd8qnEFinfp{display:flex;flex-wrap:wrap}._3D_dMEHrZnxFd8qnEFinfp>*{flex:1 0 0;box-sizing:border-box;min-width:100%}@media (min-width:500px){._3IO_h7OgF7qT3tVrtEBvGh>*{min-width:50%}}@media (min-width:750px){._1xp5oHR2jCWbCKOEmGVTBz>*{min-width:33.33%}}@media (min-width:1000px){._3lTlDqKv0pwHrtQOqWB4kr>*{min-width:25%}}@media (min-width:1250px){.GvcmiLQPFcHqLjWtZbCOe>*{min-width:20%}}@media (min-width:1500px){._1RWEsALJT9qMFZdnZnZDdt>*{min-width:16.66%}._2nWdTB7MlNAJgSglZ9R34->*{min-width:14.28%}._1MeqOMty_QAoNuiNm9teCy>*{min-width:12.5%}.rr8oEvwtBEBkJ7EvY8ZYq>*{min-width:11.11%}._7VGTUeyUzCWRVv1cDP6ql>*{min-width:10%}}._34LLXGQWwpFC-AGNgRE-Zi{background-color:#f4547b;color:#fff;padding:40px}._34LLXGQWwpFC-AGNgRE-Zi h1{font-size:48px;font-weight:200;margin-top:0}._34LLXGQWwpFC-AGNgRE-Zi p{font-size:24px;font-weight:100;margin-bottom:0}", ""]);
	
	// exports
	exports.locals = {
		"code": "_2o8n2ytNJ2UOwNLCVyzNYy",
		"code": "_2o8n2ytNJ2UOwNLCVyzNYy",
		"title": "_2mr8X-mQ-giOJSHzOxhpg7",
		"title": "_2mr8X-mQ-giOJSHzOxhpg7",
		"description": "_2bgY6v_faJIOWaSxG0ZQ17",
		"description": "_2bgY6v_faJIOWaSxG0ZQ17",
		"feature-pane": "iYB-ylcS-0bRr059nTAvY",
		"featurePane": "iYB-ylcS-0bRr059nTAvY",
		"feature-panes": "_2eA-gGgtu95U0T2LIjbefD",
		"featurePanes": "_2eA-gGgtu95U0T2LIjbefD",
		"grid": "_3D_dMEHrZnxFd8qnEFinfp",
		"grid": "_3D_dMEHrZnxFd8qnEFinfp",
		"grid-2": "_3IO_h7OgF7qT3tVrtEBvGh",
		"grid2": "_3IO_h7OgF7qT3tVrtEBvGh",
		"grid-3": "_1xp5oHR2jCWbCKOEmGVTBz",
		"grid3": "_1xp5oHR2jCWbCKOEmGVTBz",
		"grid-4": "_3lTlDqKv0pwHrtQOqWB4kr",
		"grid4": "_3lTlDqKv0pwHrtQOqWB4kr",
		"grid-5": "GvcmiLQPFcHqLjWtZbCOe",
		"grid5": "GvcmiLQPFcHqLjWtZbCOe",
		"grid-6": "_1RWEsALJT9qMFZdnZnZDdt",
		"grid6": "_1RWEsALJT9qMFZdnZnZDdt",
		"grid-7": "_2nWdTB7MlNAJgSglZ9R34-",
		"grid7": "_2nWdTB7MlNAJgSglZ9R34-",
		"grid-8": "_1MeqOMty_QAoNuiNm9teCy",
		"grid8": "_1MeqOMty_QAoNuiNm9teCy",
		"grid-9": "rr8oEvwtBEBkJ7EvY8ZYq",
		"grid9": "rr8oEvwtBEBkJ7EvY8ZYq",
		"grid-10": "_7VGTUeyUzCWRVv1cDP6ql",
		"grid10": "_7VGTUeyUzCWRVv1cDP6ql",
		"hero": "_34LLXGQWwpFC-AGNgRE-Zi",
		"hero": "_34LLXGQWwpFC-AGNgRE-Zi"
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Tab = undefined;
	
	var _jsxWrapper = function _jsxWrapper(func, args) {
	  var wrapper = args ? function wrapper() {
	    return func.apply(this, args);
	  } : func;
	  wrapper.__jsxDOMWrapper = true;
	  return wrapper;
	};
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _classnames = __webpack_require__(21);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _index = __webpack_require__(23);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _tab = __webpack_require__(24);
	
	var _tab2 = _interopRequireDefault(_tab);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function onTabsChanged(elem) {
	  return function () {
	    return elem.tabs = [].concat(_toConsumableArray(elem.children));
	  };
	}
	
	function selectTab(tabs, tab) {
	  return function (e) {
	    tabs.forEach(function (cur) {
	      return cur.selected = cur === tab;
	    });
	    e.preventDefault();
	  };
	}
	
	exports.default = (0, _skatejs.define)('sk-tabs', {
	  props: {
	    tabs: _skatejs.prop.array()
	  },
	  updated: function updated(elem, prev) {
	    if (_skatejs.Component.updated(elem, prev)) {
	      return (0, _skatejs.emit)(elem, 'tab-changed', { detail: elem.selected });
	    }
	  },
	  render: function render(elem) {
	    _skatejs.vdom.elementOpen('div');
	
	    _skatejs.vdom.elementOpen('style');
	
	    _renderArbitrary(_index2.default.toString());
	
	    _skatejs.vdom.elementClose('style');
	
	    _skatejs.vdom.elementOpen('div', null, null, 'class', _index2.default.locals.tabs);
	
	    _renderArbitrary(elem.tabs.map(function (tab) {
	      var _cx;
	
	      return _jsxWrapper(function (_cx2, _ref, _selectTab, _tab$name) {
	        _skatejs.vdom.elementOpen('div', null, null, 'class', _cx2);
	
	        _skatejs.vdom.elementOpen('a', null, null, 'href', _ref, 'on-click', _selectTab);
	
	        _renderArbitrary(_tab$name);
	
	        _skatejs.vdom.elementClose('a');
	
	        return _skatejs.vdom.elementClose('div');
	      }, [(0, _classnames2.default)((_cx = {}, _defineProperty(_cx, _index2.default.locals.tab, true), _defineProperty(_cx, _index2.default.locals.selected, tab.selected), _cx)), '#' + tab.name, selectTab(elem.tabs, tab), tab.name]);
	    }));
	
	    _skatejs.vdom.elementClose('div');
	
	    _skatejs.vdom.elementVoid('slot', null, null, 'on-slotchange', onTabsChanged(elem));
	
	    return _skatejs.vdom.elementClose('div');
	  }
	});
	exports.Tab = _tab2.default;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var hasOwn = {}.hasOwnProperty;
	
		function classNames() {
			var classes = [];
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
	
				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}
	
			return classes.join(' ');
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if ("function" === 'function' && _typeof(__webpack_require__(22)) === 'object' && __webpack_require__(22)) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	})();

/***/ },
/* 22 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, ":host{display:block}._2Lx4fB9RrtyJZEybizTry_{background-color:#dad6ce}._3jX3hCKqKj9o6D_5Kx_JBv{display:inline-block}._3jX3hCKqKj9o6D_5Kx_JBv a{color:#333;display:inline-block;font-size:18px;font-weight:200;padding:20px;text-decoration:none}._3jX3hCKqKj9o6D_5Kx_JBv._1UoOCaJGOGhObV5161qk5M{background-color:#f1ede4}", ""]);
	
	// exports
	exports.locals = {
		"tabs": "_2Lx4fB9RrtyJZEybizTry_",
		"tabs": "_2Lx4fB9RrtyJZEybizTry_",
		"tab": "_3jX3hCKqKj9o6D_5Kx_JBv",
		"tab": "_3jX3hCKqKj9o6D_5Kx_JBv",
		"selected": "_1UoOCaJGOGhObV5161qk5M",
		"selected": "_1UoOCaJGOGhObV5161qk5M"
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _classnames = __webpack_require__(21);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _tab = __webpack_require__(25);
	
	var _tab2 = _interopRequireDefault(_tab);
	
	var _debounce = __webpack_require__(3);
	
	var _debounce2 = _interopRequireDefault(_debounce);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function emitSlotChange(elem) {
	  if (!elem.__debouncedSlotChangeEvent) {
	    elem.__debouncedSlotChangeEvent = (0, _debounce2.default)(_skatejs.emit.bind(null, elem, 'slotchange'), 0);
	  }
	  return elem.__debouncedSlotChangeEvent();
	}
	
	exports.default = (0, _skatejs.define)('sk-tabs-tab', {
	  props: {
	    name: _skatejs.prop.string(),
	    selected: _skatejs.prop.boolean()
	  },
	  attached: function attached(elem) {
	    emitSlotChange(elem);
	  },
	  detached: function detached(elem) {
	    emitSlotChange(elem);
	  },
	  updated: function updated(elem, prev) {
	    emitSlotChange(elem);
	    return _skatejs.Component.updated(elem, prev);
	  },
	  render: function render(elem) {
	    var _cx;
	
	    _skatejs.vdom.elementOpen('div', null, null, 'class', (0, _classnames2.default)((_cx = {}, _defineProperty(_cx, _tab2.default.locals.pane, true), _defineProperty(_cx, _tab2.default.locals.selected, elem.selected), _cx)));
	
	    _skatejs.vdom.elementOpen('style');
	
	    _renderArbitrary(_tab2.default.toString());
	
	    _skatejs.vdom.elementClose('style');
	
	    _skatejs.vdom.elementVoid('slot');
	
	    return _skatejs.vdom.elementClose('div');
	  }
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, ":host{display:block}._3WkQLUyd_5sA_re7EzYvMx{background-color:#f1ede4;display:none;margin:0;overflow:auto;padding:20px}._3WkQLUyd_5sA_re7EzYvMx._2nRhrrYvmfuxu34UiGItXs{display:block}", ""]);
	
	// exports
	exports.locals = {
		"pane": "_3WkQLUyd_5sA_re7EzYvMx",
		"pane": "_3WkQLUyd_5sA_re7EzYvMx",
		"selected": "_2nRhrrYvmfuxu34UiGItXs",
		"selected": "_2nRhrrYvmfuxu34UiGItXs"
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _index = __webpack_require__(27);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (props, chren) {
	  _skatejs.vdom.elementOpen('div', null, null, 'class', _index2.default.locals.body);
	
	  _skatejs.vdom.elementOpen('style');
	
	  _renderArbitrary(_index2.default.toString());
	
	  _skatejs.vdom.elementClose('style');
	
	  _renderArbitrary(chren());
	
	  return _skatejs.vdom.elementClose('div');
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, ".JotV9DC7cFGUX61mmETT1{background-color:#fefefe;color:#333;font-size:16px;padding:60px 0 0}", ""]);
	
	// exports
	exports.locals = {
		"body": "JotV9DC7cFGUX61mmETT1",
		"body": "JotV9DC7cFGUX61mmETT1"
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _renderArbitrary = function _renderArbitrary(child) {
	  var type = typeof child;
	
	  if (type === 'number' || type === 'string' || type === 'object' && child instanceof String) {
	    _skatejs.vdom.text(child);
	  } else if (type === 'function' && child.__jsxDOMWrapper) {
	    child();
	  } else if (Array.isArray(child)) {
	    child.forEach(_renderArbitrary);
	  } else if (type === 'object' && String(child) === '[object Object]') {
	    _forOwn(child, _renderArbitrary);
	  }
	};
	
	var _attr = function _attr(value, name) {
	  _skatejs.vdom.attr(name, value);
	};
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	
	var _forOwn = function _forOwn(object, iterator) {
	  for (var prop in object) {
	    if (_hasOwn.call(object, prop)) iterator(object[prop], prop);
	  }
	};
	
	var _skatejs = __webpack_require__(7);
	
	var _helpers = __webpack_require__(12);
	
	var _index = __webpack_require__(29);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _logo = __webpack_require__(30);
	
	var _logo2 = _interopRequireDefault(_logo);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Item = function Item(props, chren) {
	  _skatejs.vdom.elementOpen('li', null, null, 'class', _index2.default.locals.item);
	
	  _renderArbitrary(props.external ? ((_skatejs.vdom.elementOpenStart('a'), _forOwn(props, _attr), _skatejs.vdom.attr('class', _index2.default.locals.link), _skatejs.vdom.elementOpenEnd('a')), _renderArbitrary(chren()), _skatejs.vdom.elementClose('a')) : ((_skatejs.vdom.elementOpenStart(_helpers.Link), _forOwn(props, _attr), _skatejs.vdom.attr('class', _index2.default.locals.link), _skatejs.vdom.elementOpenEnd(_helpers.Link)), _renderArbitrary(chren()), _skatejs.vdom.elementClose(_helpers.Link)));
	
	  return _skatejs.vdom.elementClose('li');
	};
	
	exports.default = function (props) {
	  _skatejs.vdom.elementOpen('div');
	
	  _skatejs.vdom.elementOpen('style');
	
	  _renderArbitrary(_index2.default.toString());
	
	  _skatejs.vdom.elementClose('style');
	
	  _skatejs.vdom.elementOpen('div', null, null, 'class', _index2.default.locals.header + ' ' + (props.scrolled ? _index2.default.locals.scrolled : ''));
	
	  _skatejs.vdom.elementOpen('h1', null, null, 'class', _index2.default.locals.title);
	
	  _skatejs.vdom.elementOpen(_helpers.Link, null, null, 'href', '/');
	
	  _skatejs.vdom.elementVoid('img', null, null, 'alt', props.title, 'src', _logo2.default, 'width', '30');
	
	  _skatejs.vdom.elementClose(_helpers.Link);
	
	  _skatejs.vdom.elementClose('h1');
	
	  _skatejs.vdom.elementOpen('ul', null, null, 'class', _index2.default.locals.list);
	
	  _skatejs.vdom.elementOpen(Item, null, null, 'href', '/docs');
	
	  _skatejs.vdom.text('Docs');
	
	  _skatejs.vdom.elementClose(Item);
	
	  _skatejs.vdom.elementOpen(Item, null, null, 'href', 'https://github.com/skatejs/skatejs', 'external', true);
	
	  _skatejs.vdom.text('Github');
	
	  _skatejs.vdom.elementClose(Item);
	
	  _skatejs.vdom.elementClose('ul');
	
	  _skatejs.vdom.elementClose('div');
	
	  return _skatejs.vdom.elementClose('div');
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, "._2Hd5KzDR5h1JLZaLAhkdnL{background-color:#fefefe;color:#333;position:fixed;transition:box-shadow .3s ease;width:100%}._1P6DOElNwq3GvvXJFHGg0J{box-shadow:0 0 15px 0 #333}._3EU-FaAppzWRdOf0yzUQbO{list-style:none}._3EU-FaAppzWRdOf0yzUQbO,._3h8r-c6pyf3k8OkYptB6eQ{display:inline-block;margin:0;padding:0}._1O98iTVLbgr87bKcZ1xtCv{display:inline-block;margin:0 20px 0 10px;padding:0;position:relative;left:14px;top:8px}._3gAAJyILxgLXLUDHVCLw1K{color:#333;display:inline-block;font-size:18px;margin:0;padding:20px;text-decoration:none;transition:background-color .3s ease}._3gAAJyILxgLXLUDHVCLw1K:hover{background-color:#eee}", ""]);
	
	// exports
	exports.locals = {
		"header": "_2Hd5KzDR5h1JLZaLAhkdnL",
		"header": "_2Hd5KzDR5h1JLZaLAhkdnL",
		"scrolled": "_1P6DOElNwq3GvvXJFHGg0J",
		"scrolled": "_1P6DOElNwq3GvvXJFHGg0J",
		"list": "_3EU-FaAppzWRdOf0yzUQbO",
		"list": "_3EU-FaAppzWRdOf0yzUQbO",
		"item": "_3h8r-c6pyf3k8OkYptB6eQ",
		"item": "_3h8r-c6pyf3k8OkYptB6eQ",
		"title": "_1O98iTVLbgr87bKcZ1xtCv",
		"title": "_1O98iTVLbgr87bKcZ1xtCv",
		"link": "_3gAAJyILxgLXLUDHVCLw1K",
		"link": "_3gAAJyILxgLXLUDHVCLw1K"
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "dist/cdcf8f64994df2f0ca865f88e17aaa59.png";

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Route = undefined;
	
	var _skatejs = __webpack_require__(7);
	
	var _page = __webpack_require__(13);
	
	var _page2 = _interopRequireDefault(_page);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function createRouteHandler(elem, detail) {
	  return function () {
	    (0, _skatejs.emit)(elem, 'RouteChange', { detail: detail });
	  };
	}
	
	function onRouteUpdate(elem) {
	  return function (e) {
	    var _e$target = e.target;
	    var component = _e$target.component;
	    var path = _e$target.path;
	
	    if (component && path) {
	      var curr = window.location.pathname;
	      (0, _page2.default)(path, createRouteHandler(elem, component));
	      if (curr === path) {
	        (0, _page2.default)(curr);
	      }
	    }
	  };
	}
	
	exports.default = (0, _skatejs.define)('sk-router', {
	  created: function created(elem) {
	    elem.addEventListener('RouteUpdate', onRouteUpdate(elem));
	  }
	});
	var Route = exports.Route = (0, _skatejs.define)('sk-router-route', {
	  props: {
	    component: {},
	    path: {}
	  },
	  updated: function updated(elem) {
	    var component = elem.component;
	    var path = elem.path;
	
	    if (component && path) {
	      (0, _skatejs.emit)(elem, 'RouteUpdate', {
	        detail: { component: component, path: path }
	      });
	    }
	  }
	});

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (title) {
	  document.title = title;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	
	
	// module
	exports.push([module.id, "html{font-family:Helvetica;font-size:14px}body{margin:0}a{color:#333}", ""]);
	
	// exports


/***/ }
/******/ ])
});
;
//# sourceMappingURL=index-with-deps.js.map