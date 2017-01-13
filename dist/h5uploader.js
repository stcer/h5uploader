/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _H5uploader = __webpack_require__(1);

	var _H5uploader2 = _interopRequireDefault(_H5uploader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(6);


	window.H5ImgUploader = _H5uploader2.default;
	exports.default = _H5uploader2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _ImgPicker = __webpack_require__(2);

	var _ImgPicker2 = _interopRequireDefault(_ImgPicker);

	var _ImgEditor = __webpack_require__(3);

	var _ImgEditor2 = _interopRequireDefault(_ImgEditor);

	var _Uploader = __webpack_require__(4);

	var _Uploader2 = _interopRequireDefault(_Uploader);

	var _Img = __webpack_require__(5);

	var _Img2 = _interopRequireDefault(_Img);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var F = function F(name, images, container, options) {
	    this.name = name;
	    this.images = images;
	    this.curtImg = null;
	    this.list = null;
	    this.container = container;

	    this.opts = $.extend({
	        mul: false,
	        setCoverField: true,
	        coverFieldName: 'image',

	        mime: 'image/*',
	        type: /image.(png|jpeg|gif|jpg)/,
	        maxSize: 1024 * 1024 * 4,

	        loading: 'http://ui.jc001.cn/images/loading.gif',
	        upload: '/upload/save',
	        fileName: 'media',
	        dataFormat: 'file',
	        transData: {},
	        onUpload: function onUpload(src) {},
	        onSend: function onSend(F) {}
	    }, options);

	    this.isSetCover = false;

	    this.imgPicker = new _ImgPicker2.default(container, {
	        mul: this.opts.mul,
	        mime: this.opts.mime
	    });

	    this.imgEditor = new _ImgEditor2.default({
	        maxWidth: this.opts.maxWidth,
	        quality: this.opts.quality,
	        dataFormat: this.opts.dataFormat
	    });
	};

	F.prototype = {
	    init: function init() {
	        this.container.addClass('h5_uploads');
	        this.container.append($('' + '<div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>' + '<div class="up_list"></div>' + ''));
	        this.list = $('.up_list', this.container);

	        var currentImage = false;
	        if (this.images) {
	            this.images.forEach(function (src) {
	                if (src.length == 0) {
	                    return;
	                }
	                var _img = currentImage = this.createImage(src);
	                _img.setValue(src);
	            });
	        }

	        var that = this;
	        $('.up_selector', this.container).click(function () {
	            var replace = that.list.find('.up_item').size() > 0 && that.opts.mul == false;
	            if (replace) {
	                return false;
	            }

	            that.imgPicker.select(function (file) {
	                var img = that.createImage(that.opts.loading);
	                that._render(file, img);
	            });
	        });
	    },

	    _isCanAdd: function _isCanAdd() {
	        return this.list.has('.up_item').size() == 0 || this.opts.mul == true;
	    },

	    _render: function _render(file, img) {
	        var that = this;
	        if (this.opts.maxWidth || this.opts.opacity) {
	            this.imgEditor.getResult(file, function (fileData, file) {
	                img.setUrl(that.opts.dataFormat == 'base64' ? fileData : URL.createObjectURL(fileData));
	                that._upload(fileData, file, img);
	            });
	        } else {
	            img.setUrl(URL.createObjectURL(file));
	            that._upload(file, file, img);
	        }
	    },

	    _upload: function _upload(data, file, img) {
	        var self = this;
	        var progress = img.progress;

	        data = this.opts.dataFormat == 'base64d' ? data.substr(data.indexOf(',') + 1) : data;

	        (0, _Uploader2.default)(this.opts.upload, data, {
	            fieldName: this.opts.fileName,
	            fileName: file.name,
	            format: self.opts.dataFormat,
	            transData: self.opts.transData,

	            onInit: function onInit() {
	                progress.show();
	                progress.val(0);
	            },

	            onProgress: function onProgress(loaded, total) {
	                progress.val(loaded / total * 100);
	            },

	            onSuccess: function onSuccess(xhr) {
	                var response = eval("(" + xhr.responseText + ")");
	                if (response.code == 200) {
	                    progress.val(100);
	                    progress.hide();
	                    img.setValue(response.data.url);
	                    self.opts.onUpload(response.data.url);
	                } else {
	                    alert('上传失败, ' + response.message);
	                    img.remove();
	                }
	            },

	            onError: function onError(xhr) {
	                alert('上传失败(' + xhr.status + ')');
	                img.remove();
	            },

	            onSend: function onSend(formData) {
	                self.opts.onSend(formData);
	            }
	        });
	    },

	    getFieldName: function getFieldName() {
	        if (this.opts.mul && this.opts.setCoverField && !this.isSetCover) {
	            this.isSetCover = true;
	            return this.opts.coverFieldName;
	        }
	        return this.opts.mul ? this.name + '[]' : this.name;
	    },

	    createImage: function createImage(src) {
	        var that = this;
	        var name = this.getFieldName();
	        var img = new _Img2.default(name, src, this.list);

	        img.image.click(function () {
	            that.imgPicker.select(function (file) {
	                that._render(file, img);
	            });
	        });

	        img.deleteImg.click(function () {
	            img.remove();
	            if (that.isSetCover && $('input[name=' + that.opts.coverFieldName + ']', that.list).size() == 0) {
	                var item = $('>:first-child', that.list);
	                $('input[type=hidden]', item).attr('name', that.opts.coverFieldName);
	            }
	            event.stopPropagation();
	        });
	        return img;
	    }
	};

	exports.default = F;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ImgPicker = function ImgPicker(container, options) {
	    this.opts = $.extend({
	        mul: true,
	        mime: 'image/*',
	        type: /image.(png|jpeg|gif|jpg)/,
	        maxSize: 1024 * 1024 * 16
	    }, options);

	    this.callback = function (file) {};
	    this.init(container);
	};

	ImgPicker.prototype = {
	    init: function init(container) {
	        var input = $('<input type="file" style="width:0; height:0;" ' + (this.opts.mul ? 'multiple' : '') + ' accept="' + this.opts.mime + '">');
	        container.prepend(input);

	        var that = this;
	        input.change(function (e) {
	            e = e || window.event;
	            that._getFiles(e.target.files);
	        });

	        this.input = input;
	    },

	    select: function select(callback) {
	        this.callback = callback;
	        this.input.click();
	    },

	    _getFiles: function _getFiles(files) {
	        var type = this.opts.type,
	            size = this.opts.maxSize;
	        var that = this;

	        for (var i = 0, f; f = files[i]; i++) {
	            if (f.type.length == 0 && f.name.length > 0 && !/\.(jpg|png|gif)$/.test(f.name.toLowerCase()) || f.type.length > 0 && !type.test(f.type.toLowerCase())) {
	                alert('"' + f.name + '" 类型不是图片');
	                continue;
	            }

	            if (f.size > size) {
	                alert('"' + f.name + '" 大于' + size / 1024 / 1024 + 'M');
	                continue;
	            }
	            this.callback(f);
	        }
	    }
	};

	exports.default = ImgPicker;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var ImgEditor = function ImgEditor(options) {
	    this.opts = $.extend({
	        maxWidth: 0,
	        quality: 0.7,
	        dataFormat: 'base64'
	    }, options);
	};

	ImgEditor.prototype = {
	    getResult: function getResult(file, callback) {
	        var that = this;
	        var maxWidth = parseInt(this.opts.maxWidth),
	            quality = parseFloat(this.opts.quality);
	        var url = URL.createObjectURL(file);
	        if (quality == 0.0) {
	            quality = 1;
	        }

	        var img = new Image();
	        img.addEventListener("load", function () {
	            var width = img.width,
	                height = img.height,
	                scale = width / height;
	            if (maxWidth > 0 && width > maxWidth) {
	                width = maxWidth;
	                height = parseInt(width / scale);
	            }

	            var canvas = document.createElement('canvas');
	            var ctx = canvas.getContext('2d');
	            canvas.width = width;
	            canvas.height = height;

	            ctx.drawImage(img, 0, 0, width, height);

	            URL.revokeObjectURL(url);

	            if (that.opts.dataFormat == 'base64') {
	                var data = canvas.toDataURL(file.type, quality);
	                canvas.width = 0;canvas.height = 0;
	                canvas = null;
	                callback(data, file);
	            } else {
	                canvas.toBlob(function (data) {
	                    callback(data, file);
	                }, file.type, quality);
	            }
	        }, false);

	        img.src = url;
	    }
	};

	exports.default = ImgEditor;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (url, image, options) {
	    var xhr = new XMLHttpRequest();
	    if (!xhr.upload) {
	        return false;
	    }

	    var opts = $.extend({
	        method: "POST",
	        fileName: "media",
	        transData: {},
	        onInit: function onInit() {},
	        onProgress: function onProgress(loaded, total) {},
	        onError: function onError(xhr) {},
	        onSuccess: function onSuccess(xhr) {},
	        onSend: function onSend(formData) {}
	    }, options);

	    opts.onInit();

	    xhr.upload.addEventListener("progress", function (e) {
	        if (e.lengthComputable) {
	            opts.onProgress(e.loaded, e.total);
	        }
	    }, false);

	    xhr.onReadyStateChange = function (e) {
	        if (xhr.readyState == 4) {
	            if (xhr.status == 200) {
	                opts.onSuccess(xhr);
	            } else {
	                opts.onError(xhr);
	            }
	        }
	    };

	    xhr.open(opts.method, url, true);

	    var formData = new FormData();
	    formData.append(opts.fieldName, image, opts.fileName);
	    if (opts.format == 'base64') {
	        formData.append('fileName', opts.fileName);
	    }
	    formData.append('uploadFormat', opts.format);
	    for (var prop in opts.transData) {
	        if (opts.transData.hasOwnProperty(prop)) {
	            formData.append(prop, opts.transData[prop]);
	        }
	    }

	    opts.onSend(formData);
	    xhr.send(formData);
	    return true;
	};

	;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Img = function Img(name, url, container) {
	    var item = $('' + '<div class="up_item">' + '<input type="hidden" name="' + name + '" />' + '<img src="' + url + '" />' + '<progress max="100" value="0"></progress>' + '<a name="none" style="" class="up_close">×</a>' + '</div>' + '');
	    container.append(item);

	    this.root = item;
	    this.deleteImg = $('a', item);
	    this.progress = $('progress', item);
	    this.image = $('img', item);
	    this.value = $('input', item);
	};

	Img.prototype = {
	    setUrl: function setUrl(url) {
	        this.image.attr('src', url);
	    },

	    setValue: function setValue(value) {
	        this.value.val(value);
	    },

	    remove: function remove() {
	        this.root.remove();
	    }
	};

	exports.default = Img;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/.0.21.0@css-loader/index.js!./uploadh5.css", function() {
				var newContent = require("!!./../../../node_modules/.0.21.0@css-loader/index.js!./uploadh5.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, ".h5_uploads::after{\r\n    content: \".\";\r\n    display: block;\r\n    height: 0;\r\n    clear: both;\r\n    visibility: hidden;\r\n}\r\n.h5_uploads { zoom: 1; }\r\n\r\n.h5_uploads .up_selector{\r\n    float: left;\r\n    width:80px;\r\n    height:80px; margin:5px;\r\n    cursor: pointer;\r\n    font-size:40px;\r\n    background:#fff;\r\n    color:gray;\r\n    line-height:80px;\r\n    text-align:center;\r\n    border:1px solid #ccc;\r\n}\r\n\r\n.h5_uploads .up_list{\r\n    display: inline;\r\n}\r\n\r\n.h5_uploads .up_item{\r\n    width:80px; height: 80px;\r\n    margin:5px; overflow: hidden;;\r\n    position: relative;\r\n    float: left;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    align-items: center;\r\n    justify-content: center;\r\n    vertical-align: middle;\r\n}\r\n.h5_uploads .up_item a{\r\n    color:#fff;\r\n    position: absolute;\r\n    top:-3px; right: -3px;\r\n    background: #000;\r\n    opacity: 0.8;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    padding:0 4px;\r\n    line-height:16px;\r\n}\r\n.h5_uploads .up_item progress{\r\n    width:100%;\r\n    margin-top:5px;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left:0;\r\n    opacity: 0.5;\r\n    display: none;\r\n}\r\n.h5_uploads .up_item img{\r\n    max-width:100%;\r\n    cursor: pointer;\r\n}", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);