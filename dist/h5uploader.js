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

	__webpack_require__(8);


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

	var _ImgRender = __webpack_require__(3);

	var _ImgRender2 = _interopRequireDefault(_ImgRender);

	var _Uploader = __webpack_require__(6);

	var _Uploader2 = _interopRequireDefault(_Uploader);

	var _Img = __webpack_require__(7);

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
	        width: 600,
	        quality: 0.6,
	        size: 1024 * 1024 * 4,

	        loading: 'http://ui.jc001.cn/images/loading.gif',
	        _upload: '/index.php?_a=_upload',
	        fileName: 'media',
	        transData: {},
	        onUpload: function onUpload(src) {},
	        onSend: function onSend(F) {}
	    }, options);

	    this.isSetCover = false;

	    this.imgPicker = new _ImgPicker2.default(container, {
	        mul: this.opts.mul,
	        mime: this.opts.mime
	    });

	    this.imgRender = new _ImgRender2.default({
	        width: this.opts.maxWidth,
	        quality: this.opts.quality
	    });
	};

	F.prototype = {
	    init: function init() {
	        this.container.addClass('h5_uploads');
	        this.container.append($('' + '<div class="up_selector icon-plus2 glyphicon glyphicon-camera"></div>' + '<div class="up_list"></div>' + ''));
	        this.list = $('.up_list', this.container);

	        var currentImage = false;
	        if (this.images) {
	            for (var i in this.images) {
	                if (this.images[i].length == 0) {
	                    continue;
	                }
	                var _img = currentImage = this.createImage(this.images[i]);
	                _img.setValue(this.images[i]);
	            }
	        }

	        var that = this;
	        $('.up_selector', this.container).click(function () {
	            var replace = that.list.find('.up_item').size() > 0 && that.opts.mul == false;
	            if (replace) {
	                return false;
	            }

	            that.imgPicker.select(function (file) {
	                var img = that.createImage(that.opts.loading);
	                that.render(file, img);
	            });
	        });
	    },

	    _isCanAdd: function _isCanAdd() {
	        return this.list.has('.up_item').size() == 0 || this.opts.mul == true;
	    },

	    render: function render(file, img) {
	        var that = this;
	        this.imgRender.getResult(file, function (dataBase64, file) {
	            img.setUrl(dataBase64);
	            that._upload(dataBase64, file, img);
	        });
	    },

	    _upload: function upload(data, file, img) {
	        var progress = img.progress;

	        data = data.substr(data.indexOf(',') + 1);
	        var self = this;
	        (0, _Uploader2.default)(this.opts._upload, data, {
	            fileName: this.opts.fileName,
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
	                    alert('上传失败, 原因：' + response.message);
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
	                that.render(file, img);
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
	        size: 1024 * 1024 * 16
	    }, options);

	    this.callback = function (file) {};
	    this.init(container);
	};

	ImgPicker.prototype = {
	    init: function init(container) {
	        var input = $('<input type="file" style="maxWidth:0; height:0;" ' + (this.opts.mul ? 'multiple' : '') + ' accept="' + this.opts.mime + '">');
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

	    _getFiles: function _getFiles(files, callback) {
	        var type = this.opts.type,
	            size = this.opts.size;
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _base = __webpack_require__(4);

	var _JPEGEncoder = __webpack_require__(5);

	var _JPEGEncoder2 = _interopRequireDefault(_JPEGEncoder);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ImgRender = function ImgRender(options) {
	    this.opts = $.extend({
	        maxWidth: 500,
	        quality: 0.2
	    }, options);
	};

	ImgRender.prototype = {
	    getResult: function getResult(file, callback) {
	        var that = this;
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            that.compress(_base.isWebkit ? window.URL.createObjectURL(file) : this.result, file, callback);
	        };
	        reader.readAsDataURL(file);
	    },

	    compress: function compress(url, file, callback) {
	        var maxWidth = this.opts.maxWidth,
	            quality = this.opts.quality;

	        var img = new Image();
	        img.addEventListener("load", function () {
	            var width = img.maxWidth,
	                height = img.height,
	                scale = width / height;
	            if (width > maxWidth) {
	                width = parseInt(maxWidth);
	                height = parseInt(width / scale);
	            }

	            var canvas = document.createElement('canvas');
	            var ctx = canvas.getContext('2d');
	            canvas.maxWidth = width;
	            canvas.height = height;

	            ctx.drawImage(img, 0, 0, width, height);
	            var base64 = void 0;
	            if (_base.isAndroid) {
	                var tmp = ctx.getImageData(0, 0, canvas.maxWidth, canvas.height);
	                quality = quality * 100;
	                var encoder = new _JPEGEncoder2.default(quality);
	                base64 = encoder.encode(tmp, quality);
	            } else {
	                base64 = canvas.toDataURL(file.type, quality);
	            }
	            canvas.maxWidth = 0;
	            canvas.height = 0;
	            canvas = null;

	            callback(base64, file);
	        }, false);
	        img.src = url;
	    }
	};

	exports.default = ImgRender;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var isWebkit = function () {
	    var ua = navigator.userAgent.toLowerCase();
	    var r = /webkit/;
	    return r.test(ua);
	}();

	var isAndroid = function () {
	    var ua = navigator.userAgent.toLowerCase();
	    var r = /android/;
	    return r.test(ua);
	}();

	exports.isWebkit = isWebkit;
	exports.isAndroid = isAndroid;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function JPEGEncoder(quality) {
	    var self = this;
	    var fround = Math.round;
	    var ffloor = Math.floor;
	    var YTable = new Array(64);
	    var UVTable = new Array(64);
	    var fdtbl_Y = new Array(64);
	    var fdtbl_UV = new Array(64);
	    var YDC_HT;
	    var UVDC_HT;
	    var YAC_HT;
	    var UVAC_HT;

	    var bitcode = new Array(65535);
	    var category = new Array(65535);
	    var outputfDCTQuant = new Array(64);
	    var DU = new Array(64);
	    var byteout = [];
	    var bytenew = 0;
	    var bytepos = 7;

	    var YDU = new Array(64);
	    var UDU = new Array(64);
	    var VDU = new Array(64);
	    var clt = new Array(256);
	    var RGB_YUV_TABLE = new Array(2048);
	    var currentQuality;

	    var ZigZag = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];

	    var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
	    var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
	    var std_ac_luminance_values = [0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];

	    var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
	    var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	    var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
	    var std_ac_chrominance_values = [0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa];

	    function initQuantTables(sf) {
	        var YQT = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];

	        for (var i = 0; i < 64; i++) {
	            var t = ffloor((YQT[i] * sf + 50) / 100);
	            if (t < 1) {
	                t = 1;
	            } else if (t > 255) {
	                t = 255;
	            }
	            YTable[ZigZag[i]] = t;
	        }
	        var UVQT = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
	        for (var j = 0; j < 64; j++) {
	            var u = ffloor((UVQT[j] * sf + 50) / 100);
	            if (u < 1) {
	                u = 1;
	            } else if (u > 255) {
	                u = 255;
	            }
	            UVTable[ZigZag[j]] = u;
	        }
	        var aasf = [1.0, 1.387039845, 1.306562965, 1.175875602, 1.0, 0.785694958, 0.541196100, 0.275899379];
	        var k = 0;
	        for (var row = 0; row < 8; row++) {
	            for (var col = 0; col < 8; col++) {
	                fdtbl_Y[k] = 1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
	                fdtbl_UV[k] = 1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
	                k++;
	            }
	        }
	    }

	    function computeHuffmanTbl(nrcodes, std_table) {
	        var codevalue = 0;
	        var pos_in_table = 0;
	        var HT = new Array();
	        for (var k = 1; k <= 16; k++) {
	            for (var j = 1; j <= nrcodes[k]; j++) {
	                HT[std_table[pos_in_table]] = [];
	                HT[std_table[pos_in_table]][0] = codevalue;
	                HT[std_table[pos_in_table]][1] = k;
	                pos_in_table++;
	                codevalue++;
	            }
	            codevalue *= 2;
	        }
	        return HT;
	    }

	    function initHuffmanTbl() {
	        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
	        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
	        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
	        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
	    }

	    function initCategoryNumber() {
	        var nrlower = 1;
	        var nrupper = 2;
	        for (var cat = 1; cat <= 15; cat++) {
	            for (var nr = nrlower; nr < nrupper; nr++) {
	                category[32767 + nr] = cat;
	                bitcode[32767 + nr] = [];
	                bitcode[32767 + nr][1] = cat;
	                bitcode[32767 + nr][0] = nr;
	            }

	            for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
	                category[32767 + nrneg] = cat;
	                bitcode[32767 + nrneg] = [];
	                bitcode[32767 + nrneg][1] = cat;
	                bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
	            }
	            nrlower <<= 1;
	            nrupper <<= 1;
	        }
	    }

	    function initRGBYUVTable() {
	        for (var i = 0; i < 256; i++) {
	            RGB_YUV_TABLE[i] = 19595 * i;
	            RGB_YUV_TABLE[i + 256 >> 0] = 38470 * i;
	            RGB_YUV_TABLE[i + 512 >> 0] = 7471 * i + 0x8000;
	            RGB_YUV_TABLE[i + 768 >> 0] = -11059 * i;
	            RGB_YUV_TABLE[i + 1024 >> 0] = -21709 * i;
	            RGB_YUV_TABLE[i + 1280 >> 0] = 32768 * i + 0x807FFF;
	            RGB_YUV_TABLE[i + 1536 >> 0] = -27439 * i;
	            RGB_YUV_TABLE[i + 1792 >> 0] = -5329 * i;
	        }
	    }

	    function writeBits(bs) {
	        var value = bs[0];
	        var posval = bs[1] - 1;
	        while (posval >= 0) {
	            if (value & 1 << posval) {
	                bytenew |= 1 << bytepos;
	            }
	            posval--;
	            bytepos--;
	            if (bytepos < 0) {
	                if (bytenew == 0xFF) {
	                    writeByte(0xFF);
	                    writeByte(0);
	                } else {
	                    writeByte(bytenew);
	                }
	                bytepos = 7;
	                bytenew = 0;
	            }
	        }
	    }

	    function writeByte(value) {
	        byteout.push(clt[value]);
	    }

	    function writeWord(value) {
	        writeByte(value >> 8 & 0xFF);
	        writeByte(value & 0xFF);
	    }

	    function fDCTQuant(data, fdtbl) {
	        var d0, d1, d2, d3, d4, d5, d6, d7;

	        var dataOff = 0;
	        var i;
	        var I8 = 8;
	        var I64 = 64;
	        for (i = 0; i < I8; ++i) {
	            d0 = data[dataOff];
	            d1 = data[dataOff + 1];
	            d2 = data[dataOff + 2];
	            d3 = data[dataOff + 3];
	            d4 = data[dataOff + 4];
	            d5 = data[dataOff + 5];
	            d6 = data[dataOff + 6];
	            d7 = data[dataOff + 7];

	            var tmp0 = d0 + d7;
	            var tmp7 = d0 - d7;
	            var tmp1 = d1 + d6;
	            var tmp6 = d1 - d6;
	            var tmp2 = d2 + d5;
	            var tmp5 = d2 - d5;
	            var tmp3 = d3 + d4;
	            var tmp4 = d3 - d4;

	            var tmp10 = tmp0 + tmp3;
	            var tmp13 = tmp0 - tmp3;
	            var tmp11 = tmp1 + tmp2;
	            var tmp12 = tmp1 - tmp2;

	            data[dataOff] = tmp10 + tmp11;
	            data[dataOff + 4] = tmp10 - tmp11;

	            var z1 = (tmp12 + tmp13) * 0.707106781;
	            data[dataOff + 2] = tmp13 + z1;
	            data[dataOff + 6] = tmp13 - z1;

	            tmp10 = tmp4 + tmp5;
	            tmp11 = tmp5 + tmp6;
	            tmp12 = tmp6 + tmp7;

	            var z5 = (tmp10 - tmp12) * 0.382683433;
	            var z2 = 0.541196100 * tmp10 + z5;
	            var z4 = 1.306562965 * tmp12 + z5;
	            var z3 = tmp11 * 0.707106781;

	            var z11 = tmp7 + z3;
	            var z13 = tmp7 - z3;

	            data[dataOff + 5] = z13 + z2;
	            data[dataOff + 3] = z13 - z2;
	            data[dataOff + 1] = z11 + z4;
	            data[dataOff + 7] = z11 - z4;

	            dataOff += 8;
	        }

	        dataOff = 0;
	        for (i = 0; i < I8; ++i) {
	            d0 = data[dataOff];
	            d1 = data[dataOff + 8];
	            d2 = data[dataOff + 16];
	            d3 = data[dataOff + 24];
	            d4 = data[dataOff + 32];
	            d5 = data[dataOff + 40];
	            d6 = data[dataOff + 48];
	            d7 = data[dataOff + 56];

	            var tmp0p2 = d0 + d7;
	            var tmp7p2 = d0 - d7;
	            var tmp1p2 = d1 + d6;
	            var tmp6p2 = d1 - d6;
	            var tmp2p2 = d2 + d5;
	            var tmp5p2 = d2 - d5;
	            var tmp3p2 = d3 + d4;
	            var tmp4p2 = d3 - d4;

	            var tmp10p2 = tmp0p2 + tmp3p2;
	            var tmp13p2 = tmp0p2 - tmp3p2;
	            var tmp11p2 = tmp1p2 + tmp2p2;
	            var tmp12p2 = tmp1p2 - tmp2p2;

	            data[dataOff] = tmp10p2 + tmp11p2;
	            data[dataOff + 32] = tmp10p2 - tmp11p2;

	            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781;
	            data[dataOff + 16] = tmp13p2 + z1p2;
	            data[dataOff + 48] = tmp13p2 - z1p2;

	            tmp10p2 = tmp4p2 + tmp5p2;
	            tmp11p2 = tmp5p2 + tmp6p2;
	            tmp12p2 = tmp6p2 + tmp7p2;

	            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433;
	            var z2p2 = 0.541196100 * tmp10p2 + z5p2;
	            var z4p2 = 1.306562965 * tmp12p2 + z5p2;
	            var z3p2 = tmp11p2 * 0.707106781;

	            var z11p2 = tmp7p2 + z3p2;
	            var z13p2 = tmp7p2 - z3p2;

	            data[dataOff + 40] = z13p2 + z2p2;
	            data[dataOff + 24] = z13p2 - z2p2;
	            data[dataOff + 8] = z11p2 + z4p2;
	            data[dataOff + 56] = z11p2 - z4p2;

	            dataOff++;
	        }

	        var fDCTQuant;
	        for (i = 0; i < I64; ++i) {
	            fDCTQuant = data[i] * fdtbl[i];
	            outputfDCTQuant[i] = fDCTQuant > 0.0 ? fDCTQuant + 0.5 | 0 : fDCTQuant - 0.5 | 0;
	        }
	        return outputfDCTQuant;
	    }

	    function writeAPP0() {
	        writeWord(0xFFE0);
	        writeWord(16);
	        writeByte(0x4A);
	        writeByte(0x46);
	        writeByte(0x49);
	        writeByte(0x46);
	        writeByte(0);
	        writeByte(1);
	        writeByte(1);
	        writeByte(0);
	        writeWord(1);
	        writeWord(1);
	        writeByte(0);
	        writeByte(0);
	    }

	    function writeSOF0(width, height) {
	        writeWord(0xFFC0);
	        writeWord(17);
	        writeByte(8);
	        writeWord(height);
	        writeWord(width);
	        writeByte(3);
	        writeByte(1);
	        writeByte(0x11);
	        writeByte(0);
	        writeByte(2);
	        writeByte(0x11);
	        writeByte(1);
	        writeByte(3);
	        writeByte(0x11);
	        writeByte(1);
	    }

	    function writeDQT() {
	        writeWord(0xFFDB);
	        writeWord(132);
	        writeByte(0);
	        for (var i = 0; i < 64; i++) {
	            writeByte(YTable[i]);
	        }
	        writeByte(1);
	        for (var j = 0; j < 64; j++) {
	            writeByte(UVTable[j]);
	        }
	    }

	    function writeDHT() {
	        writeWord(0xFFC4);
	        writeWord(0x01A2);

	        writeByte(0);
	        for (var i = 0; i < 16; i++) {
	            writeByte(std_dc_luminance_nrcodes[i + 1]);
	        }
	        for (var j = 0; j <= 11; j++) {
	            writeByte(std_dc_luminance_values[j]);
	        }

	        writeByte(0x10);
	        for (var k = 0; k < 16; k++) {
	            writeByte(std_ac_luminance_nrcodes[k + 1]);
	        }
	        for (var l = 0; l <= 161; l++) {
	            writeByte(std_ac_luminance_values[l]);
	        }

	        writeByte(1);
	        for (var m = 0; m < 16; m++) {
	            writeByte(std_dc_chrominance_nrcodes[m + 1]);
	        }
	        for (var n = 0; n <= 11; n++) {
	            writeByte(std_dc_chrominance_values[n]);
	        }

	        writeByte(0x11);
	        for (var o = 0; o < 16; o++) {
	            writeByte(std_ac_chrominance_nrcodes[o + 1]);
	        }
	        for (var p = 0; p <= 161; p++) {
	            writeByte(std_ac_chrominance_values[p]);
	        }
	    }

	    function writeSOS() {
	        writeWord(0xFFDA);
	        writeWord(12);
	        writeByte(3);
	        writeByte(1);
	        writeByte(0);
	        writeByte(2);
	        writeByte(0x11);
	        writeByte(3);
	        writeByte(0x11);
	        writeByte(0);
	        writeByte(0x3f);
	        writeByte(0);
	    }

	    function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
	        var EOB = HTAC[0x00];
	        var M16zeroes = HTAC[0xF0];
	        var pos;
	        var I16 = 16;
	        var I63 = 63;
	        var I64 = 64;
	        var DU_DCT = fDCTQuant(CDU, fdtbl);

	        for (var j = 0; j < I64; ++j) {
	            DU[ZigZag[j]] = DU_DCT[j];
	        }
	        var Diff = DU[0] - DC;DC = DU[0];

	        if (Diff == 0) {
	            writeBits(HTDC[0]);
	        } else {
	            pos = 32767 + Diff;
	            writeBits(HTDC[category[pos]]);
	            writeBits(bitcode[pos]);
	        }

	        var end0pos = 63;
	        for (; end0pos > 0 && DU[end0pos] == 0; end0pos--) {};

	        if (end0pos == 0) {
	            writeBits(EOB);
	            return DC;
	        }
	        var i = 1;
	        var lng;
	        while (i <= end0pos) {
	            var startpos = i;
	            for (; DU[i] == 0 && i <= end0pos; ++i) {}
	            var nrzeroes = i - startpos;
	            if (nrzeroes >= I16) {
	                lng = nrzeroes >> 4;
	                for (var nrmarker = 1; nrmarker <= lng; ++nrmarker) {
	                    writeBits(M16zeroes);
	                }nrzeroes = nrzeroes & 0xF;
	            }
	            pos = 32767 + DU[i];
	            writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
	            writeBits(bitcode[pos]);
	            i++;
	        }
	        if (end0pos != I63) {
	            writeBits(EOB);
	        }
	        return DC;
	    }

	    function initCharLookupTable() {
	        var sfcc = String.fromCharCode;
	        for (var i = 0; i < 256; i++) {
	            clt[i] = sfcc(i);
	        }
	    }

	    this.encode = function (image, quality) {
	        var time_start = new Date().getTime();

	        if (quality) setQuality(quality);

	        byteout = new Array();
	        bytenew = 0;
	        bytepos = 7;

	        writeWord(0xFFD8);
	        writeAPP0();
	        writeDQT();
	        writeSOF0(image.maxWidth, image.height);
	        writeDHT();
	        writeSOS();

	        var DCY = 0;
	        var DCU = 0;
	        var DCV = 0;

	        bytenew = 0;
	        bytepos = 7;

	        this.encode.displayName = "_encode_";

	        var imageData = image.data;
	        var width = image.maxWidth;
	        var height = image.height;

	        var quadWidth = width * 4;
	        var tripleWidth = width * 3;

	        var x,
	            y = 0;
	        var r, g, b;
	        var start, p, col, row, pos;
	        while (y < height) {
	            x = 0;
	            while (x < quadWidth) {
	                start = quadWidth * y + x;
	                p = start;
	                col = -1;
	                row = 0;

	                for (pos = 0; pos < 64; pos++) {
	                    row = pos >> 3;
	                    col = (pos & 7) * 4;
	                    p = start + row * quadWidth + col;

	                    if (y + row >= height) {
	                        p -= quadWidth * (y + 1 + row - height);
	                    }

	                    if (x + col >= quadWidth) {
	                        p -= x + col - quadWidth + 4;
	                    }

	                    r = imageData[p++];
	                    g = imageData[p++];
	                    b = imageData[p++];

	                    YDU[pos] = (RGB_YUV_TABLE[r] + RGB_YUV_TABLE[g + 256 >> 0] + RGB_YUV_TABLE[b + 512 >> 0] >> 16) - 128;
	                    UDU[pos] = (RGB_YUV_TABLE[r + 768 >> 0] + RGB_YUV_TABLE[g + 1024 >> 0] + RGB_YUV_TABLE[b + 1280 >> 0] >> 16) - 128;
	                    VDU[pos] = (RGB_YUV_TABLE[r + 1280 >> 0] + RGB_YUV_TABLE[g + 1536 >> 0] + RGB_YUV_TABLE[b + 1792 >> 0] >> 16) - 128;
	                }

	                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
	                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
	                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
	                x += 32;
	            }
	            y += 8;
	        }

	        if (bytepos >= 0) {
	            var fillbits = [];
	            fillbits[1] = bytepos + 1;
	            fillbits[0] = (1 << bytepos + 1) - 1;
	            writeBits(fillbits);
	        }

	        writeWord(0xFFD9);

	        var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

	        byteout = [];

	        var duration = new Date().getTime() - time_start;
	        console.log('Encoding time: ' + duration + 'ms');


	        return jpegDataUri;
	    };

	    function setQuality(quality) {
	        if (quality <= 0) {
	            quality = 1;
	        }
	        if (quality > 100) {
	            quality = 100;
	        }

	        if (currentQuality == quality) return;

	        var sf = 0;
	        if (quality < 50) {
	            sf = Math.floor(5000 / quality);
	        } else {
	            sf = Math.floor(200 - quality * 2);
	        }

	        initQuantTables(sf);
	        currentQuality = quality;
	        console.log('Quality set to: ' + quality + '%');
	    }

	    function init() {
	        var time_start = new Date().getTime();
	        if (!quality) quality = 50;

	        initCharLookupTable();
	        initHuffmanTbl();
	        initCategoryNumber();
	        initRGBYUVTable();

	        setQuality(quality);
	        var duration = new Date().getTime() - time_start;
	        console.log('Initialization ' + duration + 'ms');
	    }

	    init();
	}

	exports.default = JPEGEncoder;

/***/ },
/* 6 */
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
	    formData.append(opts.fileName, image);
	    formData.append('format', 'base64');
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(11)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/.0.21.0@css-loader/index.js!./uploadh5.css", function() {
				var newContent = require("!!./../../node_modules/.0.21.0@css-loader/index.js!./uploadh5.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(10)();
	// imports


	// module
	exports.push([module.id, ".h5_uploads::after{\r\n    content: \".\";\r\n    display: block;\r\n    height: 0;\r\n    clear: both;\r\n    visibility: hidden;\r\n}\r\n.h5_uploads { zoom: 1; }\r\n\r\n.h5_uploads .up_selector{\r\n    float: left;\r\n    maxWidth:80px;\r\n    height:80px; margin:5px;\r\n    cursor: pointer;\r\n    font-size:40px;\r\n    background:#fff;\r\n    color:gray;\r\n    line-height:80px;\r\n    text-align:center;\r\n    border:1px solid #ccc;\r\n}\r\n\r\n.h5_uploads .up_list{\r\n    display: inline;\r\n}\r\n\r\n.h5_uploads .up_item{\r\n    maxWidth:80px; height: 80px;\r\n    margin:5px; overflow: hidden;;\r\n    position: relative;\r\n    float: left;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    align-items: center;\r\n    justify-content: center;\r\n    vertical-align: middle;\r\n}\r\n.h5_uploads .up_item a{\r\n    color:#fff;\r\n    position: absolute;\r\n    top:-3px; right: -3px;\r\n    background: #000;\r\n    opacity: 0.8;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    padding:0 4px;\r\n    line-height:16px;\r\n}\r\n.h5_uploads .up_item progress{\r\n    maxWidth:100%;\r\n    margin-top:5px;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left:0;\r\n    opacity: 0.5;\r\n    display: none;\r\n}\r\n.h5_uploads .up_item img{\r\n    max-maxWidth:100%;\r\n    cursor: pointer;\r\n}", ""]);

	// exports


/***/ },
/* 10 */
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
/* 11 */
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